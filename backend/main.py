from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import hashlib
from app.models import RouteRequest, RouteResponse, QuotationCreate

# Import your existing models and agents
from app.models import RouteRequest, RouteResponse
from app.agents.route_agent import RouteAgent
from app.agents.pricing_agent import PricingAgent

app = FastAPI(
    title="Agentic Maritime Brokerage Platform",
    description="AI-powered maritime freight quotation and routing engine",
    version="1.0.0"
)

# CORS configuration to allow local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Agents
route_agent = RouteAgent()
pricing_agent = PricingAgent()

# ==========================================
# DATABASE SETUP & SECURITY LOGIC
# ==========================================

def init_db():
    """Initializes the SQLite database and creates the necessary tables."""
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    # Existing users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    ''')
    # New quotations table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS quotations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quote_id TEXT UNIQUE NOT NULL,
            user_name TEXT NOT NULL,
            origin TEXT NOT NULL,
            destination TEXT NOT NULL,
            cargo_type TEXT NOT NULL,
            containers INTEGER NOT NULL,
            route_name TEXT NOT NULL,
            route_score REAL NOT NULL,
            transit_days INTEGER NOT NULL,
            total_cost_usd REAL NOT NULL,
            status TEXT DEFAULT 'Booked',
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Run database initialization on startup
init_db()

def hash_password(password: str) -> str:
    """Hashes the password using SHA-256 for secure storage."""
    return hashlib.sha256(password.encode()).hexdigest()

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

# ==========================================
# AUTHENTICATION API ENDPOINTS
# ==========================================

@app.post("/api/signup", tags=["Auth"])
def signup(user: SignupRequest):
    """Registers a new user and saves them to the SQLite database."""
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    
    try:
        # Attempt to insert the new user with a hashed password
        cursor.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
            (user.name, user.email, hash_password(user.password))
        )
        conn.commit()
    except sqlite3.IntegrityError:
        # IntegrityError occurs if the email already exists in the unique column
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="This email is already registered. Please log in."
        )
    finally:
        conn.close()
        
    return {"status": "success", "message": "Account created successfully.", "name": user.name}

# ==========================================
# QUOTATION API ENDPOINTS
# ==========================================

@app.post("/api/quotations/save", tags=["Quotations"])
def save_quotation(quote: QuotationCreate):
    """Saves a confirmed quotation to the database."""
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    
    # Generate a sleek Quote ID based on current row count
    cursor.execute("SELECT COUNT(*) FROM quotations")
    count = cursor.fetchone()[0]
    quote_id = f"Q-{1000 + count + 1}"
    
    try:
        cursor.execute('''
            INSERT INTO quotations (
                quote_id, user_name, origin, destination, cargo_type, 
                containers, route_name, route_score, transit_days, total_cost_usd
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            quote_id, quote.user_name, quote.origin, quote.destination, quote.cargo_type,
            quote.containers, quote.route_name, quote.route_score, quote.transit_days, quote.total_cost_usd
        ))
        conn.commit()
        return {"status": "success", "message": "Quotation saved.", "quote_id": quote_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/api/quotations/list", tags=["Quotations"])
def list_quotations(user_name: str):
    """Retrieves all quotations for a specific user."""
    conn = sqlite3.connect("users.db")
    conn.row_factory = sqlite3.Row  # Returns dict-like rows instead of tuples
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT quote_id, origin, destination, cargo_type, containers, 
               route_name, route_score, transit_days, total_cost_usd, status, timestamp
        FROM quotations 
        WHERE user_name = ?
        ORDER BY timestamp DESC
    ''', (user_name,))
    
    rows = cursor.fetchall()
    conn.close()
    
    return {"status": "success", "data": [dict(row) for row in rows]}

@app.post("/api/login", tags=["Auth"])
def login(user: LoginRequest):
    """Verifies user credentials against the SQLite database."""
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    
    # Fetch the user's name and hashed password based on the provided email
    cursor.execute("SELECT name, password_hash FROM users WHERE email = ?", (user.email,))
    db_user = cursor.fetchone()
    conn.close()

    # db_user will be None if the email doesn't exist
    # db_user[1] contains the stored hash to compare against the incoming password
    if not db_user or db_user[1] != hash_password(user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid email or password. Access denied."
        )
    
    return {"status": "success", "name": db_user[0]}

# ==========================================
# ROUTE INTELLIGENCE API ENDPOINTS
# ==========================================

@app.get("/", tags=["Health Check"])
def health_check():
    """System health check and milestone verification."""
    return {
        "status": "online",
        "message": "Agentic Maritime Brokerage API is running",
        "milestone": "Milestone 1 - Route Intelligence & Quotation Foundation"
    }

@app.post("/api/routes/analyze")
def analyze_route(request: RouteRequest):
    try:
        # 1. Ask Route Agent to find the best pathway
        route_result = route_agent.analyze_route(
            origin=request.origin,
            destination=request.destination,
            cargo_type=request.cargo_type,
            containers=request.containers
        )

        # Handle case where no route is found
        if route_result.get("status") == "not_found":
            return route_result

        # 2. Extract the dynamic metrics needed for algorithmic pricing
        # We use .get() with fallbacks just to be safe
        distance = route_result.get("distance_nm", 8000) 
        transshipments = route_result.get("transshipments", 0)

        # 3. Ask Pricing Agent to calculate costs using the new metrics
        pricing_result = pricing_agent.calculate_price(
            origin=request.origin,
            destination=request.destination,
            distance_nm=distance,          # <-- Added missing argument
            cargo_type=request.cargo_type,
            containers=request.containers,
            transshipments=transshipments  # <-- Added missing argument
        )

        # 4. Merge the data and return to the React frontend
        route_result["pricing"] = pricing_result
        return route_result

    except Exception as e:
        return {"status": "error", "detail": f"Agent computation error: {str(e)}"}
    
def analyze_route(payload: RouteRequest):
    """
    Receives shipment specifications and triggers both the Route Agent
    and Pricing Agent to return optimal maritime pathways and financial costs.
    """
    if payload.origin.strip().lower() == payload.destination.strip().lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Origin port and Destination port cannot be the same."
        )

    if payload.containers <= 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Container quantity must be at least 1 unit."
        )

    try:
        # Trigger Route Agent
        agent_result = route_agent.analyze_routes(payload)
        
        # Trigger Pricing Agent
        pricing_result = pricing_agent.calculate_price(
            origin=payload.origin,
            destination=payload.destination,
            cargo_type=payload.cargo_type,
            containers=payload.containers
        )
        
        return {
            "status": "success",
            "recommended_route": agent_result["recommended_route"],
            "alternatives": agent_result["alternatives"],
            "explanation": agent_result["explanation"],
            "pricing": pricing_result  # INJECTED PRICING HERE
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Agent computation error: {str(e)}"
        )