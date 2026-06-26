import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function WelcomePopup() {
  const [show, setShow] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const seen = localStorage.getItem("arcoin_welcomed");
    if (!seen) {
      const t = setTimeout(() => setShow(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const handleClose = (goTo?: string) => {
    localStorage.setItem("arcoin_welcomed", "1");
    setShow(false);
    if (goTo) setTimeout(() => setLocation(goTo), 300);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => handleClose()}
          />
          <motion.div
            className="relative z-10 w-full max-w-lg mx-4 bg-card border border-border rounded-2xl p-8 shadow-2xl shadow-primary/20"
            initial={{ scale: 0.85, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 260 }}
          >
            <div className="text-center space-y-6">
              <motion.div
                className="w-20 h-20 mx-auto bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.4)]"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <span className="text-3xl font-black text-white">A</span>
              </motion.div>

              <div>
                <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  ARCOIN में आपका स्वागत है
                </h1>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  वैश्विक वित्तीय ऑपरेटिंग सिस्टम — Arc Network पर निर्मित,<br />
                  Circle USDC द्वारा संचालित।
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { emoji: "⚡", label: "Instant USDC", sub: "Global Payments" },
                  { emoji: "🛡️", label: "Bank-Grade", sub: "Security" },
                  { emoji: "🤖", label: "AI-Powered", sub: "Finance Agent" },
                ].map((f) => (
                  <div key={f.label} className="bg-secondary/50 rounded-xl p-3 border border-border">
                    <div className="text-2xl mb-1">{f.emoji}</div>
                    <div className="text-xs font-bold text-foreground">{f.label}</div>
                    <div className="text-[10px] text-muted-foreground">{f.sub}</div>
                  </div>
                ))}
              </div>

              <div className="bg-secondary/30 rounded-xl p-4 border border-primary/20 text-left space-y-2">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">Arc Network Info</p>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Chain ID</span>
                  <span className="font-mono text-foreground">5042002</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">RPC</span>
                  <a href="https://rpc.testnet.arc.network" target="_blank" rel="noreferrer" className="font-mono text-primary hover:underline truncate max-w-[180px]">rpc.testnet.arc.network</a>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Explorer</span>
                  <a href="https://scan.testnet.arc.network" target="_blank" rel="noreferrer" className="font-mono text-primary hover:underline">scan.testnet.arc.network</a>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Native Token</span>
                  <span className="font-mono text-green-400">USDC (Circle)</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleClose()}
                >
                  Explore First
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 font-bold"
                  onClick={() => handleClose("/login")}
                >
                  Connect Wallet →
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                By connecting, you agree to ARCOIN's Terms of Service & Privacy Policy.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
