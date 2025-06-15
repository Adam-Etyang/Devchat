
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import CodeBlock from "@/components/CodeBlock";

export interface Message {
  id: string;
  sender: string;
  avatar?: string;
  content: string;
  timestamp: Date;
  isCode?: boolean;
  language?: string;
}

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

const ChatMessage = ({ message, isCurrentUser }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[80%]",
          isCurrentUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        <Avatar className={cn("h-8 w-8", isCurrentUser ? "ml-2" : "mr-2")}>
          <div className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center text-sm font-medium">
            {message.sender.substring(0, 2).toUpperCase()}
          </div>
        </Avatar>
        
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{message.sender}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
          
          {message.isCode ? (
            <CodeBlock 
              code={message.content} 
              language={message.language}
              className="max-w-full"
            />
          ) : (
            <div className={cn(
              "px-4 py-2 rounded-lg",
              isCurrentUser 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground"
            )}>
              {message.content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
