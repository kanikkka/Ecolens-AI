import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ScannerPage from './pages/ScannerPage';
import ImpactPage from './pages/ImpactPage';
import GovDashboardPage from './pages/GovDashboardPage';
import { fetchDashboard } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [userState, setUserState] = useState({
    user_name: 'Kanika Rajput',
    family_name: 'Rajput Household',
    green_credits: 240,
    items_routed: 14,
    co2_saved_kg: 4.85,
    plastic_diverted_kg: 1.62,
    ewaste_routed_count: 2,
    streak_days: 6,
    badges: ['Early Eco-Adopter', 'PET Recycler'],
    history: []
  });

  useEffect(() => {
    fetchDashboard().then(setUserState).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        credits={userState.green_credits}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'scanner' && (
          <ScannerPage onCreditsUpdated={(updated) => setUserState(updated)} />
        )}
        {activeTab === 'impact' && (
          <ImpactPage userState={userState} setUserState={setUserState} />
        )}
        {activeTab === 'gov' && <GovDashboardPage />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        EcoLens AI • Scan • Understand • Act • Earn • Impact — Built with FastAPI & React
      </footer>
    </div>
  );
}
