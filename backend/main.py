from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
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
    # Validation Rule: Origin and Destination must differ
    if payload.origin.strip().lower() == payload.destination.strip().lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Origin port and Destination port cannot be the same."
        )

    # Validation Rule: Container quantity integrity check
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