"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, type TransactionInput, type PredictionResponse } from "@/lib/api";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/ui/primitives";
import { ParticleField } from "@/components/visuals/ParticleField";
import { ArrowRight, CreditCard, Shield, User, Smartphone, AlertCircle, CheckCircle2, Loader2, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function AnalyzePage() {
  const router = useRouter();
  const { dispatch } = useApp();

  const [loading, setLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [amount, setAmount] = useState<string>("150.00");
  const [productCd, setProductCd] = useState<string>("W");
  const [card1, setCard1] = useState<string>("13926");
  const [card4, setCard4] = useState<string>("visa");
  const [card6, setCard6] = useState<string>("credit");
  const [addr1, setAddr1] = useState<string>("315");
  const [pEmail, setPEmail] = useState<string>("gmail.com");
  const [rEmail, setREmail] = useState<string>("gmail.com");
  const [deviceType, setDeviceType] = useState<string>("desktop");

  // Optional additional features from selected preset
  const [additionalFeatures, setAdditionalFeatures] = useState<Record<string, any>>({});

  const buildPayload = (): TransactionInput => ({
    TransactionAmt: parseFloat(amount) || 150.0,
    ProductCD: productCd,
    card1: parseInt(card1) || 13926,
    card4: card4,
    card6: card6,
    addr1: parseFloat(addr1) || 315,
    P_emaildomain: pEmail,
    R_emaildomain: rEmail,
    DeviceType: deviceType,
    additional_features: additionalFeatures,
  });

  const handleAnalyzeDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysisStep("Engineering 492 feature dimensions…");

    try {
      const payload = buildPayload();
      
      // Step 2
      await new Promise((r) => setTimeout(r, 200));
      setAnalysisStep("Scoring with LightGBM Champion & Isotonic Calibrator…");
      const result: PredictionResponse = await api.predict(payload);

      // Step 3
      setAnalysisStep("Computing TreeSHAP local factor attributions…");
      dispatch({ type: "SET_PREDICTION", payload: result });
      
      await new Promise((r) => setTimeout(r, 250));
      router.push("/result");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze transaction.");
      setLoading(false);
      setAnalysisStep(null);
    }
  };

  const handleRazorpayTestPay = async () => {
    setLoading(true);
    setError(null);
    setAnalysisStep("Creating Razorpay Test Mode Order…");

    try {
      const amtPaise = Math.round((parseFloat(amount) || 150.0) * 100);
      const order = await api.createRazorpayOrder(amtPaise / 100);

      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => (script.onload = resolve));
      }

      const options = {
        key: order.key_id,
        amount: order.amount_paise,
        currency: order.currency,
        name: "PISTA Transaction Intelligence",
        description: "Live Gateway Test Payment Verification",
        order_id: order.order_id,
        handler: async function (response: any) {
          setAnalysisStep("Verifying Razorpay HMAC-SHA256 signature & scoring…");
          try {
            const verification = await api.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customer_metadata: {
                email: pEmail,
                device_type: deviceType,
                TransactionAmt: parseFloat(amount) || 150.0,
                card1: parseInt(card1) || 13926,
                card4: card4,
                card6: card6,
                addr1: parseFloat(addr1) || 315,
                ProductCD: productCd,
                P_emaildomain: pEmail,
                R_emaildomain: rEmail,
                additional_features: additionalFeatures,
              },
            });
            dispatch({ type: "SET_PREDICTION", payload: verification });
            router.push("/result");
          } catch (err: any) {
            setError(err.message || "Payment verification failed.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setAnalysisStep(null);
          },
        },
        prefill: {
          email: `buyer@${pEmail}`,
          contact: "+919876543210",
        },
        theme: {
          color: "#C7F36B",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Could not launch Razorpay test mode checkout.");
      setLoading(false);
      setAnalysisStep(null);
    }
  };

  const applyPreset = (presetKey: "standard" | "high_risk" | "review_vector") => {
    try {
      const presetsData = require("@/lib/presets.json");
      const preset = presetsData[presetKey];
      if (preset && preset.data) {
        const d = preset.data;
        setAmount(String(d.TransactionAmt));
        setProductCd(d.ProductCD || "W");
        setCard1(String(d.card1 || "13926"));
        setCard4(d.card4 || "visa");
        setCard6(d.card6 || "credit");
        setAddr1(String(d.addr1 || "315"));
        setPEmail(d.P_emaildomain || "gmail.com");
        setREmail(d.R_emaildomain || "gmail.com");
        setDeviceType(d.DeviceType || "desktop");
        setAdditionalFeatures(d.additional_features || {});
      }
    } catch (e) {
      console.error("Failed to load preset:", e);
    }
  };

  return (
    <div className="relative min-h-screen px-6 lg:px-16 py-10 max-w-5xl mx-auto overflow-hidden">
      <ParticleField mode="scan" className="opacity-45" />

      {/* Atmospheric dynamic gradient spotlights */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-gradient-to-bl from-[#3395ff]/15 via-[#C7F36B]/08 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div className="cursor-default group">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#3395ff]/15 text-[#3395ff] border border-[#3395ff]/30 font-bold uppercase tracking-wider group-hover:bg-[#3395ff]/25 group-hover:shadow-[0_0_12px_rgba(51,149,255,0.35)] transition-all">
                Telemetry Studio
              </span>
              <span className="text-xs font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors">• 492 Feature Store</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading group-hover:text-[#C7F36B] transition-colors">
              Transaction Risk Simulator
            </h1>
          </div>
          <p className="text-xs font-mono text-zinc-400 hover:text-zinc-200 max-w-xs leading-relaxed transition-colors cursor-default">
            Configure transaction vectors or load live attack patterns for sub-millisecond scoring.
          </p>
        </div>

        {/* Quick Presets Bar: Interactive Tactical Selector */}
        <div className="mb-6 p-3 rounded-2xl bg-[#0f131a]/90 border border-white/[0.09] backdrop-blur-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2 px-1 cursor-default group">
            <span className="text-[11px] font-mono text-zinc-400 group-hover:text-zinc-200 font-medium uppercase tracking-wider flex items-center gap-1.5 transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-[#C7F36B] group-hover:rotate-12 transition-transform" />
              <span>Simulate Attack Vectors & Safe Baselines</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500 group-hover:text-[#C7F36B] transition-colors">1-Click Injection</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => applyPreset("standard")}
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/[0.07] hover:border-emerald-500/30 hover:-translate-y-0.5 text-left transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white group-hover:text-emerald-300 font-heading transition-colors">Standard Retail</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)] group-hover:scale-125 transition-transform" />
              </div>
              <p className="text-[11px] font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">$107.95 • Verified Visa Credit</p>
            </button>

            <button
              type="button"
              onClick={() => applyPreset("high_risk")}
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-rose-500/10 border border-white/[0.07] hover:border-rose-500/30 hover:-translate-y-0.5 text-left transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white group-hover:text-rose-300 font-heading transition-colors">High Risk Velocity Attack</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)] group-hover:scale-125 transition-transform" />
              </div>
              <p className="text-[11px] font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">$422.50 • Disposable Email & Proxy</p>
            </button>

            <button
              type="button"
              onClick={() => applyPreset("review_vector")}
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-amber-500/10 border border-white/[0.07] hover:border-amber-500/30 hover:-translate-y-0.5 text-left transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white group-hover:text-amber-300 font-heading transition-colors">Suspicious Triage Vector</span>
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)] group-hover:scale-125 transition-transform" />
              </div>
              <p className="text-[11px] font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">$136.95 • Cross-border Mismatch</p>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="card-surface p-12 text-center backdrop-blur-2xl bg-[#0f131a]/95 border-white/[0.12] shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-[#C7F36B]/10 border border-[#C7F36B]/40 flex items-center justify-center mx-auto mb-4 animate-pulse shadow-[0_0_30px_rgba(199,243,107,0.35)]">
              <Loader2 className="w-7 h-7 text-[#C7F36B] animate-spin" />
            </div>
            <h3 className="text-base font-bold text-white font-display mb-1.5">Evaluating Transaction</h3>
            <p className="text-xs font-mono text-[#C7F36B] tracking-wide">{analysisStep || "Running inference pipeline…"}</p>
            
            {/* Progress bar visual indicator */}
            <div className="w-56 h-1.5 bg-white/[0.06] rounded-full mx-auto mt-5 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-[#3395ff] via-[#6366f1] to-[#C7F36B] animate-[pulse_1s_ease-in-out_infinite]" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleAnalyzeDirect} className="space-y-6">
            {/* Section 1: Transaction Basics */}
            <div className="card-surface p-6 backdrop-blur-2xl bg-[#0f131a]/85 border-white/[0.09] hover:border-[#3395ff]/40 shadow-xl">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-4 font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#3395ff]" />
                <span>01. Transaction Financial Parameters</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Amount (USD / INR eq)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white font-mono outline-none focus:border-[#C7F36B] focus:ring-1 focus:ring-[#C7F36B]"
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Product Code (ProductCD)</label>
                  <div className="relative">
                    <select
                      value={productCd}
                      onChange={(e) => setProductCd(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white font-mono outline-none focus:border-[#C7F36B] focus:ring-1 focus:ring-[#C7F36B] pr-10 cursor-pointer"
                    >
                      <option value="W" className="bg-[#0f131a]">W — Web Standard</option>
                      <option value="H" className="bg-[#0f131a]">H — High Risk</option>
                      <option value="C" className="bg-[#0f131a]">C — Commercial</option>
                      <option value="S" className="bg-[#0f131a]">S — Subscription</option>
                      <option value="R" className="bg-[#0f131a]">R — Retail Point</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Billing Region (addr1)</label>
                  <input
                    type="text"
                    value={addr1}
                    onChange={(e) => setAddr1(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white font-mono outline-none focus:border-[#C7F36B] focus:ring-1 focus:ring-[#C7F36B]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Card & Instrument Signals */}
            <div className="card-surface p-6 backdrop-blur-2xl bg-[#0f131a]/85 border-white/[0.09] hover:border-[#3395ff]/40 shadow-xl">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-4 font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#3395ff]" />
                <span>02. Card Instrument Attributes</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Card Issuer BIN (card1)</label>
                  <input
                    type="text"
                    value={card1}
                    onChange={(e) => setCard1(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white font-mono outline-none focus:border-[#C7F36B] focus:ring-1 focus:ring-[#C7F36B]"
                  />
                </div>

                <div className="relative">
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Card Network (card4)</label>
                  <div className="relative">
                    <select
                      value={card4}
                      onChange={(e) => setCard4(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white font-mono outline-none focus:border-[#C7F36B] focus:ring-1 focus:ring-[#C7F36B] pr-10 cursor-pointer"
                    >
                      <option value="visa" className="bg-[#0f131a]">Visa</option>
                      <option value="mastercard" className="bg-[#0f131a]">Mastercard</option>
                      <option value="discover" className="bg-[#0f131a]">Discover</option>
                      <option value="american express" className="bg-[#0f131a]">American Express</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Card Funding Type (card6)</label>
                  <div className="relative">
                    <select
                      value={card6}
                      onChange={(e) => setCard6(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white font-mono outline-none focus:border-[#C7F36B] focus:ring-1 focus:ring-[#C7F36B] pr-10 cursor-pointer"
                    >
                      <option value="credit" className="bg-[#0f131a]">Credit Line</option>
                      <option value="debit" className="bg-[#0f131a]">Debit Account</option>
                      <option value="charge card" className="bg-[#0f131a]">Charge Card</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Identity & Device Telemetry */}
            <div className="card-surface p-6 backdrop-blur-2xl bg-[#0f131a]/85 border-white/[0.09] hover:border-[#3395ff]/40 shadow-xl">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-4 font-semibold flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#3395ff]" />
                <span>03. Identity & Device Telemetry</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Purchaser Email Domain</label>
                  <input
                    type="text"
                    value={pEmail}
                    onChange={(e) => setPEmail(e.target.value)}
                    placeholder="e.g. gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white font-mono outline-none focus:border-[#C7F36B] focus:ring-1 focus:ring-[#C7F36B]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Recipient Email Domain</label>
                  <input
                    type="text"
                    value={rEmail}
                    onChange={(e) => setREmail(e.target.value)}
                    placeholder="e.g. gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white font-mono outline-none focus:border-[#C7F36B] focus:ring-1 focus:ring-[#C7F36B]"
                  />
                </div>

                <div className="relative">
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Device Architecture</label>
                  <div className="relative">
                    <select
                      value={deviceType}
                      onChange={(e) => setDeviceType(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white font-mono outline-none focus:border-[#C7F36B] focus:ring-1 focus:ring-[#C7F36B] pr-10 cursor-pointer"
                    >
                      <option value="desktop" className="bg-[#0f131a]">Desktop Workstation</option>
                      <option value="mobile" className="bg-[#0f131a]">Mobile Handset</option>
                      <option value="tablet" className="bg-[#0f131a]">Tablet Client</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-[#C7F36B] hover:bg-[#b5e354] text-[#07080a] font-bold text-sm transition-all transform hover:-translate-y-0.5 shadow-[0_0_24px_rgba(199,243,107,0.35)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Analyze Transaction</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleRazorpayTestPay}
                disabled={loading}
                className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#0c2340] via-[#0e2c52] to-[#12396b] hover:from-[#102d52] hover:to-[#164580] border border-[#3395ff]/60 hover:border-[#3395ff] text-white font-semibold text-sm transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 shadow-[0_0_24px_rgba(51,149,255,0.35)] hover:shadow-[0_0_36px_rgba(51,149,255,0.55)] cursor-pointer group relative overflow-hidden"
              >
                <div className="w-6 h-6 rounded-lg bg-[#3395ff]/20 border border-[#3395ff]/50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-3.5 h-3.5 text-[#3395ff] drop-shadow-[0_0_6px_#3395ff]" />
                </div>
                <span className="font-sans tracking-tight text-white font-bold group-hover:text-white">Pay & Analyze via Razorpay</span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#3395ff] text-[#07080a] px-2.5 py-1 rounded-md shadow-[0_0_12px_rgba(51,149,255,0.8)]">
                  TEST MODE
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
