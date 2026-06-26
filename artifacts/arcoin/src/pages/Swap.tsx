import { useState } from "react";
import { useSwapCurrency } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDownUp } from "lucide-react";
import { toast } from "sonner";

export default function Swap() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USDC");
  const [toCurrency, setToCurrency] = useState("EURC");
  const swapMutation = useSwapCurrency();

  const handleSwap = () => {
    if (!amount) return;
    swapMutation.mutate({
      data: {
        amount: parseFloat(amount),
        fromCurrency,
        toCurrency
      }
    }, {
      onSuccess: () => {
        toast.success(`Swapped ${amount} ${fromCurrency} to ${toCurrency}`);
        setAmount("");
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Foreign Exchange</h1>
        <p className="text-muted-foreground">Institutional-grade stablecoin swaps.</p>
      </div>

      <Card className="bg-card">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg bg-background/50">
              <Label className="text-muted-foreground">You Pay</Label>
              <div className="flex mt-2 gap-4">
                <Input 
                  type="number" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)} 
                  placeholder="0.00" 
                  className="text-3xl h-14 font-mono border-none shadow-none bg-transparent px-0 focus-visible:ring-0" 
                />
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-32 h-14 border-border bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="EURC">EURC</SelectItem>
                    <SelectItem value="JPYC">JPYC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center -my-6 relative z-10">
              <Button variant="secondary" size="icon" className="rounded-full h-12 w-12 border-4 border-card shadow-sm">
                <ArrowDownUp className="w-5 h-5 text-muted-foreground" />
              </Button>
            </div>

            <div className="p-4 border border-border rounded-lg bg-background/50">
              <Label className="text-muted-foreground">You Receive (Estimated)</Label>
              <div className="flex mt-2 gap-4">
                <div className="flex-1 text-3xl h-14 font-mono flex items-center text-muted-foreground">
                  {amount ? (parseFloat(amount) * 0.92).toFixed(2) : "0.00"}
                </div>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-32 h-14 border-border bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EURC">EURC</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="JPYC">JPYC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-secondary/30 p-4 rounded-lg flex justify-between text-sm">
            <span className="text-muted-foreground">Exchange Rate</span>
            <span className="font-mono">1 USDC = 0.92 EURC</span>
          </div>

          <Button 
            className="w-full h-14 text-lg font-semibold" 
            onClick={handleSwap}
            disabled={!amount || swapMutation.isPending}
          >
            {swapMutation.isPending ? "Executing..." : "Execute Swap"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
