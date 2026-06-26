import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Mail, KeyRound } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useSendEmailOtp, useVerifyEmailOtp, useWalletLogin } from "@workspace/api-client-react";


export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const sendOtpMutation = useSendEmailOtp();
  const verifyOtpMutation = useVerifyEmailOtp();
  const walletLoginMutation = useWalletLogin();

  const handleSendOtp = () => {
    sendOtpMutation.mutate({ data: { email } }, {
      onSuccess: () => setOtpSent(true)
    });
  };

  const handleVerifyOtp = () => {
    verifyOtpMutation.mutate({ data: { email, otp } }, {
      onSuccess: () => setLocation("/dashboard")
    });
  };

  const handleWalletLogin = () => {
    walletLoginMutation.mutate({
      data: {
        walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        signature: "mock_signature",
        message: "Sign in to ARCOIN",
        chainId: 5042002
      }
    }, {
      onSuccess: () => setLocation("/dashboard")
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-primary rounded-xl mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground tracking-tighter">A</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to ARCOIN</h1>
          <p className="text-muted-foreground mt-2">Connect to the global financial operating system.</p>
        </div>

        <Card className="border-border bg-card/50 backdrop-blur-md">
          <Tabs defaultValue="wallet" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
              <TabsTrigger value="wallet"><Wallet className="w-4 h-4 mr-2" /> Web3 Wallet</TabsTrigger>
              <TabsTrigger value="email"><Mail className="w-4 h-4 mr-2" /> Email OTP</TabsTrigger>
            </TabsList>
            
            <TabsContent value="wallet" className="p-6">
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full h-14 justify-start text-lg font-medium border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                  onClick={handleWalletLogin}
                  disabled={walletLoginMutation.isPending}
                >
                  <div className="w-6 h-6 mr-4 rounded flex items-center justify-center text-white text-[10px] font-bold" style={{background:"#F6851B"}}>M</div>
                  MetaMask
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-14 justify-start text-lg font-medium border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                  onClick={handleWalletLogin}
                  disabled={walletLoginMutation.isPending}
                >
                  <div className="w-6 h-6 mr-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{background:"#0052FF"}}>C</div>
                  Coinbase Wallet
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-14 justify-start text-lg font-medium border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                  onClick={handleWalletLogin}
                  disabled={walletLoginMutation.isPending}
                >
                  <div className="w-6 h-6 mr-4 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">W</div>
                  WalletConnect
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="email" className="p-6">
              {!otpSent ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input 
                      placeholder="operator@firm.com" 
                      className="h-12 bg-background/50"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full h-12 text-lg" 
                    onClick={handleSendOtp}
                    disabled={!email || sendOtpMutation.isPending}
                  >
                    Send One-Time Passcode
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Enter code sent to {email}</label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input 
                        placeholder="000000" 
                        className="h-12 pl-10 text-xl tracking-widest text-center font-mono bg-background/50"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full h-12 text-lg" 
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 6 || verifyOtpMutation.isPending}
                  >
                    Verify & Login
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={() => setOtpSent(false)}>
                    Use different email
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
}
