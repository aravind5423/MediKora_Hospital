import { Hero } from '@/components/landing/Hero';

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />

      {/* Features Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] [mask-image:linear-gradient(0deg,transparent,black)]" />

        <div className="container relative mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Everything You Need to <br />
              <span className="text-primary">Manage Appointments</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From registration to slot management, we've got you covered with a complete, automated solution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              { step: '01', title: 'Register', desc: 'Sign up your hospital with basic details in seconds.' },
              { step: '02', title: 'Setup Profile', desc: 'Add departments, doctors, and operational timings.' },
              { step: '03', title: 'Create Slots', desc: 'Generate appointment slots automatically based on rules.' },
              { step: '04', title: 'Accept Bookings', desc: 'Patients book online, you manage everything from one dashboard.' },
            ].map((item, i) => (
              <div key={item.step} className="relative group p-6 rounded-3xl bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors duration-300">
                <div className="absolute -top-6 left-6 text-6xl font-black text-primary/5 group-hover:text-primary/10 transition-colors select-none font-sans">
                  {item.step}
                </div>
                <div className="relative pt-4">
                  <h3 className="text-xl font-bold text-foreground mb-3 leading-tight">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-12 -right-4 w-8 h-[2px] bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-navy overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-navy to-navy opacity-50" />
          <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent animate-spin-slow" />
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">
            Ready to Transform Your Hospital?
          </h2>
          <p className="text-xl text-primary-foreground/60 mb-12 max-w-xl mx-auto leading-relaxed">
            Join hundreds of hospitals already using MediKora to streamline their appointment management.
          </p>
          <a
            href="/login?mode=register"
            className="inline-flex items-center justify-center h-16 px-12 text-lg font-bold rounded-full bg-white text-navy hover:bg-white/90 transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
          >
            Get Started Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 MediKora. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
