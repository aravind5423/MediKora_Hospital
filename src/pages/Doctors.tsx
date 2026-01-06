import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useHospitalData } from '@/contexts/HospitalDataContext';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Pencil, Trash2, Clock, Mail, Phone, CalendarPlus, Calendar, Ban, CheckCircle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function Doctors() {
  const { doctors, departments, timeSlots, addDoctor, updateDoctor, deleteDoctor, generateSlots, updateTimeSlot, deleteTimeSlot } = useHospitalData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSlotDialogOpen, setIsSlotDialogOpen] = useState(false);
  const [selectedDoctorForSlots, setSelectedDoctorForSlots] = useState<string | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<string | null>(null);
  const [slotFilterDoctor, setSlotFilterDoctor] = useState<string>('all');
  const [slotFilterDate, setSlotFilterDate] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    departmentId: '',
    consultationDuration: 15,
  });
  const [slotFormData, setSlotFormData] = useState({
    date: '',
    startTime: '09:00',
    endTime: '17:00',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoctor) {
      updateDoctor(editingDoctor, formData);
      toast({ title: 'Doctor updated successfully' });
    } else {
      addDoctor({ ...formData, hospitalId: '1' });
      toast({ title: 'Doctor added successfully' });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialization: '',
      departmentId: '',
      consultationDuration: 15,
    });
    setEditingDoctor(null);
  };

  const handleEdit = (doctor: typeof doctors[0]) => {
    setEditingDoctor(doctor.id);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      specialization: doctor.specialization,
      departmentId: doctor.departmentId,
      consultationDuration: doctor.consultationDuration,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteDoctor(id);
    toast({ title: 'Doctor removed', variant: 'destructive' });
  };

  const handleOpenSlotDialog = (doctorId: string) => {
    setSelectedDoctorForSlots(doctorId);
    setSlotFormData({
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
    });
    setIsSlotDialogOpen(true);
  };

  const handleCreateSlots = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorForSlots) return;
    
    const doctor = doctors.find(d => d.id === selectedDoctorForSlots);
    if (!doctor) return;

    generateSlots(
      selectedDoctorForSlots,
      slotFormData.date,
      slotFormData.startTime,
      slotFormData.endTime,
      doctor.consultationDuration
    );

    toast({ 
      title: 'Slots created successfully',
      description: `Time slots generated for ${doctor.name} on ${slotFormData.date}`,
    });
    setIsSlotDialogOpen(false);
  };

  const handleBlockSlot = (slotId: string) => {
    updateTimeSlot(slotId, { status: 'BLOCKED' });
    toast({ title: 'Slot blocked' });
  };

  const handleUnblockSlot = (slotId: string) => {
    updateTimeSlot(slotId, { status: 'AVAILABLE' });
    toast({ title: 'Slot unblocked' });
  };

  const handleDeleteSlot = (slotId: string) => {
    deleteTimeSlot(slotId);
    toast({ title: 'Slot deleted', variant: 'destructive' });
  };

  const getDepartmentName = (id: string) => {
    return departments.find(d => d.id === id)?.name || 'General';
  };

  const getDoctorName = (id: string) => {
    return doctors.find(d => d.id === id)?.name || 'Unknown';
  };

  const getUpcomingSlotCount = (doctorId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return timeSlots.filter(s => s.doctorId === doctorId && s.date >= today && s.status === 'AVAILABLE').length;
  };

  const filteredSlots = timeSlots.filter(slot => {
    const matchesDoctor = slotFilterDoctor === 'all' || slot.doctorId === slotFilterDoctor;
    const matchesDate = !slotFilterDate || slot.date === slotFilterDate;
    return matchesDoctor && matchesDate;
  }).sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  const groupedSlots = filteredSlots.reduce((acc, slot) => {
    const key = `${slot.date}-${slot.doctorId}`;
    if (!acc[key]) {
      acc[key] = {
        date: slot.date,
        doctorId: slot.doctorId,
        slots: []
      };
    }
    acc[key].slots.push(slot);
    return acc;
  }, {} as Record<string, { date: string; doctorId: string; slots: typeof timeSlots }>);

  const selectedDoctor = selectedDoctorForSlots ? doctors.find(d => d.id === selectedDoctorForSlots) : null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Available</Badge>;
      case 'BOOKED':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Booked</Badge>;
      case 'BLOCKED':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Blocked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Doctors & Slots</h1>
            <p className="text-muted-foreground">Manage doctors and their appointment slots</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Doctor
          </Button>
        </div>

        <Tabs defaultValue="doctors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="slots">Manage Slots ({timeSlots.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="doctors">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <Card key={doctor.id} variant="interactive" className="animate-slide-up">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-lg">
                          {doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{doctor.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(doctor)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(doctor.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge variant="outline">{getDepartmentName(doctor.departmentId)}</Badge>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span>{doctor.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>{doctor.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{doctor.consultationDuration} min per consultation</span>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="font-medium">{getUpcomingSlotCount(doctor.id)} available slots</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleOpenSlotDialog(doctor.id)}
                        >
                          <CalendarPlus className="w-4 h-4 mr-2" />
                          Create Slots
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {doctors.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No doctors yet</h3>
                    <p className="text-muted-foreground mb-4">Add your first doctor to get started</p>
                    <Button onClick={() => setIsDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Doctor
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="slots">
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4">
                  <div className="space-y-2 min-w-[200px]">
                    <Label>Filter by Doctor</Label>
                    <Select value={slotFilterDoctor} onValueChange={setSlotFilterDoctor}>
                      <SelectTrigger>
                        <SelectValue placeholder="All doctors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Doctors</SelectItem>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 min-w-[200px]">
                    <Label>Filter by Date</Label>
                    <Input
                      type="date"
                      value={slotFilterDate}
                      onChange={(e) => setSlotFilterDate(e.target.value)}
                    />
                  </div>
                  {(slotFilterDoctor !== 'all' || slotFilterDate) && (
                    <div className="flex items-end">
                      <Button 
                        variant="ghost" 
                        onClick={() => { setSlotFilterDoctor('all'); setSlotFilterDate(''); }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Slots List */}
            {Object.values(groupedSlots).length > 0 ? (
              <div className="space-y-6">
                {Object.values(groupedSlots).map((group) => (
                  <Card key={`${group.date}-${group.doctorId}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{getDoctorName(group.doctorId)}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {new Date(group.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <Badge variant="outline">{group.slots.length} slots</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {group.slots.map((slot) => (
                          <div 
                            key={slot.id} 
                            className={`p-3 rounded-lg border text-center transition-all ${
                              slot.status === 'BLOCKED' 
                                ? 'bg-red-500/5 border-red-500/20' 
                                : slot.status === 'BOOKED'
                                ? 'bg-blue-500/5 border-blue-500/20'
                                : 'bg-secondary/50 border-border hover:border-primary/50'
                            }`}
                          >
                            <p className="font-medium text-sm mb-1">
                              {slot.startTime} - {slot.endTime}
                            </p>
                            <div className="mb-2">
                              {getStatusBadge(slot.status)}
                            </div>
                            <div className="flex gap-1 justify-center">
                              {slot.status === 'AVAILABLE' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-7 px-2"
                                  onClick={() => handleBlockSlot(slot.id)}
                                >
                                  <Ban className="w-3 h-3" />
                                </Button>
                              )}
                              {slot.status === 'BLOCKED' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-7 px-2"
                                  onClick={() => handleUnblockSlot(slot.id)}
                                >
                                  <CheckCircle className="w-3 h-3" />
                                </Button>
                              )}
                              {slot.status !== 'BOOKED' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-7 px-2 text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteSlot(slot.id)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No slots found</h3>
                  <p className="text-muted-foreground mb-4">
                    {timeSlots.length === 0 
                      ? "Create slots for doctors from the Doctors tab" 
                      : "No slots match your current filters"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Doctor Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
              <DialogDescription>
                {editingDoctor ? 'Update doctor details' : 'Add a new doctor to your hospital'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. John Smith"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="doctor@hospital.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="Cardiologist"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.departmentId}
                    onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Consultation Duration (minutes) *</Label>
                  <Select
                    value={formData.consultationDuration.toString()}
                    onValueChange={(value) => setFormData({ ...formData, consultationDuration: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="20">20 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDoctor ? 'Update' : 'Add'} Doctor
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Slot Creation Dialog */}
        <Dialog open={isSlotDialogOpen} onOpenChange={setIsSlotDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Appointment Slots</DialogTitle>
              <DialogDescription>
                {selectedDoctor && (
                  <>Create time slots for <strong>{selectedDoctor.name}</strong> ({selectedDoctor.consultationDuration} min each)</>
                )}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSlots}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="slotDate">Date *</Label>
                  <Input
                    id="slotDate"
                    type="date"
                    value={slotFormData.date}
                    onChange={(e) => setSlotFormData({ ...slotFormData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={slotFormData.startTime}
                      onChange={(e) => setSlotFormData({ ...slotFormData, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={slotFormData.endTime}
                      onChange={(e) => setSlotFormData({ ...slotFormData, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>
                {selectedDoctor && (
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      Slots will be auto-generated based on <strong>{selectedDoctor.consultationDuration} minute</strong> consultation duration.
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsSlotDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <CalendarPlus className="w-4 h-4 mr-2" />
                  Generate Slots
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
