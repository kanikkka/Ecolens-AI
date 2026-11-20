import React, { useState } from 'react';
import {
  Camera, Upload, AlertTriangle, CheckCircle2, MapPin, QrCode,
  ShieldCheck, Recycle, Info, Sparkles, ArrowRight, FileCheck2
} from 'lucide-react';
import { scanProduct, verifyAction } from '../api';

const SAMPLES = [
  { key: 'pet_bottle', label: '1L Mineral Water Bottle', tag: 'PET #1 + HDPE Cap' },
  { key: 'li_ion_battery', label: 'Li-Ion Power Bank (10000mAh)', tag: 'E-Waste Hazard' },
  { key: 'chips_mlp', label: 'Masala Chips Packet (52g)', tag: 'MLP #7 + Allergens' },
  { key: 'expired_biscuits', label: 'Expired Digestive Biscuits', tag: 'Bi-Material + Expiry' },
];

export default function ScannerPage({ onCreditsUpdated }) {
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [selectedDest, setSelectedDest] = useState(null);
  const [qrInput, setQrInput] = useState('');
  const [verifyMsg, setVerifyMsg] = useState(null);
  const [verifyErr, setVerifyErr] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const handleSampleScan = async (sampleKey) => {
    setLoading(true);
    setVerifyMsg(null);
    setVerifyErr(null);
    try {
      const data = await scanProduct({ sampleKey });
      setScanResult(data);
      if (data.destinations?.length > 0) {
        setSelectedDest(data.destinations[0]);
        setQrInput(data.destinations[0].qr_code_id);
      }
    } catch (e) {
      alert("Backend connection error. Ensure FastAPI is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setVerifyMsg(null);
    setVerifyErr(null);
    try {
      const data = await scanProduct({ file });
      setScanResult(data);
      if (data.destinations?.length > 0) {
        setSelectedDest(data.destinations[0]);
        setQrInput(data.destinations[0].qr_code_id);
      }
    } catch (err) {
      alert("Upload scan failed. Check backend server.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!scanResult || !selectedDest) return;
    setVerifying(true);
    setVerifyMsg(null);
    setVerifyErr(null);
    try {
      const res = await verifyAction({
        passportId: scanResult.passport_id,
        destinationId: selectedDest.id,
        qrToken: qrInput,
      });
      setVerifyMsg(res.message);
      setScanResult(res.passport);
      if (onCreditsUpdated) onCreditsUpdated(res.user_state);
    } catch (err) {
      setVerifyErr(err.message);
    } finally {
      setVerifying(false);
    }
  };

  const severityStyle = (sev) => {
    if (sev === 'high') return 'bg-red-50 border-red-200 text-red-900';
    if (sev === 'medium') return 'bg-amber-50 border-amber-200 text-amber-900';
    return 'bg-sky-50 border-sky-200 text-sky-900';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-medium px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Closed-Loop Environmental Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Scan Any Product or Waste. Uncover What You Overlooked.
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base mt-2">
            AI extracts hidden expiry, allergens, resin codes (#1–#7) & hazardous warnings, builds a 10-second Waste Recipe, routes you to verified recyclers, and rewards real action.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <label className="lg:col-span-4 flex flex-col items-center justify-center border-2 border-dashed border-emerald-400/60 hover:border-emerald-300 bg-emerald-950/40 rounded-xl p-5 cursor-pointer transition">
            <Upload className="w-7 h-7 text-emerald-300 mb-1.5" />
            <span className="text-sm font-semibold">Upload Product / Waste Image</span>
            <span className="text-xs text-emerald-300/80 mt-0.5">JPG, PNG, WEBP (OCR + Vision)</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>

          <div className="lg:col-span-8">
            <p className="text-xs uppercase tracking-wider text-emerald-300 font-semibold mb-2.5 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" /> Or Test Live Competition Scenarios:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SAMPLES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => handleSampleScan(s.key)}
                  disabled={loading}
                  className="flex items-center justify-between bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl px-3.5 py-2.5 text-left transition"
                >
                  <div>
                    <div className="text-sm font-semibold text-white">{s.label}</div>
                    <div className="text-[11px] text-emerald-300">{s.tag}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-300 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="glass-card rounded-2xl p-10 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="font-semibold text-slate-800">Running CV Object Detection, OCR & Compliance Rule Engine...</p>
          <p className="text-xs text-slate-500 mt-1">Checking resin identification codes, allergens & local recycler eligibility</p>
        </div>
      )}

      {!loading && scanResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card rounded-2xl p-5 border-l-4 border-l-emerald-500">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-semibold">
                    PASSPORT: {scanResult.passport_id}
                  </span>
                  <span className="ml-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    AI Confidence: {Math.round(scanResult.confidence * 100)}%
                  </span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  scanResult.status.startsWith('VERIFIED')
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {scanResult.status}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mt-3">{scanResult.product_name}</h2>
              <p className="text-sm text-slate-500">{scanResult.brand} • {scanResult.category}</p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
                {Object.entries(scanResult.extracted_fields).map(([k, v]) => (
                  <div key={k} className="text-xs">
                    <span className="text-slate-500 font-medium">{k}: </span>
                    <span className="text-slate-900 font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                What You Overlooked? (Top Priority Findings)
              </h3>
              <div className="space-y-3">
                {scanResult.overlooked.map((item, idx) => (
                  <div key={idx} className={`p-3.5 rounded-xl border ${severityStyle(item.severity)}`}>
                    <div className="font-bold text-sm">{item.title}</div>
                    <p className="text-xs mt-1 leading-relaxed opacity-90">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-sky-600" />
                Material & Packaging Intelligence
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-500">Primary Material</div>
                  <div className="font-bold text-slate-900 mt-0.5">{scanResult.material_info.primary_material}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-500">Resin / Code</div>
                  <div className="font-bold text-emerald-700 mt-0.5">{scanResult.material_info.resin_code}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-500">Secondary Component</div>
                  <div className="font-bold text-slate-900 mt-0.5">{scanResult.material_info.cap_material}</div>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-600 bg-sky-50/70 border border-sky-100 p-3 rounded-xl">
                <strong>Local Reality Check:</strong> {scanResult.material_info.recyclability_note}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-2xl p-5 border-t-4 border-t-emerald-600">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Recycle className="w-5 h-5 text-emerald-600" />
                  10-Second Waste Recipe
                </h3>
                <span className="bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full tracking-wide">
                  {scanResult.waste_recipe.pathway}
                </span>
              </div>

              <p className="text-sm text-slate-700 font-medium mt-3">
                {scanResult.waste_recipe.summary}
              </p>

              <div className="mt-4 space-y-2">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">✅ What To Do:</div>
                {scanResult.waste_recipe.do_steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                <div className="text-xs font-bold text-red-700 uppercase tracking-wider">❌ What Not To Do:</div>
                {scanResult.waste_recipe.dont_steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              {scanResult.waste_recipe.safety_note && (
                <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3 rounded-xl">
                  <strong>Safety Guardrail:</strong> {scanResult.waste_recipe.safety_note}
                </div>
              )}
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-rose-500" />
                Verified Local Destinations & QR Proof
              </h3>

              <div className="space-y-2.5">
                {scanResult.destinations.map((dest) => {
                  const isSel = selectedDest?.id === dest.id;
                  return (
                    <div
                      key={dest.id}
                      onClick={() => {
                        setSelectedDest(dest);
                        setQrInput(dest.qr_code_id);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        isSel
                          ? 'border-emerald-500 bg-emerald-50/70'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{dest.name}</span>
                        <span className="text-xs font-semibold text-emerald-700">{dest.distance_km} km</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{dest.address}</p>
                      <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-emerald-800">
                        <ShieldCheck className="w-3.5 h-3.5" /> {dest.verified_badge}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-600" /> Partner QR Verification Token
                  </span>
                  <span className="text-amber-600 font-bold">+{scanResult.potential_credits} Credits</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    placeholder="Enter Destination QR Token"
                    className="flex-1 text-xs font-mono border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleVerify}
                    disabled={verifying || scanResult.status.startsWith('VERIFIED')}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    {scanResult.status.startsWith('VERIFIED') ? 'Verified' : 'Verify & Earn'}
                  </button>
                </div>

                {verifyMsg && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold">
                    🎉 {verifyMsg}
                  </div>
                )}
                {verifyErr && (
                  <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                    {verifyErr}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
