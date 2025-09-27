import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Satellite, Shield, Brain, Globe, ArrowRight, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 text-primary border-primary/50">
            National Space Hackathon 2025 - Supernova x World Space Week
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Advanced Satellite Tracking &<br />
            <span className="text-primary">Space Domain Awareness</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Real-time satellite monitoring, AI-powered threat analysis, and automated collision 
            avoidance for UAE space assets. Built for the future of space security.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="text-lg px-8">
                <Satellite className="mr-2 h-5 w-5" />
                Launch Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Target className="mr-2 h-5 w-5" />
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Phase Overview */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Implementation Phases</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Phase 1 */}
            <Card className="border-2 border-green-500/50 bg-green-500/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Phase 1 - Core System</span>
                  <Badge className="bg-green-500/20 text-green-400">Completed</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <Satellite className="h-4 w-4 text-green-500" />
                    <span>Real-time satellite data ingestion from CelesTrak</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-green-500" />
                    <span>3D orbital visualization with React Three Fiber</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Professional mission control dashboard</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-green-500" />
                    <span>Advanced orbital mechanics calculations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Phase 2 */}
            <Card className="border-2 border-yellow-500/50 bg-yellow-500/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Phase 2 - AI Enhancement</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400">Implemented</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-yellow-500" />
                    <span>Perplexity AI integration for threat analysis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>Emergency alert system with automated protocols</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-yellow-500" />
                    <span>UAE-specific satellite monitoring dashboard</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-yellow-500" />
                    <span>Real-time collision probability calculations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Phase 3 */}
            <Card className="border-2 border-blue-500/50 bg-blue-500/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Phase 3 - Production Ready</span>
                  <Badge className="bg-blue-500/20 text-blue-400">Planned</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span>Integration with USSPACECOM datasets</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Satellite className="h-4 w-4 text-blue-500" />
                    <span>Mobile app for field operations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-blue-500" />
                    <span>API for third-party satellite operators</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <span>Multi-language support (Arabic/English)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="px-6 py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">System Capabilities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Satellite className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Real-time Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Live monitoring of 1,247+ satellites and space debris objects
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">AI Threat Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Intelligent risk assessment using Perplexity AI integration
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Collision Avoidance</h3>
                <p className="text-sm text-muted-foreground">
                  Automated maneuver recommendations and emergency protocols
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">UAE Assets Focus</h3>
                <p className="text-sm text-muted-foreground">
                  Specialized monitoring for UAE satellite constellation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Experience the Future of Space Domain Awareness</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Built for the National Space Hackathon 2025, showcasing cutting-edge technology 
            for satellite tracking and space security.
          </p>
          
          <Link to="/dashboard">
            <Button size="lg" className="text-lg px-12">
              <Zap className="mr-2 h-5 w-5" />
              Launch System
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
