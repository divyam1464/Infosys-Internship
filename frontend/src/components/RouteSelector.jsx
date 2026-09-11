import React from "react";
import { Clock, Compass, Anchor, ArrowRight, ShieldCheck } from "lucide-react";

export default function RouteSelector({ routes, selectedRoute, onSelectRoute }) {
  return (
    <div className="space-y-3 my-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
          Available Maritime Pathways ({routes.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {routes.map((route) => {
          const isSelected = selectedRoute?.id === route.id;

          return (
            <div
              key={route.id}
              onClick={() => onSelectRoute(route)}
              className={`relative cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                isSelected
                  ? "bg-slate-900/90 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50"
                  : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between border-b border-slate-800/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                      route.is_recommended ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    #{route.rank}
                  </div>
                  <h4 className="text-sm font-semibold text-white">{route.name}</h4>
                  {route.is_recommended && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                      <ShieldCheck className="h-3 w-3" /> Recommended
                    </span>
                  )}
                </div>
                
                <div className="text-right">
                  <span className="text-xs text-slate-400">Score: </span>
                  <span className="font-mono text-sm font-bold text-indigo-400">{route.route_score}</span>
                  <span className="text-[11px] text-slate-500">/10</span>
                </div>
              </div>

              <div className="py-3">
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  {route.stops.map((stop, idx) => (
                    <React.Fragment key={idx}>
                      <span className={`inline-flex items-center px-2 py-1 rounded-md font-medium border ${
                          stop.type === "origin" ? "bg-blue-950/60 text-blue-300 border-blue-800/40"
                            : stop.type === "destination" ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/40"
                            : "bg-slate-800/80 text-slate-300 border-slate-700/50"
                        }`}
                      >
                        {stop.port}
                      </span>
                      {idx < route.stops.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-slate-600" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6 border-t border-slate-800/60 pt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> <strong className="text-slate-200">{route.transit_days}</strong> days</span>
                <span className="flex items-center gap-1.5"><Compass className="h-3.5 w-3.5" /> <strong className="text-slate-200">{route.distance_nm}</strong> NM</span>
                <span className="flex items-center gap-1.5"><Anchor className="h-3.5 w-3.5" /> <strong className="text-slate-200">{route.transshipments}</strong> stops</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}