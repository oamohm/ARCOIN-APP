import { useState } from "react";
import { useBridgeAssets } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Waves } from "lucide-react";
import { toast } from "sonner";

export default function Bridge() {
  const [amount, setAmount] = useState("");
  const [fromChain, setFromChain] = useState("ethereum");
  const [toChain, setToChain] = useState("arbitrum");
  const [destAddress, setDestAddress] = useState("");
  
  const bridgeMutation = useBridgeAssets();

  const handleBridge = () => {
    if (!amount || !destAddress) {
      toast.error("Please fill in all fields");
      return;
    }

    bridgeMutation.mutate({
      data: {
        fromChain,
        toChain,
        amount: parseFloat(amount),
        destinationAddress: destAddress
      }
    }, {
      onSuccess: (res) => {
        toast.success(`Bridge initiated for ${amount} USDC`, {
          description: `Tx: ${res.txHash.substring(0, 10)}...`
        });
        setAmount("");
        setDestAddress("");
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Cross-Chain Bridge</h1>
        <p className="text-muted-foreground">Native USDC bridging powered by CCTP.</p>
      </div>

      <Card className="bg-card">
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
            <div className="space-y-2">
              <Label>From Network</Label>
              <Select value={fromChain} onValueChange={setFromChain}>
                <SelectTrigger className="h-14 bg-background/50 border-border text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                  <SelectItem value="optimism">Optimism</SelectItem>
                  <SelectItem value="base">Base</SelectItem>
                  <SelectItem value="solana">Solana</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center mt-6">
              <div className="bg-secondary/50 p-3 rounded-full border border-border shadow-sm">
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>To Network</Label>
              <Select value={toChain} onValueChange={setToChain}>
                <SelectTrigger className="h-14 bg-background/50 border-border text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                  <SelectItem value="optimism">Optimism</SelectItem>
                  <SelectItem value="base">Base</SelectItem>
                  <SelectItem value="solana">Solana</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Amount (USDC)</Label>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  className="font-mono text-2xl h-14 bg-background/50"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Destination Address</Label>
                <Input 
                  placeholder="0x..." 
                  className="font-mono h-14 bg-background/50"
                  value={destAddress}
                  onChange={e => setDestAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-900/10 border border-blue-900/30 p-4 rounded-lg flex items-start gap-4">
            <Waves className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-400">Zero Slippage Guarantee</p>
              <p className="text-xs text-blue-400/80">Using Circle's Cross-Chain Transfer Protocol (CCTP), your USDC is burned on the source chain and minted natively on the destination chain. No wrapped assets, zero slippage.</p>
            </div>
          </div>

          <Button 
            className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
            onClick={handleBridge}
            disabled={bridgeMutation.isPending}
          >
            {bridgeMutation.isPending ? "Initiating Bridge..." : "Bridge Assets"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
