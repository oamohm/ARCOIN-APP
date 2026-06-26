import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Scale, Building, Shield, CheckCircle2, Lock, Globe, FileText } from "lucide-react";
import { useState } from "react";

const SHIELDS = [
  {
    id: "privacy",
    icon: Eye,
    title: "Privacy Shield",
    color: "from-purple-500 to-violet-600",
    glow: "shadow-purple-500/20",
    badge: "Opt-In",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    desc: "Protect your transaction details with zero-knowledge proofs. You control who sees what.",
    features: [
      { icon: EyeOff, label: "Private Transactions", desc: "Hide amount & recipient from public blockchain" },
      { icon: Lock, label: "View Keys", desc: "Share selective read access with auditors or tax agencies" },
      { icon: FileText, label: "Stealth Addresses", desc: "One-time addresses for receiving without linking identity" },
      { icon: Shield, label: "ZK-Proof Compliance", desc: "Prove compliance without revealing transaction data" },
    ],
    status: "active",
    compliance: ["GDPR", "FATF R16", "MiCAR Art. 83"],
  },
  {
    id: "trust",
    icon: Scale,
    title: "Trust Shield",
    color: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/20",
    badge: "Onchain",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    desc: "Resolve disputes transparently on-chain with decentralized arbitration. No lawyers, no delays.",
    features: [
      { icon: Scale, label: "Dispute Resolution", desc: "On-chain arbitration via Kleros / OpenZeppelin Defender" },
      { icon: CheckCircle2, label: "Smart Escrow", desc: "Funds locked until both parties confirm delivery" },
      { icon: Globe, label: "ArcScan Verified Memo", desc: "Every transaction gets a tamper-proof memo on ArcScan" },
      { icon: FileText, label: "Audit Trail", desc: "Immutable record of all agreements and resolutions" },
    ],
    status: "active",
    compliance: ["UCC Art. 4A", "UNCITRAL", "FATF R7"],
  },
  {
    id: "institutional",
    icon: Building,
    title: "Institutional Shield",
    color: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/20",
    badge: "Enterprise",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    desc: "Bank-grade treasury controls, multi-jurisdiction compliance, and institutional custody for large enterprises.",
    features: [
      { icon: Building, label: "Bank-Grade Treasury", desc: "Multi-sig vaults with HSM hardware security modules" },
      { icon: Shield, label: "Insurance Coverage", desc: "Up to $250M in on-chain asset insurance via Nexus Mutual" },
      { icon: Globe, label: "Multi-Jurisdiction", desc: "Automated compliance across 180+ countries" },
      { icon: Lock, label: "MPC Custody", desc: "Threshold signature schemes — no single point of failure" },
    ],
    status: "active",
    compliance: ["SOC 2 Type II", "ISO 27001", "Basel III", "DORA"],
  },
];

export default function Shields() {
  const [activeShield, setActiveShield] = useState<string | null>(null);
  const [privacyEnabled, setPrivacyEnabled] = useState(false);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" /> ARCOIN Shields
        </h1>
        <p className="text-muted-foreground mt-1">Three layers of protection: Privacy, Trust, and Institutional security.</p>
      </div>

      <div className="grid gap-6">
        {SHIELDS.map((shield, i) => {
          const Icon = shield.icon;
          const isOpen = activeShield === shield.id;
          return (
            <motion.div
              key={shield.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`border-border transition-all duration-300 ${isOpen ? `shadow-xl ${shield.glow}` : ""}`}>
                <CardHeader
                  className="cursor-pointer select-none"
                  onClick={() => setActiveShield(isOpen ? null : shield.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${shield.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{shield.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">{shield.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`text-xs font-mono border ${shield.badgeColor}`}>{shield.badge}</Badge>
                      <div className="flex items-center gap-1.5 text-xs text-green-400">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Active
                      </div>
                      <span className="text-muted-foreground text-lg">{isOpen ? "−" : "+"}</span>
                    </div>
                  </div>
                </CardHeader>

                {isOpen && (
                  <CardContent className="border-t border-border pt-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      {shield.features.map((f) => {
                        const FIcon = f.icon;
                        return (
                          <div key={f.label} className="flex items-start gap-3 p-4 bg-secondary/30 rounded-xl border border-border">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${shield.color} flex items-center justify-center shrink-0`}>
                              <FIcon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{f.label}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl border border-border">
                      <div>
                        <p className="text-sm font-semibold">Compliance Standards</p>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {shield.compliance.map(c => (
                            <Badge key={c} variant="outline" className="text-xs font-mono">{c}</Badge>
                          ))}
                        </div>
                      </div>
                      {shield.id === "privacy" && (
                        <Button
                          size="sm"
                          variant={privacyEnabled ? "default" : "outline"}
                          onClick={() => setPrivacyEnabled(!privacyEnabled)}
                          className="gap-2"
                        >
                          {privacyEnabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          {privacyEnabled ? "Disable Privacy" : "Enable Privacy"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground">All 3 Shields Active — You're Protected</p>
              <p className="text-sm text-muted-foreground">ARCOIN runs OpenZeppelin formal verification + independent audits on all shield contracts.</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Security Score</p>
              <p className="text-2xl font-black text-green-400">98/100</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
