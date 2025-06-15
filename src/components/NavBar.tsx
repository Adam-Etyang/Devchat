
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import UserProfile from "./UserProfile";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <NavLink 
            to="/" 
            className="flex items-center space-x-2 font-bold"
            onClick={() => setIsOpen(false)}
          >
            <Code className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline-block">DevChat</span>
          </NavLink>
        </div>

        {isMobile ? (
          <div className="flex flex-1 items-center justify-end">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Menu"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "h-6 w-6 transition-all",
                  isOpen ? "rotate-90" : ""
                )}
              >
                {isOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </>
                )}
              </svg>
            </Button>
          </div>
        ) : (
          <nav className="flex flex-1 items-center justify-between">
            <div className="flex items-center space-x-2">
              <NavLink 
                to="/chat" 
                className={({isActive}) => 
                  cn("nav-link flex items-center gap-2", isActive && "active")
                }
              >
                <MessageSquare className="h-4 w-4" />
                Chat
              </NavLink>
            </div>
            <div className="flex items-center space-x-2">
              <NavLink 
                to="/settings" 
                className={({isActive}) => 
                  cn("nav-link flex items-center gap-2", isActive && "active")
                }
              >
                <Settings className="h-4 w-4" />
                Settings
              </NavLink>
              <div className="ml-4 flex gap-2">
                {isAuthenticated ? (
                  <UserProfile />
                ) : (
                  <>
                    <NavLink to="/signin">
                      <Button variant="ghost">Sign In</Button>
                    </NavLink>
                    <NavLink to="/signup">
                      <Button>Sign Up</Button>
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && isOpen && (
        <div className="container animate-fade-in py-4">
          <nav className="flex flex-col space-y-4">
            <NavLink 
              to="/chat" 
              className={({isActive}) => 
                cn("nav-link flex items-center gap-2", isActive && "active")
              }
              onClick={() => setIsOpen(false)}
            >
              <MessageSquare className="h-4 w-4" />
              Chat
            </NavLink>
            <NavLink 
              to="/settings" 
              className={({isActive}) => 
                cn("nav-link flex items-center gap-2", isActive && "active")
              }
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </NavLink>
            <div className="pt-2 flex flex-col gap-2">
              {isAuthenticated ? (
                <UserProfile />
              ) : (
                <>
                  <NavLink to="/signin" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full">Sign In</Button>
                  </NavLink>
                  <NavLink to="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </NavLink>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
