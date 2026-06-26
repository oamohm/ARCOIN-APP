import { useState } from "react";
import { useGetReceiveAddress, getGetReceiveAddressQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Copy, QrCode } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function Receive() {
  const [chain, setChain] = useState("ethereum");
  
  const { data, isLoading } = useGetReceiveAddress(chain, {
    query: {
      queryKey: getGetReceiveAddressQueryKey(chain)
    }
  } as any); // using any for missing param in generated hook if any

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied to clipboard");
  };

  return (
    <div className="max-w-md mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Receive Assets</h1>
        <p className="text-muted-foreground">Select a network to view your receiving address.</p>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Network Selection</CardTitle>
          <CardDescription>Only send assets via the selected network to avoid loss of funds.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Select value={chain} onValueChange={setChain}>
            <SelectTrigger className="h-12 bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ethereum">Ethereum (ERC-20)</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
              <SelectItem value="arbitrum">Arbitrum One</SelectItem>
              <SelectItem value="optimism">Optimism</SelectItem>
              <SelectItem value="base">Base</SelectItem>
              <SelectItem value="solana">Solana</SelectItem>
            </SelectContent>
          </Select>

          <div className="bg-secondary/30 rounded-xl p-8 flex flex-col items-center justify-center border border-border mt-8">
            {isLoading ? (
              <Skeleton className="w-48 h-48 rounded-lg" />
            ) : (
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <QrCode className="w-40 h-40 text-black" />
              </div>
            )}
            
            <div className="mt-8 w-full">
              <div className="text-sm font-medium text-muted-foreground mb-2 text-center">Your Deposit Address</div>
              {isLoading ? (
                <Skeleton className="h-12 w-full" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-background/50 border border-border p-3 rounded-lg font-mono text-sm break-all text-center">
                    {data?.address || "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"}
                  </div>
                  <Button variant="secondary" size="icon" className="h-12 w-12 shrink-0" onClick={() => handleCopy(data?.address || "0x742d35Cc6634C0532925a3b844Bc454e4438f44e")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
