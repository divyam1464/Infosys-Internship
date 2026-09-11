import pandas as pd
import os
import random

class PricingAgent:
    def __init__(self):
        """Initializes the Pricing Agent with Global Market Indices and Port Tariffs."""
        
        # Simulated Live Global Market Rates
        self.market_rate_per_nm = 0.18  # Base Ocean Freight: $0.18 per Nautical Mile
        self.global_bunker_rate = 0.04  # Base Fuel/BAF: $0.04 per Nautical Mile

        # Cargo Risk Profiles (Multiplier, Classification)
        self.cargo_profiles = {
            'Electronics': {'multiplier': 1.15, 'classification': 'High-Theft/Fragile'},
            'Machinery':   {'multiplier': 1.25, 'classification': 'Heavy/Oversized'},
            'Chemicals':   {'multiplier': 1.40, 'classification': 'Hazardous/Hazmat'},
            'Textiles':    {'multiplier': 1.00, 'classification': 'Standard Retail'},
            'FMCG':        {'multiplier': 1.05, 'classification': 'Time-Sensitive/Perishable'},
            'Auto Parts':  {'multiplier': 1.10, 'classification': 'Industrial Standard'}
        }

        # Load Local Port Tariffs
        current_dir = os.path.dirname(os.path.abspath(__file__))
        self.csv_path = os.path.join(current_dir, '../data/port_tariffs.csv')
        
        try:
            # Set port_name as the index for instant O(1) lookups
            self.port_data = pd.read_csv(self.csv_path).set_index('port_name')
        except FileNotFoundError:
            print("Warning: port_tariffs.csv not found. Agent will use global averages.")
            self.port_data = pd.DataFrame()

    def _get_port_economics(self, port_name: str):
        """Fetches specific port tariffs, with a dynamic fallback for unmapped global ports."""
        if not self.port_data.empty and port_name in self.port_data.index:
            return self.port_data.loc[port_name]
        
        # If port isn't in CSV, the system doesn't break; it uses global averages
        return pd.Series({
            'handling_fee_usd': 220.0,
            'congestion_factor': 1.05,
            'regional_risk_premium': 15.0
        })

    def calculate_price(self, origin: str, destination: str, distance_nm: int, cargo_type: str, containers: int, transshipments: int = 0):
        """Calculates dynamic, distance-based freight pricing."""
        
        # 1. Fetch Local Port Economics
        origin_port = self._get_port_economics(origin)
        dest_port = self._get_port_economics(destination)

        # 2. Simulate Live Market Demand Fluctuation (Between 0.95x and 1.15x)
        demand_factor = round(random.uniform(0.95, 1.15), 2)

        # 3. Base Ocean Freight = Distance * Rate * Congestion * Demand
        route_congestion = (origin_port['congestion_factor'] + dest_port['congestion_factor']) / 2
        base_freight = distance_nm * self.market_rate_per_nm * route_congestion * demand_factor

        # 4. Bunker/Fuel Surcharge = Distance * Fuel Rate
        base_baf = distance_nm * self.global_bunker_rate

        # 5. Apply Cargo Specifications (Heavier/Hazardous cargo burns more fuel and costs more to insure)
        profile = self.cargo_profiles.get(cargo_type, {'multiplier': 1.0, 'classification': 'General Cargo'})
        multiplier = profile['multiplier']

        adjusted_freight = base_freight * multiplier
        adjusted_baf = base_baf * (1 + ((multiplier - 1) * 0.5)) # Fuel scales at half the rate of freight weight
        
        # 6. Transshipment & Risk Fees
        ts_fee_per_container = transshipments * 275.0
        total_risk_premium = origin_port['regional_risk_premium'] + dest_port['regional_risk_premium']

        # 7. Total Per Container Cost Calculation
        per_container = (
            adjusted_freight + 
            adjusted_baf + 
            origin_port['handling_fee_usd'] + 
            dest_port['handling_fee_usd'] + 
            ts_fee_per_container + 
            total_risk_premium
        )
        total_operating_cost = per_container * containers

        # 8. Dynamic Agent Reasoning Log for the Frontend Dashboard
        reasoning = (
            f"Pricing Agent calculated {distance_nm:,} NM transit. "
            f"Global demand factor currently at {demand_factor}x. "
            f"Cargo classified as '{profile['classification']}', applying a {multiplier}x freight multiplier. "
        )
        if transshipments > 0:
            reasoning += f"Added ${ts_fee_per_container:,.2f} per TEU for {transshipments} transfer(s). "
        if total_risk_premium > 0:
            reasoning += f"Regional risk premium of ${total_risk_premium} applied based on terminal data."

        return {
            "status": "success",
            "financial_breakdown": {
                "base_freight": round(adjusted_freight * containers, 2),
                "bunker_adjustment": round(adjusted_baf * containers, 2),
                "origin_handling": round(origin_port['handling_fee_usd'] * containers, 2),
                "destination_handling": round(dest_port['handling_fee_usd'] * containers, 2),
                "transshipment_fee": round(ts_fee_per_container * containers, 2),
                "route_risk_premium": round(total_risk_premium * containers, 2)
            },
            "per_container_usd": round(per_container, 2),
            "total_operating_cost_usd": round(total_operating_cost, 2),
            "agent_metrics": {
                "demand_factor": demand_factor,
                "cargo_multiplier": multiplier
            },
            "currency": "USD",
            "agent_reasoning": reasoning
        }