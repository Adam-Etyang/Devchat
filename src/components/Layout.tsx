
import { ReactNode } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { SidebarProvider } from "@/components/ui/sidebar";

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const Layout = ({ children, showFooter = true }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <NavBar />
        <main className="flex-1">
          {children}
        </main>
        {showFooter && <Footer />}
      </div>
    </SidebarProvider>
  );
};

export default Layout;
