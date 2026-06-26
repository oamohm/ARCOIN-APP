import { useListVaultGoals, getListVaultGoalsQueryKey, useCreateVaultGoal, useVaultDeposit } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Plus, Lock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Vault() {
  const { data: goals, isLoading, refetch } = useListVaultGoals({ query: { queryKey: getListVaultGoalsQueryKey() } } as any);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Secure Vault</h1>
          <p className="text-muted-foreground">Inflation-protected savings and reserve goals.</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> New Goal</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1,2,3].map(i => <Skeleton key={i} className="h-64 w-full" />)
        ) : (
          goals?.map((goal: any) => (
            <Card key={goal.id} className="bg-card hover:border-primary/50 transition-colors flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-secondary p-3 rounded-xl">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="outline" className="bg-secondary/50 capitalize">{goal.type}</Badge>
                </div>
                
                <h3 className="font-bold text-xl mb-1">{goal.name}</h3>
                
                {goal.inflationProtected && (
                  <div className="flex items-center text-xs text-green-500 mb-6 font-medium">
                    <Shield className="w-3 h-3 mr-1" /> Inflation Shield Active
                  </div>
                )}
                
                <div className="mt-auto space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-sm text-muted-foreground">Current</div>
                      <div className="font-mono text-xl font-bold">${goal.currentAmount.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Target</div>
                      <div className="font-mono text-sm">${goal.targetAmount.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <Progress value={(goal.currentAmount / goal.targetAmount) * 100} className="h-2" />
                  
                  <div className="pt-4 flex gap-2">
                    <Button className="flex-1">Deposit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        
        <Card className="bg-card border-dashed flex flex-col items-center justify-center p-8 text-center text-muted-foreground hover:bg-secondary/20 hover:text-foreground cursor-pointer transition-colors min-h-[300px]">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Plus className="w-6 h-6" />
          </div>
          <p className="font-medium">Create Reserve Goal</p>
        </Card>
      </div>
    </div>
  );
}
