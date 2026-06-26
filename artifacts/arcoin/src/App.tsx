import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Send from "@/pages/Send";
import Receive from "@/pages/Receive";
import Swap from "@/pages/Swap";
import Bridge from "@/pages/Bridge";
import Streaming from "@/pages/Streaming";
import Treasury from "@/pages/Treasury";
import Governance from "@/pages/Governance";
import ArcFlow from "@/pages/ArcFlow";
import ArcFlowInvestor from "@/pages/ArcFlowInvestor";
import Agents from "@/pages/Agents";
import Vault from "@/pages/Vault";
import Compliance from "@/pages/Compliance";
import Points from "@/pages/Points";
import Settings from "@/pages/Settings";
import Admin from "@/pages/Admin";
import Breath from "@/pages/Breath";
import Shields from "@/pages/Shields";

import { Layout } from "@/components/Layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard"><Layout><Dashboard /></Layout></Route>
      <Route path="/send"><Layout><Send /></Layout></Route>
      <Route path="/receive"><Layout><Receive /></Layout></Route>
      <Route path="/swap"><Layout><Swap /></Layout></Route>
      <Route path="/bridge"><Layout><Bridge /></Layout></Route>
      <Route path="/streaming"><Layout><Streaming /></Layout></Route>
      <Route path="/treasury"><Layout><Treasury /></Layout></Route>
      <Route path="/governance"><Layout><Governance /></Layout></Route>
      <Route path="/arcflow"><Layout><ArcFlow /></Layout></Route>
      <Route path="/arcflow/investor"><Layout><ArcFlowInvestor /></Layout></Route>
      <Route path="/agents"><Layout><Agents /></Layout></Route>
      <Route path="/vault"><Layout><Vault /></Layout></Route>
      <Route path="/compliance"><Layout><Compliance /></Layout></Route>
      <Route path="/points"><Layout><Points /></Layout></Route>
      <Route path="/breath"><Layout><Breath /></Layout></Route>
      <Route path="/shields"><Layout><Shields /></Layout></Route>
      <Route path="/settings"><Layout><Settings /></Layout></Route>
      <Route path="/admin"><Layout><Admin /></Layout></Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
