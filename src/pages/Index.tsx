
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Code, Users, Settings } from "lucide-react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <Layout>
      <section className="py-20 px-4 md:px-6">
        <div className="container">
          <div className="flex flex-col items-center text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary/80 via-primary to-purple-400 text-transparent bg-clip-text pb-2">
                Code Together, Build Better
              </h1>
              <p className="mt-4 text-xl md:text-2xl text-muted-foreground max-w-2xl">
                A collaborative platform for developers to share, discuss, and iterate on code in real time
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/chat">
                  <Button size="lg" className="gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Start Collaborating
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 px-4 md:px-6 bg-secondary/30">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything you need to collaborate
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Real-time Chat</h3>
                <p className="text-muted-foreground">
                  Communicate seamlessly with team members while working on projects together
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Code Sharing</h3>
                <p className="text-muted-foreground">
                  Share and discuss code snippets with syntax highlighting for all major languages
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
                <p className="text-muted-foreground">
                  Create shared workspaces for your team to store, organize and reference important code
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="py-20 px-4 md:px-6">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Designed for Developers, Built by Developers
              </h2>
              <p className="text-muted-foreground mb-6">
                DevChat combines the best parts of chat platforms and coding tools into one seamless experience.
                Share code snippets, get feedback, and solve problems together.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="mr-2 h-5 w-5 text-primary">✓</div>
                  <span>Syntax highlighting for 40+ programming languages</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-5 w-5 text-primary">✓</div>
                  <span>Organize code snippets in the sidebar</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-5 w-5 text-primary">✓</div>
                  <span>Customize your experience with settings</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link to="/chat">
                  <Button>Get Started</Button>
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <div className="rounded-lg border-2 border-border overflow-hidden">
                <div className="bg-secondary/30 p-4 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-muted-foreground">DevChat</div>
                  <div></div>
                </div>
                <div className="p-4 bg-code text-code-foreground font-mono text-sm">
                  <div className="text-blue-400">// Example of DevChat in action</div>
                  <div className="mt-2">
                    <span className="text-pink-400">function</span>{" "}
                    <span className="text-yellow-400">calculateTotal</span>(
                    <span className="text-orange-400">items</span>) {"{"}
                  </div>
                  <div className="ml-4">
                    <span className="text-pink-400">return</span> items.
                    <span className="text-yellow-400">reduce</span>((
                    <span className="text-orange-400">total, item</span>) =&gt; {"{"}
                  </div>
                  <div className="ml-8">
                    <span className="text-pink-400">return</span> total + item.price * item.quantity;
                  </div>
                  <div className="ml-4">{"}"}, 0);</div>
                  <div>{"}"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 px-4 md:px-6 bg-primary/5">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to start collaborating?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of developers who are building better software together
          </p>
          <Link to="/chat">
            <Button size="lg" className="animate-pulse">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
