import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Department, Doctor, TimeSlot, OPTiming } from '@/types/hospital';

interface HospitalDataContextType {
  departments: Department[];
  doctors: Doctor[];
  timeSlots: TimeSlot[];
  opTimings: OPTiming[];
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, data: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  updateDoctor: (id: string, data: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  addTimeSlot: (slot: Omit<TimeSlot, 'id'>) => void;
  updateTimeSlot: (id: string, data: Partial<TimeSlot>) => void;
  deleteTimeSlot: (id: string) => void;
  generateSlots: (doctorId: string, date: string, startTime: string, endTime: string, duration: number) => void;
}

const HospitalDataContext = createContext<HospitalDataContextType | undefined>(undefined);

export function HospitalDataProvider({ children }: { children: ReactNode }) {
  const [departments, setDepartments] = useState<Department[]>([
    { id: '1', name: 'Cardiology', description: 'Heart and cardiovascular care', hospitalId: '1' },
    { id: '2', name: 'Orthopedics', description: 'Bone and joint care', hospitalId: '1' },
    { id: '3', name: 'Pediatrics', description: 'Child healthcare', hospitalId: '1' },
  ]);

  const [doctors, setDoctors] = useState<Doctor[]>([
    { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah@hospital.com', phone: '+1234567890', specialization: 'Cardiologist', departmentId: '1', hospitalId: '1', consultationDuration: 15 },
    { id: '2', name: 'Dr. Michael Chen', email: 'michael@hospital.com', phone: '+1234567891', specialization: 'Orthopedic Surgeon', departmentId: '2', hospitalId: '1', consultationDuration: 20 },
  ]);

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [opTimings, setOpTimings] = useState<OPTiming[]>([]);

  const addDepartment = (dept: Omit<Department, 'id'>) => {
    setDepartments([...departments, { ...dept, id: Date.now().toString() }]);
  };

  const updateDepartment = (id: string, data: Partial<Department>) => {
    setDepartments(departments.map(d => d.id === id ? { ...d, ...data } : d));
  };

  const deleteDepartment = (id: string) => {
    setDepartments(departments.filter(d => d.id !== id));
  };

  const addDoctor = (doctor: Omit<Doctor, 'id'>) => {
    setDoctors([...doctors, { ...doctor, id: Date.now().toString() }]);
  };

  const updateDoctor = (id: string, data: Partial<Doctor>) => {
    setDoctors(doctors.map(d => d.id === id ? { ...d, ...data } : d));
  };

  const deleteDoctor = (id: string) => {
    setDoctors(doctors.filter(d => d.id !== id));
  };

  const addTimeSlot = (slot: Omit<TimeSlot, 'id'>) => {
    setTimeSlots([...timeSlots, { ...slot, id: Date.now().toString() }]);
  };

  const updateTimeSlot = (id: string, data: Partial<TimeSlot>) => {
    setTimeSlots(timeSlots.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const deleteTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(s => s.id !== id));
  };

  const generateSlots = (doctorId: string, date: string, startTime: string, endTime: string, duration: number) => {
    const slots: TimeSlot[] = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMin = startMin;
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const slotStart = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      
      currentMin += duration;
      if (currentMin >= 60) {
        currentHour += Math.floor(currentMin / 60);
        currentMin = currentMin % 60;
      }
      
      if (currentHour < endHour || (currentHour === endHour && currentMin <= endMin)) {
        const slotEnd = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
        
        slots.push({
          id: `${Date.now()}-${slots.length}`,
          doctorId,
          hospitalId: '1',
          date,
          startTime: slotStart,
          endTime: slotEnd,
          status: 'AVAILABLE',
        });
      }
    }
    
    setTimeSlots(prev => [...prev, ...slots]);
  };

  return (
    <HospitalDataContext.Provider value={{
      departments,
      doctors,
      timeSlots,
      opTimings,
      addDepartment,
      updateDepartment,
      deleteDepartment,
      addDoctor,
      updateDoctor,
      deleteDoctor,
      addTimeSlot,
      updateTimeSlot,
      deleteTimeSlot,
      generateSlots,
    }}>
      {children}
    </HospitalDataContext.Provider>
  );
}

export function useHospitalData() {
  const context = useContext(HospitalDataContext);
  if (context === undefined) {
    throw new Error('useHospitalData must be used within a HospitalDataProvider');
  }
  return context;
}
