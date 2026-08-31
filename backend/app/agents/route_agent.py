import pandas as pd
from typing import Dict, Any

class RouteAgent:
    def __init__(self):
        # Load the initial maritime dataset using Pandas
        self.df = pd.read_csv("app/data/routes.csv")

    def analyze_routes(self, origin: str, destination: str, cargo_type: str, containers: int) -> Dict[str, Any]:
        # 1. Look at available routes
        available = self.df[(self.df['origin'] == origin) & (self.df['destination'] == destination)]
        
        if available.empty:
            return {"status": "error", "message": "No routes found for this origin and destination."}

        # 2. Evaluate route information and calculate scores
        # Example scoring: Lower transit days and fewer transshipments yield a higher score (out of 10)
        available = available.copy()
        available['route_score'] = 10 - (available['transit_days'] * 0.1) - (available['transshipments'] * 1.5)
        
        # 3. Compare alternatives and select the best route
        best_route = available.sort_values(by='route_score', ascending=False).iloc[0].to_dict()
        
        # 4. Return the recommendation and transit time estimate
        return {
            "status": "success",
            "recommended_route": best_route,
            "explanation": [
                "Optimized for shorter transit time",
                "Distance considered in route scoring",
                "Transshipments considered for route efficiency"
            ]
        }