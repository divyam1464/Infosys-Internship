from typing import Dict, List
from app.models import RouteDetail, RouteRequest

class RouteAgent:
    """
    Autonomous Route Agent responsible for evaluating, scoring,
    and ranking multiple maritime shipping pathways.
    """
    def __init__(self):
        # Baseline distances (Nautical Miles)
        self.port_distances: Dict[tuple, int] = {
            ("Chennai", "Rotterdam"): 8650,
            ("Tokyo", "Los Angeles"): 4800,
            ("Hamburg", "Shanghai"): 10500,
            ("Dubai", "Sydney"): 6800,
            ("Singapore", "Rotterdam"): 8300,
            ("Shanghai", "Los Angeles"): 5700,
            ("New York", "Hamburg"): 3600,
        }

    def _get_base_distance(self, origin: str, destination: str) -> int:
        pair = (origin, destination)
        reverse_pair = (destination, origin)
        if pair in self.port_distances:
            return self.port_distances[pair]
        if reverse_pair in self.port_distances:
            return self.port_distances[reverse_pair]
        
        # Fallback estimation
        base_hash = abs(hash(f"{origin}->{destination}")) % 5000
        return 4000 + base_hash

    def _calculate_route_score(self, transit_days: int, distance_nm: int, transshipments: int) -> float:
        """Mathematical scoring formula (0.0 to 10.0)"""
        time_penalty = transit_days * 0.15
        stop_penalty = transshipments * 1.2
        distance_factor = (distance_nm / 1000) * 0.25
        
        raw_score = 12.0 - (time_penalty + stop_penalty + distance_factor)
        return round(max(5.0, min(9.9, raw_score)), 1)

    def analyze_routes(self, request: RouteRequest) -> Dict:
        origin = request.origin
        dest = request.destination
        base_nm = self._get_base_distance(origin, dest)
        base_days = max(5, round(base_nm / 430))

        all_routes: List[RouteDetail] = []

        # Route Option 1: Direct Express
        score_1 = self._calculate_route_score(base_days, base_nm, 0)
        all_routes.append(RouteDetail(
            origin=origin, destination=dest, transit_days=base_days, 
            distance_nm=base_nm, transshipments=0, route_score=score_1, via_ports=[]
        ))

        # Route Option 2: Transshipment via Primary Hub
        hub1 = "Dubai" if origin != "Dubai" and dest != "Dubai" else "Singapore"
        t1_nm = int(base_nm * 1.08)
        t1_days = base_days + 4
        score_2 = self._calculate_route_score(t1_days, t1_nm, 1)
        all_routes.append(RouteDetail(
            origin=origin, destination=dest, transit_days=t1_days, 
            distance_nm=t1_nm, transshipments=1, route_score=score_2, via_ports=[hub1]
        ))

        # Route Option 3: Transshipment via Alternative Hub
        hub2 = "Colombo" if origin != "Colombo" and dest != "Colombo" else "Algeciras"
        t2_nm = int(base_nm * 1.15)
        t2_days = base_days + 6
        score_3 = self._calculate_route_score(t2_days, t2_nm, 1)
        all_routes.append(RouteDetail(
            origin=origin, destination=dest, transit_days=t2_days, 
            distance_nm=t2_nm, transshipments=1, route_score=score_3, via_ports=[hub2]
        ))

        # Route Option 4: Multi-Stop (Slower but potentially cheaper)
        t3_nm = int(base_nm * 1.25)
        t3_days = base_days + 9
        score_4 = self._calculate_route_score(t3_days, t3_nm, 2)
        all_routes.append(RouteDetail(
            origin=origin, destination=dest, transit_days=t3_days, 
            distance_nm=t3_nm, transshipments=2, route_score=score_4, via_ports=[hub1, hub2]
        ))

        # ------------------------------------------------------------------
        # THE CORE AI LOGIC: Sort all generated routes by highest score
        # ------------------------------------------------------------------
        all_routes.sort(key=lambda route: route.route_score, reverse=True)

        # The best route becomes the recommendation; the rest are alternatives
        best_route = all_routes[0]
        alternatives = all_routes[1:]

        # Dynamic Explanations based on the winning route
        explanations = [
            f"Evaluated {len(all_routes)} distinct maritime pathways from {origin} to {dest}.",
            f"Top recommendation selected due to highest efficiency score of {best_route.route_score}/10.",
            f"Direct path eliminates excess port dwell time." if best_route.transshipments == 0 else f"Routing via {best_route.via_ports[0]} provided the optimal balance of distance and transit time.",
            f"Total nautical miles minimized to {best_route.distance_nm:,} NM."
        ]

        return {
            "recommended_route": best_route,
            "alternatives": alternatives,
            "explanation": explanations
        }