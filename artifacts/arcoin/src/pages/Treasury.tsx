import { useGetTreasuryOverview, getGetTreasuryOverviewQueryKey, useListDepartmentSpending, getListDepartmentSpendingQueryKey, useGetAuditLog, getGetAuditLogQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, TrendingUp, TrendingDown, FileText, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Treasury() {
  const { data: overview, isLoading: overviewLoading } = useGetTreasuryOverview({ query: { queryKey: getGetTreasuryOverviewQueryKey() } });
  const { data: spending, isLoading: spendLoading } = useListDepartmentSpending({ query: { queryKey: getListDepartmentSpendingQueryKey() } } as any);
  const { data: auditLog, isLoading: auditLoading } = useGetAuditLog({ query: { queryKey: getGetAuditLogQueryKey() } } as any);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Treasury Management</h1>
          <p className="text-muted-foreground">Real-time tracking of corporate assets and spending.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><FileText className="w-4 h-4 mr-2" /> PDF Report</Button>
          <Button variant="outline"><Download className="w-4 h-4 mr-2" /> CSV Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-2">Total Treasury Balance</div>
            {overviewLoading ? <Skeleton className="h-10 w-48" /> : (
              <div className="text-3xl font-bold font-mono">${overview?.totalBalance?.toLocaleString()}</div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-2">Monthly Inflow</div>
            {overviewLoading ? <Skeleton className="h-10 w-48" /> : (
              <div className="text-3xl font-bold font-mono text-green-500 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                ${overview?.monthlyInflow?.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-2">Monthly Outflow</div>
            {overviewLoading ? <Skeleton className="h-10 w-48" /> : (
              <div className="text-3xl font-bold font-mono text-destructive flex items-center">
                <TrendingDown className="w-5 h-5 mr-2" />
                ${overview?.monthlyOutflow?.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-card bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-primary mb-2">Net Change</div>
            {overviewLoading ? <Skeleton className="h-10 w-48" /> : (
              <div className="text-3xl font-bold font-mono text-primary">
                {overview?.netChange && overview.netChange > 0 ? '+' : ''}${overview?.netChange?.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 bg-card">
          <CardHeader>
            <CardTitle>Treasury Balance Trend (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {overviewLoading ? <Skeleton className="w-full h-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={overview?.last30DaysTrend || []}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Department Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {spendLoading ? (
                <div className="space-y-4">
                  {[1,2,3,4].map(i => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : (
                spending?.map((dept: any) => (
                  <div key={dept.department} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{dept.department}</span>
                      <span className="font-mono text-muted-foreground">${dept.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary rounded-full h-2" style={{ width: `${dept.percentage}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
          <CardDescription>Immutable record of all treasury operations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Transaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLoading ? (
                <TableRow><TableCell colSpan={5}><Skeleton className="h-20 w-full" /></TableCell></TableRow>
              ) : (
                auditLog?.entries?.map((entry: any) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-sm text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</TableCell>
                    <TableCell className="font-medium capitalize">{entry.action}</TableCell>
                    <TableCell>
                      <div className="text-sm">{entry.actor}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{entry.details}</TableCell>
                    <TableCell className="text-right">
                      {entry.txHash ? (
                        <a href={`https://scan.testnet.arc.network/tx/${entry.txHash}`} target="_blank" rel="noreferrer" className="inline-flex items-center text-primary hover:underline text-sm">
                          View <ArrowUpRight className="w-3 h-3 ml-1" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
