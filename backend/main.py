from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import hashlib
from app.models import RouteRequest, RouteResponse, QuotationCreate
from app.agents.route_agent import RouteAgent
from app.agents.pricing_agent import PricingAgent

app = FastAPI(
    title="Agentic Maritime Brokerage Platform",
    description="AI-powered maritime freight quotation and routing engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

route_agent = RouteAgent()
pricing_agent = PricingAgent()

def init_db():
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

init_db()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/signup", tags=["Auth"])
def signup(user: SignupRequest):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
            (user.name, user.email, hash_password(user.password))
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="This email is already registered. Please log in."
        )
    finally:
        conn.close()
    return {"status": "success", "name": user.name}

@app.post("/api/login", tags=["Auth"])
def login(user: LoginRequest):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT name, password_hash FROM users WHERE email = ?", (user.email,))
    db_user = cursor.fetchone()
    conn.close()
    if not db_user or db_user[1] != hash_password(user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid email or password. Access denied."
        )
    return {"status": "success", "name": db_user[0]}

@app.post("/api/quotations/save", tags=["Quotations"])
def save_quotation(quote: QuotationCreate):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
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
        return {"status": "success", "quote_id": quote_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/api/quotations/list", tags=["Quotations"])
def list_quotations(user_name: str):
    conn = sqlite3.connect("users.db")
    conn.row_factory = sqlite3.Row
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

@app.get("/", tags=["Health Check"])
def health_check():
    return {"status": "online"}

@app.post("/api/routes/analyze")
def analyze_route(payload: RouteRequest):
    if payload.origin.strip().lower() == payload.destination.strip().lower():
        raise HTTPException(
            status_code=400,
            detail="Origin port and Destination port cannot be the same."
        )
    if payload.containers <= 0:
        raise HTTPException(
            status_code=422,
            detail="Container quantity must be at least 1 unit."
        )
    try:
        agent_result = route_agent.analyze_routes(payload)
        if isinstance(agent_result, dict) and agent_result.get("status") == "not_found":
            return agent_result
        
        try:
            pricing_result = pricing_agent.calculate_price(
                origin=payload.origin,
                destination=payload.destination,
                cargo_type=payload.cargo_type,
                containers=payload.containers
            )
        except TypeError:
            pricing_result = pricing_agent.calculate_price(
                origin=payload.origin,
                destination=payload.destination,
                distance_nm=8000,
                cargo_type=payload.cargo_type,
                containers=payload.containers,
                transshipments=0
            )
        
        if hasattr(pricing_result, "dict"):
            pricing_result = pricing_result.dict()
        elif hasattr(pricing_result, "model_dump"):
            pricing_result = pricing_result.model_dump()
            
        if isinstance(pricing_result, dict) and "breakdown" not in pricing_result:
            pricing_result = {
                "breakdown": {
                    "base_freight": pricing_result.get("base_freight", 1500),
                    "bunker_adjustment": pricing_result.get("bunker_adjustment", 300),
                    "origin_handling": pricing_result.get("origin_handling", 150),
                    "destination_handling": pricing_result.get("destination_handling", 150),
                    "transshipment_fee": pricing_result.get("transshipment_fee", 0)
                },
                "total_cost_usd": pricing_result.get("total_cost_usd", 2100)
            }

        return {
            "status": "success",
            "recommended_route": agent_result.get("recommended_route") if isinstance(agent_result, dict) else agent_result.recommended_route,
            "alternatives": agent_result.get("alternatives", []) if isinstance(agent_result, dict) else getattr(agent_result, 'alternatives', []),
            "explanation": agent_result.get("explanation", []) if isinstance(agent_result, dict) else getattr(agent_result, 'explanation', []),
            "pricing": pricing_result
        }
    except Exception as e:
        return {"status": "error", "detail": str(e)}