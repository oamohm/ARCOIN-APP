import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Shield, Clock, BarChart3, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const YIELD_DATA = [
  { month: "Jan", yield: 5.2, invested: 120000 },
  { month: "Feb", yield: 6.1, invested: 145000 },
  { month: "Mar", yield: 5.8, invested: 160000 },
  { month: "Apr", yield: 7.2, invested: 200000 },
  { month: "May", yield: 6.9, invested: 220000 },
  { month: "Jun", yield: 8.1, invested: 280000 },
];

const PORTFOLIO = [
  { sector: "Logistics", pct: 32, color: "#3b82f6" },
  { sector: "Manufacturing", pct: 28, color: "#8b5cf6" },
  { sector: "Retail", pct: 21, color: "#10b981" },
  { sector: "Healthcare", pct: 19, color: "#f59e0b" },
];

const OPPORTUNITIES = [
  {
    id: 1, company: "GlobalFreight Ltd", sector: "Logistics", amount: 85000,
    discount: 7.2, dueIn: 45, rating: "A+", region: "Europe",
    desc: "Invoice for freight services rendered to Deutsche Post AG.",
  },
  {
    id: 2, company: "TechManufacture Co", sector: "Manufacturing", amount: 120000,
    discount: 6.5, dueIn: 30, rating: "A", region: "Asia-Pacific",
    desc: "Components supply invoice for Samsung Electronics subsidiary.",
  },
  {
    id: 3, company: "MedSupply India", sector: "Healthcare", amount: 45000,
    discount: 8.9, dueIn: 60, rating: "B+", region: "South Asia",
    desc: "Medical equipment invoice for Apollo Hospitals group.",
  },
];

const RATINGCOLOR: Record<string, string> = {
  "A+": "text-green-400 border-green-500/30 bg-green-500/10",
  "A": "text-blue-400 border-blue-500/30 bg-blue-500/10",
  "B+": "text-amber-400 border-amber-500/30 bg-amber-500/10",
};

export default function ArcFlowInvestor() {
  const [funded, setFunded] = useState<number[]>([]);

  const handleFund = (id: number) => {
    setFunded(prev => [...prev, id]);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary" /> Arc-Flow Investor Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Fund real-economy invoices. Earn 5–12% annualized USDC yield with institutional-grade risk scoring.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Invested", value: "$280,000", icon: DollarSign, color: "text-primary", sub: "+$60K this month" },
          { label: "Avg. Yield", value: "7.4%", icon: TrendingUp, color: "text-green-400", sub: "Annualized APR" },
          { label: "Active Invoices", value: "12", icon: Zap, color: "text-amber-400", sub: "3 maturing this week" },
          { label: "Risk Score", value: "Low", icon: Shield, color: "text-cyan-400", sub: "Portfolio Grade: A" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="border-border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 border-border">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Yield Performance (Monthly)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={YIELD_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8 }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Area type="monotone" dataKey="yield" stroke="#3b82f6" fill="#3b82f620" strokeWidth={2} name="Yield %" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Portfolio by Sector</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center">
            <PieChart width={150} height={150}>
              <Pie data={PORTFOLIO} cx={75} cy={75} innerRadius={45} outerRadius={70} dataKey="pct">
                {PORTFOLIO.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
            <div className="space-y-1.5 w-full mt-2">
              {PORTFOLIO.map(p => (
                <div key={p.sector} className="flex justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-muted-foreground">{p.sector}</span>
                  </div>
                  <span className="font-semibold">{p.pct}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" /> Live Investment Opportunities
        </h2>
        <div className="space-y-4">
          {OPPORTUNITIES.map((opp, i) => {
            const isFunded = funded.includes(opp.id);
            return (
              <motion.div key={opp.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className={`border-border transition-all ${isFunded ? "opacity-60" : "hover:border-primary/40"}`}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                          <span className="font-black text-primary text-sm">{opp.company.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-foreground">{opp.company}</p>
                            <Badge className={`text-xs font-mono border ${RATINGCOLOR[opp.rating]}`}>{opp.rating}</Badge>
                            <Badge variant="outline" className="text-xs">{opp.region}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{opp.desc}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Invoice Amount</p>
                          <p className="font-bold text-foreground">${opp.amount.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Yield</p>
                          <p className="font-black text-green-400">{opp.discount}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Due In</p>
                          <p className="font-bold text-amber-400">{opp.dueIn}d</p>
                        </div>
                        {isFunded ? (
                          <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                            <CheckCircle2 className="w-5 h-5" /> Funded
                          </div>
                        ) : (
                          <Button onClick={() => handleFund(opp.id)} className="font-bold">
                            Fund Invoice
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-amber-400">Risk Disclosure:</span> Invoice financing carries credit, liquidity, and fraud risk. Past yield is not indicative of future returns. All invoices are verified by Chainalysis & TRM Labs for AML compliance. ARCOIN does not guarantee returns.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
