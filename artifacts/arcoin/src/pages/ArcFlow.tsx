import { useState } from "react";
import { useListInvoices, getListInvoicesQueryKey, useListMarketplaceInvoices, getListMarketplaceInvoicesQueryKey, useGetInvestorDashboard, getGetInvestorDashboardQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Boxes, TrendingUp, AlertCircle } from "lucide-react";

export default function ArcFlow() {
  const { data: myInvoices, isLoading: invoicesLoading } = useListInvoices({ query: { queryKey: getListInvoicesQueryKey() } } as any);
  const { data: marketplace, isLoading: marketLoading } = useListMarketplaceInvoices({ query: { queryKey: getListMarketplaceInvoicesQueryKey() } } as any);
  const { data: dashboard, isLoading: dashLoading } = useGetInvestorDashboard({ query: { queryKey: getGetInvestorDashboardQueryKey() } } as any);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">ArcFlow Invoice Financing</h1>
        <p className="text-muted-foreground">Tokenize, list, and invest in corporate invoices.</p>
      </div>

      <Tabs defaultValue="marketplace" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8 bg-secondary">
          <TabsTrigger value="my-invoices">My Invoices</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="investor">Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card">
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground mb-2">Total Liquidity</div>
                {marketLoading ? <Skeleton className="h-8 w-32" /> : <div className="text-3xl font-bold font-mono">${marketplace?.totalLiquidity?.toLocaleString() || 0}</div>}
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground mb-2">Avg. APY Return</div>
                {marketLoading ? <Skeleton className="h-8 w-32" /> : <div className="text-3xl font-bold font-mono text-green-500">{marketplace?.avgReturn || 0}%</div>}
              </CardContent>
            </Card>
          </div>

          <h3 className="text-xl font-bold mb-4">Available for Funding</h3>
          <div className="grid gap-4">
            {marketLoading ? (
              [1,2,3].map(i => <Skeleton key={i} className="h-32 w-full" />)
            ) : (
              marketplace?.invoices?.map((inv: any) => (
                <Card key={inv.id} className="bg-card hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">NFT: {inv.nftTokenId}</Badge>
                        <span className="text-sm text-muted-foreground font-mono">Due: {new Date(inv.dueDate).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-lg">{inv.vendorName} → {inv.buyerName}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">{inv.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-8 bg-secondary/30 p-4 rounded-lg">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Amount</div>
                        <div className="font-bold font-mono">${inv.amount.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Discount Rate</div>
                        <div className="font-bold font-mono text-green-500">{inv.discountRate}%</div>
                      </div>
                      <Button>Fund Invoice</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="investor" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-2 bg-gradient-to-br from-card to-card/50 border-primary/20">
              <CardContent className="p-8">
                <div className="text-sm font-medium text-muted-foreground mb-2">Active Portfolio Value</div>
                {dashLoading ? <Skeleton className="h-12 w-48" /> : (
                  <div className="text-5xl font-bold font-mono">${dashboard?.portfolioValue?.toLocaleString() || 0}</div>
                )}
                <div className="mt-6 flex gap-8">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Return</div>
                    <div className="font-bold text-green-500 flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 mr-1" /> +${dashboard?.totalReturn?.toLocaleString() || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Active Investments</div>
                    <div className="font-bold mt-1">{dashboard?.activeInvestments || 0} Invoices</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="my-invoices" className="space-y-6">
          <div className="flex justify-end mb-4">
            <Button><Boxes className="w-4 h-4 mr-2" /> Tokenize New Invoice</Button>
          </div>
          {invoicesLoading ? <Skeleton className="h-64 w-full" /> : (
            <div className="grid gap-4">
               {myInvoices?.map((inv: any) => (
                  <Card key={inv.id} className="bg-card">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold">{inv.buyerName}</h4>
                        <div className="text-sm text-muted-foreground font-mono mt-1">${inv.amount.toLocaleString()} • Due {new Date(inv.dueDate).toLocaleDateString()}</div>
                      </div>
                      <Badge className="capitalize">{inv.status}</Badge>
                    </CardContent>
                  </Card>
               ))}
               {(!myInvoices || myInvoices.length === 0) && (
                 <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-lg border border-dashed">
                   No invoices tokenized yet.
                 </div>
               )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
