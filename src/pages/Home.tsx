import { Link } from 'react-router-dom';
import { Sparkles, Zap, Eye, Video, ArrowRight, Layers, Brain, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';

const features = [
  {
    icon: Eye,
    title: 'Intelligent Detection',
    description: 'Advanced AI recognizes clothing items, patterns, colors, and styles with remarkable accuracy.',
  },
  {
    icon: Layers,
    title: 'Detailed Analysis',
    description: 'Get comprehensive descriptions including fabric type, fit, occasion suitability, and more.',
  },
  {
    icon: Video,
    title: 'Video Processing',
    description: 'Analyze fashion in videos frame-by-frame for dynamic outfit tracking and recommendations.',
  },
  {
    icon: Brain,
    title: 'Smart Captions',
    description: 'Generate natural language descriptions perfect for e-commerce and accessibility.',
  },
];

const stats = [
  { value: '99%', label: 'Accuracy Rate' },
  { value: '50+', label: 'Clothing Categories' },
  { value: '<2s', label: 'Analysis Speed' },
  { value: '1M+', label: 'Images Processed' },
];

const Home = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[150px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />

        <div className="relative z-10 container max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary animate-pulse-glow" />
            <span className="text-sm font-medium text-primary">Next-Gen Fashion AI Technology</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="text-gradient">Transform</span>
            <br />
            <span className="text-foreground">Fashion with AI</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Revolutionary apparel captioning powered by advanced machine learning. 
            Upload any clothing image or video and get instant, accurate descriptions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/caption">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow text-lg px-8 py-6 gap-2">
                Start Captioning
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/dataset">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-border/50 hover:bg-secondary/50">
                Explore Dataset
              </Button>
            </Link>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="relative mx-auto max-w-4xl">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-3xl opacity-20" />
              <div className="relative bg-gradient-card rounded-2xl border border-border/50 p-2 shadow-card">
                <div className="bg-card rounded-xl p-8 flex items-center justify-center min-h-[300px]">
                  <div className="flex items-center gap-8">
                    <div className="w-40 h-48 rounded-xl bg-secondary/50 flex items-center justify-center border border-border/50">
                      <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow">
                        <Zap className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">AI Processing</span>
                    </div>
                    <div className="w-64 space-y-3">
                      <div className="h-4 bg-secondary/50 rounded-full w-full" />
                      <div className="h-4 bg-secondary/50 rounded-full w-4/5" />
                      <div className="h-4 bg-secondary/50 rounded-full w-3/5" />
                      <div className="flex gap-2 mt-4">
                        <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">Dress</span>
                        <span className="px-3 py-1 bg-accent/20 text-accent text-xs rounded-full">Floral</span>
                        <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">Summer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-border/50 bg-card/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Powerful</span>
              <span className="text-foreground"> Features</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              State-of-the-art AI capabilities designed for fashion analysis and captioning
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-gradient-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glow"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative z-10 container max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Ready to <span className="text-gradient">Transform</span> Your Workflow?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Start generating accurate apparel captions in seconds. No setup required.
          </p>
          <Link to="/caption">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow text-lg px-10 py-6 gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 bg-card/30">
        <div className="container max-w-6xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 ApparelAI. Powered by advanced AI vision technology.</p>
        </div>
      </footer>
    </main>
  );
};

export default Home;
