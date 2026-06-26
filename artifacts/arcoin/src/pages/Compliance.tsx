import { useState } from "react";
import { useGetKycStatus, getGetKycStatusQueryKey, useRunComplianceCheck } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Search, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Compliance() {
  const { data: kyc, isLoading: kycLoading } = useGetKycStatus({ query: { queryKey: getGetKycStatusQueryKey() } });
  
  const [address, setAddress] = useState("");
  const checkMutation = useRunComplianceCheck();
  const [result, setResult] = useState<any>(null);

  const handleCheck = () => {
    if (!address) return;
    checkMutation.mutate({ data: { address, chain: "ethereum" } }, {
      onSuccess: (res) => setResult(res)
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Regulatory Shield</h1>
        <p className="text-muted-foreground">Institutional-grade compliance and address screening.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card md:col-span-1">
          <CardHeader>
            <CardTitle>KYB / KYC Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {kycLoading ? <Skeleton className="h-32 w-full" /> : (
              <div className="flex flex-col items-center justify-center p-6 bg-secondary/30 rounded-xl border border-border">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-bold text-xl capitalize mb-1">{kyc?.level} Level</h3>
                <Badge className="bg-green-500 text-black hover:bg-green-600">Verified</Badge>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="text-sm font-medium">Compliance Frameworks</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-background">FATF Travel Rule</Badge>
                <Badge variant="outline" className="bg-background">MiCAR Ready</Badge>
                <Badge variant="outline" className="bg-background">GDPR</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card md:col-span-2">
          <CardHeader>
            <CardTitle>On-Chain Address Screening</CardTitle>
            <CardDescription>Check external wallets against global sanction lists and AML databases before transacting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <Input 
                placeholder="0x..." 
                className="font-mono h-12 bg-background/50"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
              <Button className="h-12 px-8" onClick={handleCheck} disabled={checkMutation.isPending || !address}>
                <Search className="w-4 h-4 mr-2" /> Screen
              </Button>
            </div>

            {checkMutation.isPending && (
              <div className="p-8 text-center space-y-4">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto"></div>
                <p className="text-muted-foreground animate-pulse">Running heuristic analysis and database cross-checks...</p>
              </div>
            )}

            {result && !checkMutation.isPending && (
              <div className={`p-6 rounded-xl border ${result.riskLevel === 'high' || result.riskLevel === 'blocked' ? 'bg-destructive/10 border-destructive/30' : 'bg-green-500/10 border-green-500/30'}`}>
                <div className="flex items-start gap-4">
                  {result.riskLevel === 'high' || result.riskLevel === 'blocked' ? (
                    <ShieldAlert className="w-8 h-8 text-destructive shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-8 h-8 text-green-500 shrink-0" />
                  )}
                  <div className="space-y-4 flex-1">
                    <div>
                      <h4 className="font-bold text-lg flex items-center gap-3">
                        Risk Assessment: <span className="capitalize">{result.riskLevel}</span>
                      </h4>
                      <p className="font-mono text-sm text-muted-foreground mt-1 break-all">{result.address}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 bg-background/50 p-4 rounded-lg">
                      <div>
                        <div className="text-sm text-muted-foreground">Sanctions Check</div>
                        <div className="font-medium text-sm mt-1">{result.sanctioned ? <span className="text-destructive">Failed</span> : <span className="text-green-500">Passed</span>}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">AML Heuristics</div>
                        <div className="font-medium text-sm mt-1">{result.amlPassed ? <span className="text-green-500">Clear</span> : <span className="text-destructive">Flags Detected</span>}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
