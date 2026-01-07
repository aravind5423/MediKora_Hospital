import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useHospitalData } from '@/contexts/HospitalDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Users, CalendarDays, Clock, TrendingUp, Activity } from 'lucide-react';

export default function Dashboard() {
  const { departments, doctors, timeSlots } = useHospitalData();
  const { hospital } = useAuth();

  const availableSlots = timeSlots.filter(s => s.status === 'AVAILABLE').length;
  const bookedSlots = timeSlots.filter(s => s.status === 'BOOKED').length;
  const todaySlots = timeSlots.filter(s => s.date === new Date().toISOString().split('T')[0]).length;

  const stats = [
    { label: 'Doctors', value: doctors.length, icon: Users, color: 'text-accent' },
    { label: 'Available Slots', value: availableSlots, icon: CalendarDays, color: 'text-success' },
    { label: 'Booked Today', value: bookedSlots, icon: Clock, color: 'text-warning' },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {hospital?.name || 'Hospital'}
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your appointment management system
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} variant="interactive" className="animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-secondary ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'New slot created', time: '2 mins ago', type: 'success' },
                  { action: 'Dr. Sarah updated schedule', time: '15 mins ago', type: 'info' },
                  { action: 'Patient booked appointment', time: '1 hour ago', type: 'warning' },
                  { action: 'Department added', time: '3 hours ago', type: 'success' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${activity.type === 'success' ? 'bg-success' :
                        activity.type === 'warning' ? 'bg-warning' : 'bg-primary'
                        }`} />
                      <span className="text-foreground">{activity.action}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeSlots
                  .filter(s => s.status === 'BOOKED')
                  .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime())
                  .slice(0, 5)
                  .map((slot) => {
                    const doctor = doctors.find(d => d.id === slot.doctorId);
                    return (
                      <div key={slot.id} className="flex items-center justify-between py-3 border-b last:border-0 hover:bg-muted/50 transition-colors rounded-lg px-2 -mx-2">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {slot.patientName?.[0] || 'P'}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{slot.patientName || 'Unknown Patient'}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              {doctor?.name || 'Unknown Doctor'}
                              <span className="w-1 h-1 rounded-full bg-border" />
                              {slot.appointmentType || 'In-person'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-foreground">
                            {slot.startTime}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(slot.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {timeSlots.filter(s => s.status === 'BOOKED').length === 0 && (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                      <CalendarDays className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-foreground font-medium">No upcoming appointments</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Share your booking link to start receiving appointments.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Slots */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              Today's Appointment Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaySlots > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {timeSlots
                  .filter(s => s.date === new Date().toISOString().split('T')[0])
                  .slice(0, 12)
                  .map((slot) => (
                    <div
                      key={slot.id}
                      className={`p-3 rounded-xl text-center text-sm font-medium ${slot.status === 'AVAILABLE'
                        ? 'bg-success/10 text-success border border-success/20'
                        : slot.status === 'BOOKED'
                          ? 'bg-warning/10 text-warning border border-warning/20'
                          : 'bg-muted text-muted-foreground border border-border'
                        }`}
                    >
                      {slot.startTime} - {slot.endTime}
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No slots scheduled for today. Create slots from the Manage Slots section.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
