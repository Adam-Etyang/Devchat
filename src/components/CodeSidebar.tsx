
import { useState, useEffect } from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Code, X, ChevronRight, ChevronLeft, Calendar, User } from "lucide-react";
import { Message } from "@/components/ChatMessage";
import CodeBlock from "@/components/CodeBlock";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface CodeSidebarProps {
  codeSnippets: Message[];
  onOpenChange?: (open: boolean) => void;
}

const CodeSidebar = ({ codeSnippets, onOpenChange }: CodeSidebarProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [selectedSnippet, setSelectedSnippet] = useState<Message | null>(null);
  const [open, setOpen] = useState(true);

  const handleSnippetClick = (snippet: Message) => {
    setSelectedSnippet(snippet);
  };

  const clearSelected = () => {
    setSelectedSnippet(null);
  };

  // Close sidebar when there are no code snippets
  useEffect(() => {
    if (codeSnippets.length === 0 && open) {
      setOpen(false);
    }
  }, [codeSnippets]);

  // Notify parent component about open state changes
  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  if (!open) {
    return (
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-10 animate-slide-in-right">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={() => setOpen(true)} 
              variant="secondary" 
              size="icon" 
              className="shadow-xl rounded-full h-12 w-12 bg-primary/10 hover:bg-primary/20 border border-primary/20 backdrop-blur-sm transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="h-5 w-5 text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-primary text-primary-foreground">
            Open Code Snippets ({codeSnippets.length})
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <Sidebar 
      className={cn(
        "fixed right-0 top-[3.5rem] bottom-0 border-l transition-all duration-500 ease-out shadow-2xl animate-slide-in-right bg-gradient-to-b from-sidebar to-sidebar/95 backdrop-blur-md z-10",
        isCollapsed ? "w-16" : "w-96"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-sidebar/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Code className="h-5 w-5 text-primary" />
          </div>
          {!isCollapsed && (
            <div>
              <span className="font-semibold text-sidebar-foreground">Code Snippets</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {codeSnippets.length} snippets
                </Badge>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
                onClick={() => setOpen(false)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Close sidebar</TooltipContent>
          </Tooltip>
          <SidebarTrigger className="h-8 w-8" />
        </div>
      </div>

      <SidebarContent className="bg-gradient-to-b from-transparent to-sidebar/20">
        {selectedSnippet ? (
          <div className="p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                {!isCollapsed && (
                  <h3 className="font-semibold text-sidebar-foreground">
                    {selectedSnippet.sender}
                  </h3>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={clearSelected} 
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {!isCollapsed && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(selectedSnippet.timestamp).toLocaleDateString()} at {' '}
                  {new Date(selectedSnippet.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
                {selectedSnippet.language && (
                  <Badge variant="outline" className="text-xs">
                    {selectedSnippet.language}
                  </Badge>
                )}
              </div>
            )}
            
            <div className="rounded-lg overflow-hidden border border-border/50 shadow-lg">
              <CodeBlock 
                code={selectedSnippet.content}
                language={selectedSnippet.language}
              />
            </div>
          </div>
        ) : (
          <SidebarGroup className="p-0">
            {!isCollapsed && (
              <SidebarGroupLabel className="text-sm font-semibold text-sidebar-foreground px-4 py-3 bg-sidebar/50">
                Recent Code
              </SidebarGroupLabel>
            )}
            
            <SidebarGroupContent>
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <SidebarMenu className="p-2">
                  {codeSnippets.length > 0 ? (
                    codeSnippets.map((snippet, index) => (
                      <SidebarMenuItem key={snippet.id} className="mb-2">
                        <SidebarMenuButton
                          onClick={() => handleSnippetClick(snippet)}
                          className={cn(
                            "w-full flex items-start p-3 hover:bg-sidebar-accent/50 rounded-lg transition-all duration-200 hover:shadow-md border border-transparent hover:border-primary/20 group",
                            !isCollapsed && "min-h-[4rem]"
                          )}
                        >
                          <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Code className="h-4 w-4 text-primary flex-shrink-0" />
                          </div>
                          {!isCollapsed && (
                            <div className="flex flex-col overflow-hidden w-full ml-3">
                              <div className="flex justify-between items-start w-full mb-1">
                                <span className="truncate text-sm font-medium text-sidebar-foreground">
                                  {snippet.sender}
                                </span>
                                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                                  {new Date(snippet.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                {snippet.language && (
                                  <Badge variant="outline" className="text-xs">
                                    {snippet.language}
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  Snippet #{codeSnippets.length - index}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground bg-sidebar-accent/30 p-2 rounded border-l-2 border-primary/30">
                                {snippet.content.substring(0, 60)}
                                {snippet.content.length > 60 && "..."}
                              </div>
                            </div>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))
                  ) : (
                    <div className="px-4 py-12 text-center animate-fade-in">
                      <div className="p-4 rounded-full bg-muted/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Code className="h-8 w-8 text-muted-foreground" />
                      </div>
                      {!isCollapsed && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">No code snippets yet</p>
                          <p className="text-xs text-muted-foreground">
                            Share some code in the chat to see it here
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </SidebarMenu>
              </ScrollArea>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default CodeSidebar;
