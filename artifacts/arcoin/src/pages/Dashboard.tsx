import { useGetWalletBalance, getGetWalletBalanceQueryKey, useListTransactions, getListTransactionsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRightLeft, ArrowUpRight, ArrowDownLeft, Send, Download, RefreshCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: balance, isLoading: balanceLoading } = useGetWalletBalance({ query: { queryKey: getGetWalletBalanceQueryKey() } });
  const { data: txData, isLoading: txLoading } = useListTransactions({ query: { limit: 5 }, queryKey: getListTransactionsQueryKey() } as any);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-foreground">Command Center</h1>
        <p className="text-muted-foreground">Unified asset overview and recent operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-[0_0_30px_rgba(59,130,246,0.05)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total USDC Balance</CardTitle>
          </CardHeader>
          <CardContent>
            {balanceLoading ? (
              <Skeleton className="h-12 w-64" />
            ) : (
              <div className="text-5xl font-bold font-mono tracking-tight text-foreground">
                ${balance?.totalUsdcBalance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </div>
            )}
            <div className="flex items-center gap-4 mt-6">
              <Link href="/send"><Button className="w-32"><Send className="w-4 h-4 mr-2" /> Send</Button></Link>
              <Link href="/receive"><Button variant="secondary" className="w-32"><Download className="w-4 h-4 mr-2" /> Receive</Button></Link>
              <Link href="/swap"><Button variant="outline" className="w-32"><RefreshCcw className="w-4 h-4 mr-2" /> Swap</Button></Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Chain Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {balanceLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              balance?.chains?.map((chain) => (
                <div key={chain.chain} className="flex items-center justify-between">
                  <span className="text-sm capitalize font-medium">{chain.chain}</span>
                  <span className="text-sm font-mono text-muted-foreground">${chain.usdc.toLocaleString()}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Button variant="ghost" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          {txLoading ? (
            <div className="space-y-4">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : (
            <div className="space-y-1">
              {txData?.transactions?.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-secondary/50 transition-colors border border-transparent hover:border-border">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${tx.type === 'send' ? 'bg-destructive/20 text-destructive' : 'bg-green-500/20 text-green-500'}`}>
                      {tx.type === 'send' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-medium capitalize">{tx.type}</div>
                      <div className="text-xs text-muted-foreground font-mono">{new Date(tx.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono font-medium ${tx.type === 'send' ? 'text-foreground' : 'text-green-500'}`}>
                      {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.currency}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">{tx.status}</div>
                  </div>
                </div>
              ))}
              {(!txData?.transactions || txData.transactions.length === 0) && (
                <div className="text-center p-8 text-muted-foreground">No recent transactions</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
