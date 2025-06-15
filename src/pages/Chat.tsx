
import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Layout from "@/components/Layout";
import ChatMessage, { Message } from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import CodeSidebar from "@/components/CodeSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";

// Mock data for initial messages
const initialMessages: Message[] = [
  {
    id: "1",
    sender: "Jane Cooper",
    content: "Hey team! I'm working on the authentication module and ran into an issue.",
    timestamp: new Date("2025-05-16T10:30:00"),
    isCode: false
  },
  {
    id: "2",
    sender: "Alex Johnson",
    content: "What's the problem? Maybe I can help.",
    timestamp: new Date("2025-05-16T10:32:00"),
    isCode: false
  },
  {
    id: "3",
    sender: "Jane Cooper",
    content: "I'm getting this error when trying to use JWT for token verification:",
    timestamp: new Date("2025-05-16T10:34:00"),
    isCode: false
  },
  {
    id: "4",
    sender: "Jane Cooper",
    content: "TypeError: authClient.verifyIdToken is not a function\n  at verifyToken (/app/middleware/auth.js:12:23)\n  at processTicksAndRejections (node:internal/process/task_queues:95:5)",
    timestamp: new Date("2025-05-16T10:34:30"),
    isCode: true,
    language: "javascript"
  },
  {
    id: "5",
    sender: "Sam Wilson",
    content: "I had a similar issue. Check your import statement. You might be importing the wrong module or missing something.",
    timestamp: new Date("2025-05-16T10:36:00"),
    isCode: false
  },
  {
    id: "6",
    sender: "Sam Wilson",
    content: "Try changing your import like this:",
    timestamp: new Date("2025-05-16T10:37:00"),
    isCode: false
  },
  {
    id: "7",
    sender: "Sam Wilson",
    content: "// Before\nimport { auth } from 'firebase-admin';\n\n// After\nimport * as admin from 'firebase-admin';\nconst auth = admin.auth();",
    timestamp: new Date("2025-05-16T10:37:30"),
    isCode: true,
    language: "javascript"
  },
];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [codeSnippets, setCodeSnippets] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Filter out code snippets from messages
    const snippets = messages.filter(msg => msg.isCode);
    setCodeSnippets(snippets);
  }, [messages]);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (content: string, isCode: boolean, language?: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      sender: "You", // In a real app, this would be the current user
      content,
      timestamp: new Date(),
      isCode,
      language
    };
    
    setMessages([...messages, newMessage]);
  };

  const handleSidebarOpenChange = (open: boolean) => {
    setSidebarOpen(open);
  };

  return (
    <Layout showFooter={false}>
      <div className="flex h-[calc(100vh-3.5rem)]">
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarOpen ? "pr-0 md:pr-80" : "pr-0"
        )}>
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-4xl mx-auto">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isCurrentUser={message.sender === "You"}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="border-t">
            <div className="max-w-4xl mx-auto">
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </div>
        </div>
        
        <CodeSidebar 
          codeSnippets={codeSnippets} 
          onOpenChange={handleSidebarOpenChange}
        />
      </div>
    </Layout>
  );
};

export default Chat;
