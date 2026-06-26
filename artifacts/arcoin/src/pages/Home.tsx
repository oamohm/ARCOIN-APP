import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { WelcomePopup } from "@/components/WelcomePopup";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <WelcomePopup />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center relative z-10"
      >
        <motion.div
          className="w-24 h-24 mx-auto bg-primary rounded-2xl mb-8 flex items-center justify-center"
          style={{ boxShadow: "0 0 60px rgba(59,130,246,0.5)" }}
          animate={{ boxShadow: ["0 0 40px rgba(59,130,246,0.4)", "0 0 80px rgba(59,130,246,0.7)", "0 0 40px rgba(59,130,246,0.4)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-4xl font-black text-white tracking-tighter">A</span>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-black tracking-tighter mb-4 bg-gradient-to-r from-white via-blue-200 to-cyan-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          ARCOIN
        </motion.h1>

        <motion.p
          className="text-xl text-muted-foreground mb-4 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          वैश्विक वित्तीय ऑपरेटिंग सिस्टम — Arc Network पर, Circle USDC द्वारा संचालित।
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-2 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-mono text-muted-foreground">Arc Network · Chain ID 5042002 · USDC-Native</span>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Link href="/login">
            <Button size="lg" className="text-lg h-14 px-10 font-bold shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              🦊 Connect Wallet
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-lg h-14 px-10 font-bold border-primary/30 hover:bg-primary/10">
              ✉️ Email Login
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {[
            { emoji: "⚡", label: "Instant Payments" },
            { emoji: "🌊", label: "USDC Streaming" },
            { emoji: "🤖", label: "AI Finance Agent" },
            { emoji: "🛡️", label: "Triple Shield" },
            { emoji: "📄", label: "Arc-Flow Invoices" },
            { emoji: "🗳️", label: "DAO Governance" },
            { emoji: "🔐", label: "Savings Vault" },
            { emoji: "🌍", label: "Cross-Border FX" },
          ].map((f) => (
            <div key={f.label} className="bg-card/50 border border-border rounded-xl p-3 text-center backdrop-blur-sm">
              <div className="text-xl mb-1">{f.emoji}</div>
              <div className="text-xs text-muted-foreground font-medium">{f.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
