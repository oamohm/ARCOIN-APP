import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Send, Download, RefreshCcw, ArrowRightLeft, FileSpreadsheet,
  Building2, Landmark, Boxes, Bot, Lock, ShieldCheck, Trophy, Settings, Users,
  Wind, Shield, BarChart3
} from "lucide-react";
import { useGetCurrentUser, getGetCurrentUserQueryKey } from "@workspace/api-client-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: user } = useGetCurrentUser({ query: { queryKey: getGetCurrentUserQueryKey() } });

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Send", href: "/send", icon: Send },
    { name: "Receive", href: "/receive", icon: Download },
    { name: "Swap", href: "/swap", icon: RefreshCcw },
    { name: "Bridge", href: "/bridge", icon: ArrowRightLeft },
    { name: "Streaming", href: "/streaming", icon: FileSpreadsheet },
    { name: "Treasury", href: "/treasury", icon: Building2 },
    { name: "Governance", href: "/governance", icon: Landmark },
    { name: "Arc-Flow", href: "/arcflow", icon: Boxes },
    { name: "Investor", href: "/arcflow/investor", icon: BarChart3 },
    { name: "AI Agents", href: "/agents", icon: Bot },
    { name: "Vault", href: "/vault", icon: Lock },
    { name: "Compliance", href: "/compliance", icon: ShieldCheck },
    { name: "Shields", href: "/shields", icon: Shield },
    { name: "Breath", href: "/breath", icon: Wind },
    { name: "Points", href: "/points", icon: Trophy },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Admin", href: "/admin", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border h-16 flex items-center px-6 justify-between shrink-0 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-black text-xl tracking-tighter text-primary hover:text-primary/80 transition-colors">ARCOIN</Link>
          <div className="text-xs font-mono bg-secondary px-3 py-1.5 rounded-md text-secondary-foreground border border-border flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Arc Network · 5042002
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <div className="text-xs font-semibold px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-amber-600/20 text-yellow-400 rounded-lg border border-yellow-500/20 uppercase tracking-wider">
              {user.tier} Tier
            </div>
          )}
          <div className="text-xs font-mono text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border">
            {user?.walletAddress
              ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
              : "0x1234...5678"}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 border-r border-border bg-card/30 flex flex-col shrink-0">
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              const isSubItem = item.href.includes("/investor");
              return (
                <Link key={item.href} href={item.href} className="block">
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start font-medium h-9 text-sm ${isSubItem ? "pl-7" : ""} ${
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 mr-2.5" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border">
            <div className="text-[10px] text-muted-foreground text-center font-mono">
              Powered by Circle · Arc Network
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none -z-10"></div>
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
