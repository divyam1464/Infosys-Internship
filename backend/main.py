from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import bcrypt
import json
from contextlib import asynccontextmanager

from app.models import (
    RouteRequest, RouteResponse, UserCreate, UserLogin, 
    TokenResponse, QuotationCreate, QuotationStatusUpdate
)
from app.agents.route_agent import RouteAgent
from app.agents.pricing_agent import PricingAgent
from database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

route_agent = RouteAgent()
pricing_agent = PricingAgent()

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

@app.post("/api/signup")
def signup(user: UserCreate):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    try:
        hashed_pw = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
        cursor.execute(
            "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
            (user.email, hashed_pw.decode('utf-8'), 'customer')
        )
        conn.commit()
        user_id = cursor.lastrowid
        return {"message": "User created", "user_id": user_id, "role": "customer"}
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")
    finally:
        conn.close()

@app.post("/api/login", response_model=TokenResponse)
def login(user: UserLogin):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, password, role FROM users WHERE email=?", (user.email,))
    db_user = cursor.fetchone()
    conn.close()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user_id, hashed_pw, role = db_user
    if not bcrypt.checkpw(user.password.encode('utf-8'), hashed_pw.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "access_token": "temp_jwt_token_placeholder",
        "token_type": "bearer",
        "role": role,
        "user_id": user_id
    }

@app.post("/api/quotations/save")
def save_quotation(quote: QuotationCreate):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    route_data_str = json.dumps(quote.route_data)
    try:
        cursor.execute(
            """
            INSERT INTO quotations (user_id, route_data, base_freight, margin, total_price, status)
            VALUES (?, ?, ?, ?, ?, 'pending')
            """,
            (quote.user_id, route_data_str, quote.base_freight, quote.margin, quote.total_price)
        )
        conn.commit()
        return {"message": "Saved successfully", "status": "pending"}
    except Exception:
        conn.close()
        raise HTTPException(status_code=500, detail="Failed to save quotation")
    finally:
        conn.close()

@app.get("/api/quotations/customer/{user_id}")
def get_customer_quotations(user_id: int):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id, route_data, base_freight, total_price, status, created_at 
        FROM quotations WHERE user_id = ? ORDER BY created_at DESC
        """, 
        (user_id,)
    )
    rows = cursor.fetchall()
    conn.close()
    quotations = []
    for row in rows:
        quotations.append({
            "id": row[0],
            "route_data": json.loads(row[1]),
            "base_freight": row[2],
            "total_price": row[3],
            "status": row[4],
            "created_at": row[5]
        })
    return {"quotations": quotations}

@app.get("/api/quotations/admin")
def get_all_quotations():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id, user_id, route_data, base_freight, margin, total_price, status, created_at 
        FROM quotations ORDER BY created_at DESC
        """
    )
    rows = cursor.fetchall()
    conn.close()
    quotations = []
    for row in rows:
        quotations.append({
            "id": row[0],
            "user_id": row[1],
            "route_data": json.loads(row[2]),
            "base_freight": row[3],
            "margin": row[4],
            "total_price": row[5],
            "status": row[6],
            "created_at": row[7]
        })
    return {"quotations": quotations}

@app.put("/api/quotations/admin/status/{quotation_id}")
def update_quotation_status(quotation_id: int, status_update: QuotationStatusUpdate):
    if status_update.status not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM quotations WHERE id = ?", (quotation_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Quotation not found")
    cursor.execute(
        "UPDATE quotations SET status = ? WHERE id = ?",
        (status_update.status, quotation_id)
    )
    conn.commit()
    conn.close()
    return {"message": "Status updated"}