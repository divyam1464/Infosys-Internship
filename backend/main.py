from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import hashlib

# Import your existing models and agents
from app.models import RouteRequest, RouteResponse
from app.agents.route_agent import RouteAgent

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

# Initialize the Route Agent
route_agent = RouteAgent()

# ==========================================
# DATABASE SETUP & SECURITY LOGIC
# ==========================================

def init_db():
    """Initializes the SQLite database and creates the users table if it doesn't exist."""
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
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

@app.post(
    "/api/routes/analyze",
    response_model=RouteResponse,
    status_code=status.HTTP_200_OK,
    tags=["Route Intelligence"]
)
def analyze_route(payload: RouteRequest):
    """
    Receives shipment specifications and triggers the Route Agent
    to score and return optimal maritime pathways.
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
        agent_result = route_agent.analyze_routes(payload)
        return {
            "status": "success",
            "recommended_route": agent_result["recommended_route"],
            "alternatives": agent_result["alternatives"],
            "explanation": agent_result["explanation"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Route Agent computation error: {str(e)}"
        )