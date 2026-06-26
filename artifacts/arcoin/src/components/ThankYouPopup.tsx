import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ThankYouPopupProps {
  show: boolean;
  onClose: () => void;
  amount?: string;
  recipient?: string;
  txHash?: string;
  type?: "send" | "streaming" | "invoice" | "swap" | "vault";
}

const MESSAGES: Record<string, { title: string; sub: string; emoji: string }> = {
  send:      { emoji: "🚀", title: "Payment Sent!", sub: "USDC has been transferred instantly on Arc Network." },
  streaming: { emoji: "💫", title: "Stream Created!", sub: "Real-time USDC streaming has started." },
  invoice:   { emoji: "📄", title: "Invoice Minted!", sub: "Your invoice NFT is now live on Arc Network." },
  swap:      { emoji: "🔄", title: "Swap Complete!", sub: "Tokens swapped successfully via Arc DEX." },
  vault:     { emoji: "🔐", title: "Saved to Vault!", sub: "Your USDC is now earning yield in your vault." },
};

export function ThankYouPopup({ show, onClose, amount, recipient, txHash, type = "send" }: ThankYouPopupProps) {
  const [copied, setCopied] = useState(false);
  const msg = MESSAGES[type];

  const copyHash = () => {
    if (txHash) navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative z-10 w-full max-w-sm mx-4 bg-card border border-border rounded-2xl p-8 shadow-2xl text-center"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 18, stiffness: 280 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {msg.emoji}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h2 className="text-2xl font-black text-foreground">{msg.title}</h2>
              <p className="text-muted-foreground text-sm mt-1">{msg.sub}</p>
            </motion.div>

            {(amount || recipient) && (
              <motion.div
                className="mt-5 bg-secondary/40 rounded-xl p-4 border border-border space-y-2 text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {amount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-bold text-green-400">{amount} USDC</span>
                  </div>
                )}
                {recipient && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">To</span>
                    <span className="font-mono text-xs text-foreground">{recipient.slice(0, 6)}...{recipient.slice(-4)}</span>
                  </div>
                )}
                {txHash && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Tx Hash</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-primary">{txHash.slice(0, 8)}...</span>
                      <button onClick={copyHash} className="text-muted-foreground hover:text-foreground">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
                {copied && <p className="text-xs text-green-400 text-center">Copied!</p>}
              </motion.div>
            )}

            {txHash && (
              <motion.a
                href={`https://scan.testnet.arc.network/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1 text-xs text-primary hover:underline mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                View on ArcScan <ExternalLink className="w-3 h-3" />
              </motion.a>
            )}

            <div className="mt-6 space-y-2">
              <div className="text-xs text-muted-foreground bg-primary/10 rounded-lg px-3 py-2 border border-primary/20">
                🏆 +50 ARCOIN Points earned for this transaction!
              </div>
              <Button className="w-full" onClick={onClose}>
                Done
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
