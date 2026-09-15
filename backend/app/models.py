from pydantic import BaseModel, Field
from typing import List, Dict, Any

class RouteRequest(BaseModel):
    origin: str = Field(..., example="Chennai", description="Origin port name")
    destination: str = Field(..., example="Rotterdam", description="Destination port name")
    cargo_type: str = Field(..., example="Electronics", description="Type of cargo being transported")
    containers: int = Field(..., gt=0, example=10, description="Quantity of shipping containers (must be >= 1)")

class RouteDetail(BaseModel):
    origin: str
    destination: str
    transit_days: int
    distance_nm: int
    transshipments: int
    route_score: float
    via_ports: List[str] = []

class RouteResponse(BaseModel):
    status: str
    recommended_route: RouteDetail
    alternatives: List[RouteDetail]
    explanation: List[str]
    pricing: Dict[str, Any]

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int

class QuotationCreate(BaseModel):
    user_id: int
    route_data: Dict[str, Any]
    base_freight: float
    margin: float
    total_price: float

class QuotationStatusUpdate(BaseModel):
    status: str