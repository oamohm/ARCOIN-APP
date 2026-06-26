import { useGetAdminAnalytics, getGetAdminAnalyticsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Activity, DollarSign, CreditCard } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PIE_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function Admin() {
  const { data: analytics, isLoading } = useGetAdminAnalytics({ query: { queryKey: getGetAdminAnalyticsQueryKey() } });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-primary">System Telemetry</h1>
        <p className="text-muted-foreground">Global platform metrics and network health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Total Users</div>
              {isLoading ? <Skeleton className="h-8 w-24" /> : <div className="text-3xl font-bold font-mono">{analytics?.totalUsers?.toLocaleString()}</div>}
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl"><Users className="w-6 h-6 text-blue-500" /></div>
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">24h Active</div>
              {isLoading ? <Skeleton className="h-8 w-24" /> : <div className="text-3xl font-bold font-mono">{analytics?.activeUsers24h?.toLocaleString()}</div>}
            </div>
            <div className="p-3 bg-green-500/10 rounded-xl"><Activity className="w-6 h-6 text-green-500" /></div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Total Volume</div>
              {isLoading ? <Skeleton className="h-8 w-24" /> : <div className="text-3xl font-bold font-mono">${(analytics?.totalVolume || 0) > 1000000 ? `${(analytics!.totalVolume/1000000).toFixed(1)}M` : analytics?.totalVolume?.toLocaleString()}</div>}
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl"><DollarSign className="w-6 h-6 text-purple-500" /></div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Tx Count</div>
              {isLoading ? <Skeleton className="h-8 w-24" /> : <div className="text-3xl font-bold font-mono">{analytics?.totalTransactions?.toLocaleString()}</div>}
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-xl"><CreditCard className="w-6 h-6 text-yellow-500" /></div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isLoading ? <Skeleton className="w-full h-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.dailySignups || []}>
                    <defs>
                      <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                    <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorSignups)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Chain Distribution (Volume)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-[250px] w-full">
              {isLoading ? <Skeleton className="w-full h-full rounded-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics?.chainDistribution || []}
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="volume"
                      nameKey="chain"
                      stroke="none"
                    >
                      {(analytics?.chainDistribution || []).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4 w-full">
              {analytics?.chainDistribution?.map((chain: any, idx: number) => (
                <div key={chain.chain} className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></div>
                  <span className="capitalize">{chain.chain}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
