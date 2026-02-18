import { Users, Target, Lightbulb, Code, Brain, Zap } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const team = [
  {
    name: 'AI Vision System',
    role: 'Core Technology',
    icon: Brain,
    description: 'Powered by state-of-the-art multimodal AI for accurate fashion understanding.',
  },
  {
    name: 'Deep Learning',
    role: 'Pattern Recognition',
    icon: Lightbulb,
    description: 'Neural networks trained on millions of fashion images for precise classification.',
  },
  {
    name: 'Cloud Infrastructure',
    role: 'Scalable Processing',
    icon: Zap,
    description: 'Serverless architecture ensuring fast, reliable analysis at any scale.',
  },
];

const About = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 container max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">About the Project</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="text-gradient">Revolutionizing</span>
            <br />
            <span className="text-foreground">Fashion AI</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            ApparelAI is a cutting-edge project that leverages advanced artificial intelligence 
            to automatically generate accurate, detailed captions for clothing and fashion items.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 border-y border-border/50 bg-card/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
                <Target className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-medium text-accent">Our Mission</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Making Fashion <span className="text-gradient">Accessible</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Our mission is to bridge the gap between visual fashion content and textual 
                  understanding, making clothing information accessible to everyone.
                </p>
                <p>
                  Whether you're an e-commerce platform needing automated product descriptions, 
                  a visually impaired user seeking clothing details, or a researcher studying 
                  fashion trends – ApparelAI provides accurate, consistent, and comprehensive 
                  fashion captions.
                </p>
                <p>
                  We believe AI should enhance human capability, not replace it. Our technology 
                  empowers users to work faster and smarter with fashion imagery.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-3xl opacity-20" />
              <div className="relative bg-gradient-card rounded-2xl border border-border/50 p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                      <Code className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold">Open Technology</h3>
                      <p className="text-muted-foreground text-sm">Built with modern, accessible tech</p>
                    </div>
                  </div>
                  <div className="h-px bg-border/50" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-xl bg-secondary/30">
                      <div className="font-display text-2xl font-bold text-gradient">React</div>
                      <div className="text-muted-foreground text-xs">Frontend</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-secondary/30">
                      <div className="font-display text-2xl font-bold text-gradient">AI Cloud</div>
                      <div className="text-muted-foreground text-xs">Backend</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-secondary/30">
                      <div className="font-display text-2xl font-bold">Gemini</div>
                      <div className="text-muted-foreground text-xs">Vision AI</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-secondary/30">
                      <div className="font-display text-2xl font-bold">TypeScript</div>
                      <div className="text-muted-foreground text-xs">Language</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient">Technology</span>
              <span className="text-foreground"> Stack</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Built with cutting-edge AI and modern web technologies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-gradient-card border border-border/50 hover:border-primary/30 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-glow">
                  <member.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-primary text-sm mb-4">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-y border-border/50 bg-card/30">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                step: '01',
                title: 'Upload Your Image or Video',
                description: 'Drag and drop any fashion image or paste a URL. Our system accepts all common formats.',
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our multimodal AI examines colors, patterns, styles, materials, and clothing categories.',
              },
              {
                step: '03',
                title: 'Caption Generation',
                description: 'Receive detailed, natural language descriptions including style recommendations and occasions.',
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center font-display font-bold text-xl text-primary-foreground shadow-glow">
                  {item.step}
                </div>
                <div className="pt-2">
                  <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Ready to <span className="text-gradient">Try It?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Experience the power of AI-driven fashion captioning today.
          </p>
          <Link to="/caption">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow text-lg px-10 py-6">
              Start Captioning Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 bg-card/30">
        <div className="container max-w-6xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 ApparelAI. Built with passion for fashion technology.</p>
        </div>
      </footer>
    </main>
  );
};

export default About;
