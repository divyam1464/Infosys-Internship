from pydantic import BaseModel, Field
from typing import List, Optional

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

class RouteResponse(BaseModel):
    status: str
    recommended_route: RouteDetail
    alternatives: List[RouteDetail]
    explanation: List[str]