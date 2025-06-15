
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

const CodeBlock = ({ code, language = "javascript", title, className }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Code has been copied to your clipboard",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className={cn("code-block relative group mt-2 mb-4", className)}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-muted/20 bg-muted/10 rounded-t-md text-sm font-medium">
          <div className="flex items-center">
            <span className="text-muted-foreground">{title}</span>
            {language && (
              <span className="ml-2 text-xs text-muted-foreground/70">{language}</span>
            )}
          </div>
        </div>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
      <pre className={title ? "pt-2" : ""}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
