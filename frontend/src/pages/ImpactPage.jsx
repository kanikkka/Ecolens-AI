import React, { useEffect, useState } from 'react';
import { Award, Leaf, Recycle, Zap, CheckCircle, Users, Flag } from 'lucide-react';
import { fetchDashboard, fetchMissions } from '../api';

export default function ImpactPage({ userState, setUserState }) {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    fetchDashboard().then(setUserState).catch(() => {});
    fetchMissions().then((d) => setMissions(d.missions || [])).catch(() => {});
  }, [setUserState]);

  if (!userState) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border-b-4 border-b-amber-400">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>VERIFIED GREEN CREDITS</span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{userState.green_credits}</div>
          <p className="text-xs text-emerald-700 mt-1 font-medium">100% Evidence-Backed</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border-b-4 border-b-emerald-500">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>EST. CO₂ EMISSIONS SAVED</span>
            <Leaf className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{userState.co2_saved_kg} kg</div>
          <p className="text-xs text-slate-500 mt-1">Methodology: Material × Pathway Factor</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border-b-4 border-b-sky-500">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>ITEMS PROPERLY ROUTED</span>
            <Recycle className="w-5 h-5 text-sky-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{userState.items_routed}</div>
          <p className="text-xs text-slate-500 mt-1">{userState.plastic_diverted_kg} kg plastic diverted</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border-b-4 border-b-purple-500">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>FAMILY GREEN SCORE</span>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{userState.family_name}</div>
          <p className="text-xs text-purple-700 mt-1 font-medium">🔥 {userState.streak_days}-Day Eco Streak</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
          <Flag className="w-5 h-5 text-emerald-600" />
          Official Government & Campus Missions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {missions.map((m) => (
            <div key={m.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {m.authority}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-2">{m.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{m.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">Community Progress</span>
                  <span className="text-emerald-700">{m.progress_percent}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full"
                    style={{ width: `${m.progress_percent}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-3 text-xs">
                  <span className="font-bold text-amber-600">+{m.credits_reward} Credits</span>
                  <span className="text-slate-500">Ends: {m.deadline}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-amber-500" />
          Verified Disposal Passport Ledger
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase">
                <th className="py-2.5 px-3">Passport ID</th>
                <th className="py-2.5 px-3">Item</th>
                <th className="py-2.5 px-3">Pathway</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Credits</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {userState.history.map((h, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-semibold text-slate-700">{h.passport_id}</td>
                  <td className="py-3 px-3 font-medium text-slate-900">{h.product_name}</td>
                  <td className="py-3 px-3">
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      {h.pathway}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> {h.status}
                  </td>
                  <td className="py-3 px-3 font-bold text-amber-600">+{h.credits_earned}</td>
                  <td className="py-3 px-3 text-slate-500">{h.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
