from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models import RouteRequest
from app.agents.route_agent import RouteAgent

app = FastAPI(
    title="Agentic Maritime Brokerage Platform",
    description="AI-powered maritime freight quotation platform",
    version="1.0.0"
)

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = RouteAgent()

@app.get("/")
def home():
    return {
        "message": "Agentic Maritime Brokerage API is running",
        "project": "Maritime Freight Quotation Platform",
        "milestone": "Milestone 1 - Route Intelligence"
    }

@app.post("/api/routes/analyze")
def analyze_route(request: RouteRequest):
    # Pass the Pydantic validated data to the Route Agent
    result = agent.analyze_routes(
        origin=request.origin,
        destination=request.destination,
        cargo_type=request.cargo_type,
        containers=request.containers
    )
    return result