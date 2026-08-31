import Link from "next/link";
import { PistaLogo } from "@/components/ui/PistaLogo";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[#07080a] text-white">
      <PistaLogo size={64} glow interactive className="mb-6" />
      <span className="text-xs font-mono uppercase tracking-[0.24em] text-[#C7F36B] font-bold mb-2">
        Error 404 • Signal Not Found
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white mb-3">
        Route Does Not Exist
      </h1>
      <p className="text-sm text-zinc-400 max-w-md font-sans mb-8 leading-relaxed">
        The requested telemetry endpoint or path cannot be resolved within the PISTA active security perimeter.
      </p>
      <Link
        href="/"
        className="btn-action-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-[#07080a]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Overview</span>
      </Link>
    </div>
  );
}
