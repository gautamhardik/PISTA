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
                device: deviceType,
                card_network: card4,
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

  const applyPreset = (preset: "standard" | "high_risk" | "micropay") => {
    if (preset === "standard") {
      setAmount("150.00");
      setProductCd("W");
      setCard1("13926");
      setCard4("visa");
      setCard6("credit");
      setAddr1("315");
      setPEmail("gmail.com");
      setREmail("gmail.com");
      setDeviceType("desktop");
    } else if (preset === "high_risk") {
      setAmount("4850.00");
      setProductCd("H");
      setCard1("9999");
      setCard4("discover");
      setCard6("credit");
      setAddr1("123");
      setPEmail("protonmail.com");
      setREmail("anonymous.org");
      setDeviceType("mobile");
    } else if (preset === "micropay") {
      setAmount("12.50");
      setProductCd("C");
      setCard1("4462");
      setCard4("mastercard");
      setCard6("debit");
      setAddr1("299");
      setPEmail("yahoo.com");
      setREmail("yahoo.com");
      setDeviceType("desktop");
    }
  };

  return (
    <div className="relative min-h-screen px-8 lg:px-20 py-12 max-w-4xl mx-auto overflow-hidden">
      <ParticleField mode="scan" className="opacity-40" />

      {/* Multi-Layer Ambient Background Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-gradient-to-bl from-[#3395ff]/15 via-[#C7F36B]/08 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10">
        <PageHeader
          title="Transaction Risk Evaluation"
          description="Submit real-time payment telemetry across 492 engineered features for instant calibrated scoring and TreeSHAP attribution"
        />

        {/* Quick Presets Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-6 p-2 rounded-xl bg-[#0f131a]/85 border border-white/[0.08] backdrop-blur-xl">
          <span className="text-xs font-mono text-zinc-400 px-2">Telemetry Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset("standard")}
            className="px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-zinc-200 transition-colors cursor-pointer"
          >
            01. Standard Retail ($150)
          </button>
          <button
            type="button"
            onClick={() => applyPreset("high_risk")}
            className="px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-mono text-rose-300 transition-colors cursor-pointer"
          >
            02. High Risk Vector ($4,850)
          </button>
          <button
            type="button"
            onClick={() => applyPreset("micropay")}
            className="px-3 py-1 rounded-lg bg-[#C7F36B]/10 hover:bg-[#C7F36B]/20 border border-[#C7F36B]/30 text-xs font-mono text-[#C7F36B] transition-colors cursor-pointer"
          >
            03. Micropayment ($12.50)
          </button>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="card-surface p-12 text-center backdrop-blur-2xl bg-[#0f131a]/95 border-white/[0.12] shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#C7F36B]/10 border border-[#C7F36B]/40 flex items-center justify-center mx-auto mb-4 animate-pulse shadow-[0_0_24px_rgba(199,243,107,0.3)]">
              <Loader2 className="w-6 h-6 text-[#C7F36B] animate-spin" />
            </div>
            <h3 className="text-sm font-bold text-white font-sans mb-1">Evaluating Transaction</h3>
            <p className="text-xs font-mono text-[#C7F36B]">{analysisStep || "Running inference pipeline…"}</p>
            
            {/* Progress bar visual indicator */}
            <div className="w-48 h-1 bg-white/[0.06] rounded-full mx-auto mt-4 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-[#3395ff] to-[#C7F36B] animate-[pulse_1s_ease-in-out_infinite]" />
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
