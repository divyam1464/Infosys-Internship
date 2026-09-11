# Inside QuotationService.generate_quotation()

# 1. Get the route from the RouteAgent
route_result = self.route_agent.analyze_route(origin, destination, cargo_type, containers)

# 2. Extract distance and transshipments from the route result
distance = route_result.get("distance_nm", 8000) 
transshipments = route_result.get("transshipments", 0)

# 3. Pass them to the PricingAgent
pricing_result = self.pricing_agent.calculate_price(
    origin=origin,
    destination=destination,
    distance_nm=distance,         # <--- NEW DYNAMIC INPUT
    cargo_type=cargo_type,
    containers=containers,
    transshipments=transshipments # <--- NEW DYNAMIC INPUT
)