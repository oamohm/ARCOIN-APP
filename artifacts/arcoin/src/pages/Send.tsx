import { useState } from "react";
import { useSendPayment } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Send as SendIcon, CheckCircle2 } from "lucide-react";

export default function Send() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [chain, setChain] = useState("ethereum");
  const sendMutation = useSendPayment();

  const handleSend = () => {
    if (!address || !amount) {
      toast.error("Please fill in all fields");
      return;
    }
    
    sendMutation.mutate({
      data: {
        toAddress: address,
        amount: parseFloat(amount),
        currency: "USDC",
        chain: chain
      }
    }, {
      onSuccess: (res) => {
        toast.success(`Sent ${amount} USDC successfully`, {
          description: `Tx: ${res.txHash.substring(0, 10)}...`
        });
        setAddress("");
        setAmount("");
      },
      onError: () => {
        toast.error("Failed to send payment");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Send Assets</h1>
        <p className="text-muted-foreground">Execute cross-border USDC payments instantly.</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Transfer Details</CardTitle>
          <CardDescription>All transfers are settled in native USDC.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Recipient Address</Label>
            <Input 
              placeholder="0x..." 
              className="font-mono bg-background/50 h-12"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount (USDC)</Label>
              <Input 
                type="number" 
                placeholder="0.00" 
                className="font-mono text-xl h-12 bg-background/50"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Destination Chain</Label>
              <Select value={chain} onValueChange={setChain}>
                <SelectTrigger className="h-12 bg-background/50">
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

          <div className="pt-4">
            <Button 
              className="w-full h-14 text-lg font-semibold" 
              onClick={handleSend}
              disabled={sendMutation.isPending}
            >
              {sendMutation.isPending ? "Confirming..." : <><SendIcon className="w-5 h-5 mr-2" /> Execute Transfer</>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
