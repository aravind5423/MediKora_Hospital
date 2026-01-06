import { Hero } from '@/components/landing/Hero';

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Manage Appointments
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From registration to slot management, we've got you covered with a complete solution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { step: '01', title: 'Register', desc: 'Sign up your hospital with basic details' },
              { step: '02', title: 'Setup Profile', desc: 'Add departments, doctors, and timings' },
              { step: '03', title: 'Create Slots', desc: 'Generate appointment slots automatically' },
              { step: '04', title: 'Accept Bookings', desc: 'Patients book, you manage everything' },
            ].map((item, i) => (
              <div key={item.step} className="relative group">
                <div className="text-6xl font-bold text-primary/10 mb-4 group-hover:text-primary/20 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-8 right-0 w-16 h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-navy text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Hospital?
          </h2>
          <p className="text-lg opacity-80 mb-10 max-w-xl mx-auto">
            Join hundreds of hospitals already using MediKora to streamline their appointment management.
          </p>
          <a
            href="/login?mode=register"
            className="inline-flex items-center justify-center gap-2 h-14 px-10 text-lg font-semibold rounded-xl bg-primary-foreground text-navy hover:bg-primary-foreground/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
