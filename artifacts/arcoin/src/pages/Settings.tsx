import { useState } from "react";
import { useGetOwnerWallet, getGetOwnerWalletQueryKey, useUpdateOwnerWallet } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings2, Save } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const { data: wallet, isLoading } = useGetOwnerWallet({ query: { queryKey: getGetOwnerWalletQueryKey() } });
  const updateMutation = useUpdateOwnerWallet();
  
  const [address, setAddress] = useState("");

  // Sync state when data loads
  if (wallet && !address && !isLoading) {
    setAddress(wallet.address);
  }

  const handleSave = () => {
    updateMutation.mutate({ data: { address } }, {
      onSuccess: () => {
        toast.success("Platform settings updated");
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Platform Settings</h1>
        <p className="text-muted-foreground">Manage administrative configurations and platform wallets.</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center"><Settings2 className="w-5 h-5 mr-2 text-primary" /> Owner Wallet Configuration</CardTitle>
          <CardDescription>This address receives all platform fee revenues and subscription payments.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <div className="grid grid-cols-3 gap-4">
                 <Skeleton className="h-24 w-full" />
                 <Skeleton className="h-24 w-full" />
                 <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Fee Collection Address (Multi-chain)</Label>
                <div className="flex gap-4">
                  <Input 
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="font-mono bg-background/50 h-12"
                  />
                  <Button className="h-12 px-8" onClick={handleSave} disabled={updateMutation.isPending || address === wallet?.address}>
                    <Save className="w-4 h-4 mr-2" /> Save
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Total Fee Revenue</div>
                  <div className="text-xl font-bold font-mono">${wallet?.feeRevenue?.toLocaleString() || 0}</div>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Subscription Revenue</div>
                  <div className="text-xl font-bold font-mono">${wallet?.subscriptionRevenue?.toLocaleString() || 0}</div>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg border border-primary/20">
                  <div className="text-xs text-primary mb-1">Total Combined Earnings</div>
                  <div className="text-xl font-bold font-mono text-primary">${wallet?.totalEarnings?.toLocaleString() || 0}</div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
