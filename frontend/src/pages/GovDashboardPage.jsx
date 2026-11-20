import React, { useEffect, useState } from 'react';
import { BarChart3, AlertOctagon, Trophy, Shield } from 'lucide-react';
import { fetchGovAnalytics } from '../api';

export default function GovDashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchGovAnalytics().then(setData).catch(() => {});
  }, []);

  if (!data) {
    return <div className="p-8 text-center text-sm text-slate-500">Loading Municipal Intelligence...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> Privacy-Preserving Municipal & CPCB Intelligence
          </span>
          <h1 className="text-2xl font-bold mt-1">{data.city} — Waste Routing & Infrastructure Insights</h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated, anonymized citizen action telemetry to identify recycler infrastructure gaps.
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl text-right">
          <div className="text-xs text-slate-400">Verification Rate</div>
          <div className="text-2xl font-extrabold text-emerald-400">{data.verification_rate_percent}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs font-semibold text-slate-500">TOTAL SCANS (30 DAYS)</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">{data.total_scans_30d.toLocaleString()}</div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs font-semibold text-slate-500">VERIFIED WASTE DIVERTED</div>
          <div className="text-3xl font-extrabold text-emerald-700 mt-1">{data.estimated_waste_diverted_tons} Tons</div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="text-xs font-semibold text-slate-500">E-WASTE UNITS SAFELY ROUTED</div>
          <div className="text-3xl font-extrabold text-amber-600 mt-1">{data.ewaste_safely_routed_units.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 glass-card rounded-2xl p-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            Material Category & Correct Routing Efficiency
          </h2>
          <div className="space-y-4">
            {data.category_breakdown.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-800">{item.category} ({item.scans.toLocaleString()} scans)</span>
                  <span className="text-emerald-700">{item.routed_correctly_pct}% Routed</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      item.routed_correctly_pct < 50 ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${item.routed_correctly_pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
              <AlertOctagon className="w-5 h-5 text-rose-600" />
              Unmet Collection Infrastructure Alerts
            </h2>
            <div className="space-y-3">
              {data.infrastructure_gaps.map((gap, i) => (
                <div key={i} className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs">
                  <div className="flex justify-between font-bold text-rose-900">
                    <span>{gap.ward}</span>
                    <span className="bg-rose-600 text-white px-2 py-0.5 rounded text-[10px]">{gap.priority}</span>
                  </div>
                  <p className="text-rose-800 mt-1">{gap.issue}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-amber-500" />
              City Community Leaderboard
            </h2>
            <div className="space-y-2.5">
              {data.community_leaderboard.map((row) => (
                <div key={row.rank} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="font-extrabold text-emerald-700 mr-2">#{row.rank}</span>
                    <span className="font-bold text-slate-900">{row.name}</span>
                    <span className="ml-2 text-[11px] text-slate-500">({row.type})</span>
                  </div>
                  <span className="font-bold text-amber-600">{row.credits.toLocaleString()} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
