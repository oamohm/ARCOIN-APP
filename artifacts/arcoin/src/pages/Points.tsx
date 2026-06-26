import { useGetPointsBalance, getGetPointsBalanceQueryKey, useGetPointsHistory, getGetPointsHistoryQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Gift, Star, Zap } from "lucide-react";

export default function Points() {
  const { data: balance, isLoading: balanceLoading } = useGetPointsBalance({ query: { queryKey: getGetPointsBalanceQueryKey() } });
  const { data: history, isLoading: historyLoading } = useGetPointsHistory({ query: { queryKey: getGetPointsHistoryQueryKey() } } as any);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">ARCOIN Rewards</h1>
        <p className="text-muted-foreground">Earn points for network participation and unlock premium features.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-gradient-to-br from-card to-card/50 border-yellow-500/20 shadow-[0_0_40px_rgba(234,179,8,0.05)] overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 text-yellow-500/10 pointer-events-none">
            <Trophy className="w-64 h-64" />
          </div>
          <CardContent className="p-8 relative z-10">
            <div className="inline-flex items-center px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm font-bold uppercase tracking-wider mb-6 border border-yellow-500/30">
              {balance?.tier || 'Bronze'} Tier
            </div>
            
            <div className="text-sm font-medium text-muted-foreground mb-2">Total Points Balance</div>
            {balanceLoading ? <Skeleton className="h-16 w-64" /> : (
              <div className="text-6xl font-bold font-mono text-foreground tracking-tight mb-8">
                {balance?.balance?.toLocaleString()} <span className="text-2xl text-muted-foreground ml-2">pts</span>
              </div>
            )}
            
            <div className="space-y-2 max-w-md">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress to {balance?.nextTierPoints ? 'Platinum' : 'Next Tier'}</span>
                <span className="font-mono">{balance?.balance?.toLocaleString()} / {balance?.nextTierPoints?.toLocaleString()}</span>
              </div>
              <Progress value={((balance?.balance || 0) / (balance?.nextTierPoints || 1)) * 100} className="h-3 bg-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center"><Zap className="w-5 h-5 mr-2 text-yellow-500" /> Current Multiplier</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center pb-8">
            {balanceLoading ? <Skeleton className="h-24 w-24 rounded-full" /> : (
              <div className="w-32 h-32 rounded-full border-4 border-yellow-500/30 flex items-center justify-center bg-yellow-500/5">
                <div className="text-4xl font-bold text-yellow-500">{balance?.multiplier}x</div>
              </div>
            )}
            <p className="text-center text-muted-foreground mt-4 text-sm px-4">
              Your points multiply on every transaction based on your tier and volume.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
               <div className="space-y-4">
                 {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
               </div>
            ) : (
              <div className="space-y-4">
                {history?.map((event: any) => (
                  <div key={event.id} className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
                    <div>
                      <div className="font-medium">{event.description}</div>
                      <div className="text-xs text-muted-foreground font-mono">{new Date(event.timestamp).toLocaleDateString()}</div>
                    </div>
                    <div className="font-bold text-green-500 font-mono">+{event.points}</div>
                  </div>
                ))}
                {(!history || history.length === 0) && (
                  <div className="text-center p-4 text-muted-foreground">No recent activity</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Available Rewards</CardTitle>
            <CardDescription>Redeem points for platform benefits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: '1', title: 'Zero Fee Bridge Pass', desc: '10 free cross-chain transfers', cost: 5000 },
              { id: '2', title: 'Premium Agent Access', desc: 'Unlock advanced AI trading strategies', cost: 15000 },
              { id: '3', title: 'Priority Support', desc: 'Direct line to compliance team', cost: 25000 },
            ].map((reward) => (
              <div key={reward.id} className="flex justify-between items-center p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <div className="flex gap-4 items-center">
                  <div className="p-2 bg-primary/10 rounded-lg"><Gift className="w-5 h-5 text-primary" /></div>
                  <div>
                    <div className="font-bold">{reward.title}</div>
                    <div className="text-sm text-muted-foreground">{reward.desc}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold font-mono text-yellow-500 mb-2">{reward.cost.toLocaleString()} pts</div>
                  <Button size="sm" variant="outline" disabled={(balance?.balance || 0) < reward.cost}>Redeem</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
