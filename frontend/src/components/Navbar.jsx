import React from 'react';
import { Leaf, ScanLine, Award, Building2, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, credits }) {
  const navItems = [
    { id: 'scanner', label: 'AI Scanner', icon: ScanLine },
    { id: 'impact', label: 'My Impact & Missions', icon: Award },
    { id: 'gov', label: 'Gov & City Intelligence', icon: Building2 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-emerald-950 text-white shadow-lg border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div
          onClick={() => setActiveTab('scanner')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="bg-emerald-500 p-2 rounded-xl text-emerald-950 shadow-md">
            <Leaf className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight">EcoLens <span className="text-emerald-400">AI</span></span>
            <p className="text-[10px] text-emerald-300/80 uppercase tracking-widest hidden sm:block">
              Scan • Understand • Act • Earn
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                  active
                    ? 'bg-emerald-500 text-emerald-950 font-semibold shadow'
                    : 'text-emerald-100 hover:bg-emerald-900/70'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 bg-emerald-900/90 border border-emerald-700 px-3 py-1.5 rounded-full">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs sm:text-sm font-bold text-amber-300">{credits}</span>
          <span className="text-[11px] text-emerald-200 hidden md:inline">Green Credits</span>
        </div>
      </div>
    </header>
  );
}
