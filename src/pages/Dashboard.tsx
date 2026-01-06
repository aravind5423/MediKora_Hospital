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
    { label: 'Departments', value: departments.length, icon: Building2, color: 'text-primary' },
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
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'success' ? 'bg-success' :
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

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Departments Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments.map((dept) => {
                  const deptDoctors = doctors.filter(d => d.departmentId === dept.id);
                  return (
                    <div key={dept.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <p className="font-medium text-foreground">{dept.name}</p>
                        <p className="text-sm text-muted-foreground">{dept.description}</p>
                      </div>
                      <Badge variant="secondary">
                        {deptDoctors.length} Doctor{deptDoctors.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  );
                })}
                {departments.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">
                    No departments added yet
                  </p>
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
                      className={`p-3 rounded-xl text-center text-sm font-medium ${
                        slot.status === 'AVAILABLE'
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
