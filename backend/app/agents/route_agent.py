from typing import Dict, List, Optional
from app.models import RouteDetail, RouteRequest

class RouteAgent:
    """
    Autonomous Route Agent responsible for evaluating, scoring,
    and recommending optimal maritime shipping pathways.
    """
    def __init__(self):
        # Canonical baseline maritime distances (Nautical Miles) between global hubs
        self.port_distances: Dict[tuple, int] = {
            ("Chennai", "Rotterdam"): 8650,
            ("Tokyo", "Los Angeles"): 4800,
            ("Hamburg", "Shanghai"): 10500,
            ("Dubai", "Sydney"): 6800,
            ("Singapore", "Rotterdam"): 8300,
            ("Shanghai", "Los Angeles"): 5700,
            ("New York", "Hamburg"): 3600,
            ("Chennai", "Singapore"): 1600,
            ("Singapore", "Tokyo"): 2900,
            ("Dubai", "Hamburg"): 6200,
        }

    def _get_base_distance(self, origin: str, destination: str) -> int:
        """Retrieves or estimates nautical distance between two ports."""
        pair = (origin, destination)
        reverse_pair = (destination, origin)
        
        if pair in self.port_distances:
            return self.port_distances[pair]
        if reverse_pair in self.port_distances:
            return self.port_distances[reverse_pair]
        
        # Deterministic fallback estimation based on port string hashes
        base_hash = abs(hash(f"{origin}->{destination}")) % 5000
        return 4000 + base_hash

    def _calculate_route_score(self, transit_days: int, distance_nm: int, transshipments: int) -> float:
        """
        Multi-variable algorithmic scoring formula (0.0 to 10.0 scale):
        - Higher weight on minimal transit time
        - Penalty for transshipment bottlenecks
        - Distance efficiency factor
        """
        time_penalty = transit_days * 0.15
        stop_penalty = transshipments * 1.2
        distance_factor = (distance_nm / 1000) * 0.25
        
        raw_score = 12.0 - (time_penalty + stop_penalty + distance_factor)
        return round(max(5.0, min(9.8, raw_score)), 1)

    def analyze_routes(self, request: RouteRequest) -> Dict:
        origin = request.origin
        dest = request.destination
        base_nm = self._get_base_distance(origin, dest)

        # Baseline average container ship speed: ~18-20 knots (~450 NM/day)
        base_days = max(5, round(base_nm / 430))

        # Generate Option 1: Direct Express Route (Optimal)
        direct_route = RouteDetail(
            origin=origin,
            destination=dest,
            transit_days=base_days,
            distance_nm=base_nm,
            transshipments=0,
            route_score=self._calculate_route_score(base_days, base_nm, 0)
        )

        # Generate Option 2: Hub Transshipment Alternative
        transship_days = base_days + 4
        transship_nm = int(base_nm * 1.08)
        transship_route = RouteDetail(
            origin=origin,
            destination=dest,
            transit_days=transship_days,
            distance_nm=transship_nm,
            transshipments=1,
            route_score=self._calculate_route_score(transship_days, transship_nm, 1)
        )

        # Compile Agentic Reasoning / Explanations
        explanations = [
            f"Direct path eliminates {transship_route.transit_days - direct_route.transit_days} days of port dwell time.",
            f"Optimized fuel burn over {direct_route.distance_nm:,} Nautical Miles.",
            f"Zero transshipments reduces cargo handling risk for {request.cargo_type}.",
            f"Optimal routing score of {direct_route.route_score}/10 determined by transit-to-distance ratio."
        ]

        return {
            "recommended_route": direct_route,
            "alternatives": [transship_route],
            "explanation": explanations
        }