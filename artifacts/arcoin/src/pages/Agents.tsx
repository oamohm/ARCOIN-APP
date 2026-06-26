import { useState } from "react";
import { useChatWithAI, useGetAIInsights, getGetAIInsightsQueryKey, useGetAutonomousAgent, getGetAutonomousAgentQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Lightbulb, Zap, Shield, TrendingUp, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function Agents() {
  const [msg, setMsg] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', content: string}[]>([
    { role: 'ai', content: 'Hello operator. I am monitoring your portfolio on Arc Network. How can I assist you with yield optimization or risk management today?' }
  ]);
  
  const { data: insights, isLoading: insightsLoading } = useGetAIInsights({ query: { queryKey: getGetAIInsightsQueryKey() } } as any);
  const { data: agent, isLoading: agentLoading } = useGetAutonomousAgent("default", { query: { queryKey: getGetAutonomousAgentQueryKey("default") } } as any);
  const chatMutation = useChatWithAI();

  const handleSend = () => {
    if (!msg) return;
    setChatHistory(prev => [...prev, { role: 'user', content: msg }]);
    setMsg("");
    
    chatMutation.mutate({ data: { message: msg } } as any, {
      onSuccess: (res: any) => {
        setChatHistory(prev => [...prev, { role: 'ai', content: res.response }]);
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">AI Agents & Intelligence</h1>
        <p className="text-muted-foreground">Autonomous portfolio management and actionable market intelligence.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card h-[600px] flex flex-col border-primary/20 shadow-[0_0_30px_rgba(59,130,246,0.05)]">
            <CardHeader className="border-b border-border/50 bg-secondary/30 pb-4">
              <CardTitle className="flex items-center text-lg">
                <Bot className="w-5 h-5 mr-2 text-primary" /> ARCOIN Financial Advisor
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {chatHistory.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-4 ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground border border-border'}`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {chatMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="bg-secondary border border-border rounded-lg p-4 text-muted-foreground flex gap-1 items-center">
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-75"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-150"></div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-border bg-background/50">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                  <Input 
                    placeholder="Ask about yield opportunities, market risks..." 
                    className="flex-1 bg-secondary/50 border-border h-12"
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                  />
                  <Button type="submit" className="h-12 w-12" size="icon" disabled={!msg || chatMutation.isPending}>
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center"><Lightbulb className="w-4 h-4 mr-2 text-yellow-500" /> Executive Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {insightsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <>
                  {insights?.spendingAlert && (
                     <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3 items-start">
                       <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                       <div className="text-sm text-destructive-foreground/90">{insights.spendingAlert}</div>
                     </div>
                  )}
                  {insights?.marketInsight && (
                     <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex gap-3 items-start">
                       <TrendingUp className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                       <div className="text-sm text-blue-100">{insights.marketInsight}</div>
                     </div>
                  )}
                  <div className="p-4 bg-secondary/50 border border-border rounded-lg mt-4">
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Portfolio Risk Score</div>
                    <div className="text-2xl font-bold font-mono text-green-500">{insights?.riskScore || 0}/100</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center"><Zap className="w-4 h-4 mr-2 text-primary" /> Autonomous Agent</CardTitle>
            </CardHeader>
            <CardContent>
              {agentLoading ? <Skeleton className="h-32 w-full" /> : (
                agent ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 px-2 py-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></div> Active
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-8">Configure</Button>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Current Goal</div>
                      <div className="font-medium">{agent.goal}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4 bg-secondary/30 p-3 rounded-lg">
                       <div>
                         <div className="text-xs text-muted-foreground">Total Optimized</div>
                         <div className="font-mono text-green-500 font-bold">+${agent.totalOptimized?.toLocaleString() || 0}</div>
                       </div>
                       <div>
                         <div className="text-xs text-muted-foreground">Risk Profile</div>
                         <div className="capitalize font-medium">{agent.riskTolerance}</div>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground mb-4">No agent configured. Set up an autonomous agent to optimize your treasury 24/7.</p>
                    <Button className="w-full">Setup Agent</Button>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
