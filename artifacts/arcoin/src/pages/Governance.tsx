import { useState } from "react";
import { useListProposals, getListProposalsQueryKey, useListMultisigTransactions, getListMultisigTransactionsQueryKey, useCastVote, useSignMultisigTx } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Clock, PenTool } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function Governance() {
  const { data: proposals, isLoading: proposalsLoading, refetch: refetchProposals } = useListProposals({ query: { queryKey: getListProposalsQueryKey() } } as any);
  const { data: multisig, isLoading: multisigLoading, refetch: refetchMultisig } = useListMultisigTransactions({ query: { queryKey: getListMultisigTransactionsQueryKey() } } as any);
  
  const voteMutation = useCastVote();
  const signMutation = useSignMultisigTx();

  const handleVote = (id: string, support: boolean) => {
    voteMutation.mutate({ id, data: { support } } as any, {
      onSuccess: () => {
        toast.success("Vote recorded successfully");
        refetchProposals();
      }
    });
  };

  const handleSign = (id: string) => {
    signMutation.mutate({ id } as any, {
      onSuccess: () => {
        toast.success("Transaction signed");
        refetchMultisig();
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Governance & Multisig</h1>
        <p className="text-muted-foreground">Participate in protocol decisions and approve pending operations.</p>
      </div>

      <Tabs defaultValue="proposals" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-secondary">
          <TabsTrigger value="proposals">DAO Proposals</TabsTrigger>
          <TabsTrigger value="multisig">Multisig Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="space-y-6">
          {proposalsLoading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <Skeleton key={i} className="h-40 w-full" />)}
            </div>
          ) : (
            proposals?.map((prop: any) => (
              <Card key={prop.id} className="bg-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={prop.status === 'active' ? 'default' : 'secondary'} className="capitalize">{prop.status}</Badge>
                        <span className="text-sm font-mono text-muted-foreground">ID: {prop.id.substring(0,8)}</span>
                      </div>
                      <h3 className="text-xl font-bold">{prop.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Deadline</div>
                      <div className="font-mono">{new Date(prop.deadline).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6 line-clamp-2">{prop.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-8">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">For</div>
                        <div className="font-bold text-green-500 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> {prop.votesFor.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Against</div>
                        <div className="font-bold text-destructive flex items-center gap-2"><XCircle className="w-4 h-4"/> {prop.votesAgainst.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Quorum</div>
                        <div className="font-bold text-foreground">{prop.quorum.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    {prop.status === 'active' && !prop.userVote && (
                      <div className="flex gap-2">
                        <Button variant="outline" className="text-green-500 border-green-500/20 hover:bg-green-500/10" onClick={() => handleVote(prop.id, true)} disabled={voteMutation.isPending}>Vote For</Button>
                        <Button variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10" onClick={() => handleVote(prop.id, false)} disabled={voteMutation.isPending}>Vote Against</Button>
                      </div>
                    )}
                    {prop.userVote && (
                      <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">You Voted: {prop.userVote}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="multisig" className="space-y-6">
          {multisigLoading ? (
            <div className="space-y-4">
              {[1,2].map(i => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
          ) : (
            multisig?.map((tx: any) => (
              <Card key={tx.id} className="bg-card">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={tx.status === 'pending' ? 'outline' : 'secondary'} className="capitalize bg-secondary/50">
                        {tx.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {tx.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground font-mono">{new Date(tx.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-bold">{tx.title}</h3>
                    <div className="text-sm font-mono text-muted-foreground mt-1">To: {tx.toAddress}</div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">Amount</div>
                      <div className="font-bold text-xl font-mono">{tx.amount.toLocaleString()} {tx.currency}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">Signatures</div>
                      <div className="font-bold font-mono bg-secondary/50 px-3 py-1 rounded">
                        <span className={tx.signaturesCount >= tx.threshold ? "text-green-500" : ""}>{tx.signaturesCount}</span> / {tx.threshold}
                      </div>
                    </div>
                    {tx.status === 'pending' && !tx.userSigned && (
                      <Button onClick={() => handleSign(tx.id)} disabled={signMutation.isPending}><PenTool className="w-4 h-4 mr-2" /> Sign</Button>
                    )}
                    {tx.userSigned && (
                      <div className="text-sm text-green-500 font-medium flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> Signed</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
