import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Calendar, Shield, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-background overflow-hidden flex flex-col">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black_70%,transparent_100%)] opacity-20" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/40 backdrop-blur-sm sticky top-0 bg-background/80 supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2" onClick={() => navigate('/')}>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-pointer">
                MediKora
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button onClick={() => navigate('/login?mode=register')} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 flex-1 flex flex-col justify-center py-20 lg:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-8">

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-secondary rounded-full animate-fade-in backdrop-blur-sm mx-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="text-sm font-medium text-muted-foreground">The New Standard in Hospital Management</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-[1.1] animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Simplify Appointments. <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-300% animate-gradient">
              Amplify Care.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            A powerful schedule management system designed for modern hospitals.
            Streamline operations, reduce waiting times, and focus on what matters most—patients.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button size="xl" onClick={() => navigate('/login?mode=register')} className="h-14 px-8 text-lg rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all hover:-translate-y-1 shadow-xl">
              Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl" onClick={() => navigate('/login')} className="h-14 px-8 text-lg rounded-full border-2 hover:bg-secondary/50 backdrop-blur-sm transition-all">
              Live Demo
            </Button>
          </div>

          {/* Social Proof / Trust Indicators */}
          <div className="pt-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">Trusted by Healthcare Providers</p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholders for partner logos or icons - using simple text for cleanliness if no logos available, or lucide icons */}
              <div className="flex items-center gap-2 text-foreground font-semibold"><Shield className="w-5 h-5" /> HealthCare+</div>
              <div className="flex items-center gap-2 text-foreground font-semibold"><ActivityIcon className="w-5 h-5" /> MediPlus</div>
              <div className="flex items-center gap-2 text-foreground font-semibold"><HeartPulseIcon className="w-5 h-5" /> CareLine</div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto">
          {[
            {
              icon: Calendar,
              title: 'Smart Scheduling',
              desc: 'Intelligent algorithms to manage doctor availability and prevent double bookings automatically.'
            },
            {
              icon: Users,
              title: 'Team Management',
              desc: 'Effortlessly organize departments, assign doctors, and manage staff permissions from one hub.'
            },
            {
              icon: Clock,
              title: 'Real-time Sync',
              desc: 'Instant updates across all devices ensure everyone stays on the same page, always.'
            },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="group p-8 rounded-3xl bg-card/50 border border-border/50 hover:border-primary/20 hover:bg-card/80 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 backdrop-blur-sm text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary/10">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ActivityIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}

function HeartPulseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M12 5 9.04 20" />
      <path d="M8.78 15.19 12 19l6.59-7.7" />
    </svg>
  )
}
