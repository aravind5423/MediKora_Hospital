import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Department, Doctor, TimeSlot, OPTiming } from '@/types/hospital';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch
} from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface HospitalDataContextType {
  departments: Department[];
  doctors: Doctor[];
  timeSlots: TimeSlot[];
  opTimings: OPTiming[];
  addDepartment: (dept: Omit<Department, 'id'>) => Promise<void>;
  updateDepartment: (id: string, data: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  addDoctor: (doctor: Omit<Doctor, 'id'>) => Promise<void>;
  updateDoctor: (id: string, data: Partial<Doctor>) => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;
  addTimeSlot: (slot: Omit<TimeSlot, 'id'>) => Promise<void>;
  updateTimeSlot: (id: string, data: Partial<TimeSlot>) => Promise<void>;
  deleteTimeSlot: (id: string) => Promise<void>;
  generateSlots: (doctorId: string, date: string, startTime: string, endTime: string, duration: number) => Promise<void>;
}

const HospitalDataContext = createContext<HospitalDataContextType | undefined>(undefined);

export function HospitalDataProvider({ children }: { children: ReactNode }) {
  const { user, hospital } = useAuth();
  const { toast } = useToast();

  // Local state for departments as they might be static or less dynamic for now
  const [departments, setDepartments] = useState<Department[]>([
    { id: '1', name: 'Cardiology', description: 'Heart and cardiovascular care', hospitalId: '1' },
    { id: '2', name: 'Orthopedics', description: 'Bone and joint care', hospitalId: '1' },
    { id: '3', name: 'Pediatrics', description: 'Child healthcare', hospitalId: '1' },
    { id: '4', name: 'Neurology', description: 'Brain and nervous system', hospitalId: '1' },
    { id: '5', name: 'Dermatology', description: 'Skin care', hospitalId: '1' },
    { id: '6', name: 'General Medicine', description: 'General healthcare', hospitalId: '1' },
  ]);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [opTimings, setOpTimings] = useState<OPTiming[]>([]);

  // Listen to Doctors and Slots when user is logged in
  useEffect(() => {
    if (!user) {
      setDoctors([]);
      setTimeSlots([]);
      return;
    }

    // Subscribe to Doctors
    const doctorsQ = query(collection(db, 'doctors'), where('hospitalId', '==', user.uid));
    const unsubDoctors = onSnapshot(doctorsQ, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
      setDoctors(docs);
    }, (error) => {
      console.error("Error fetching doctors:", error);
    });

    // Subscribe to TimeSlots
    const slotsQ = query(collection(db, 'slots'), where('hospitalId', '==', user.uid));
    const unsubSlots = onSnapshot(slotsQ, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimeSlot));
      setTimeSlots(docs);
    }, (error) => {
      console.error("Error fetching slots:", error);
    });

    return () => {
      unsubDoctors();
      unsubSlots();
    };
  }, [user]);

  const addDepartment = async (dept: Omit<Department, 'id'>) => {
    // Keeping local state for departments as requested to focus on Slots/Doctors
    // In a real app, this should also be Firestore
    setDepartments([...departments, { ...dept, id: Date.now().toString() }]);
  };

  const updateDepartment = async (id: string, data: Partial<Department>) => {
    setDepartments(departments.map(d => d.id === id ? { ...d, ...data } : d));
  };

  const deleteDepartment = async (id: string) => {
    setDepartments(departments.filter(d => d.id !== id));
  };

  const addDoctor = async (doctor: Omit<Doctor, 'id'>) => {
    if (!user) return;
    try {
      const fullDoctorData = {
        ...doctor,
        hospitalId: user.uid,
        hospitalName: hospital?.name || '',
        hospitalAddress: hospital?.address || '',
        hospitalCity: hospital?.city || '',
        createdAt: new Date()
      };
      await addDoc(collection(db, 'doctors'), fullDoctorData);
    } catch (error) {
      console.error("Error adding doctor:", error);
      toast({ title: "Failed to add doctor", variant: "destructive" });
    }
  };

  const updateDoctor = async (id: string, data: Partial<Doctor>) => {
    try {
      await updateDoc(doc(db, 'doctors', id), data);
    } catch (error) {
      console.error("Error updating doctor:", error);
      toast({ title: "Failed to update doctor", variant: "destructive" });
    }
  };

  const deleteDoctor = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'doctors', id));
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast({ title: "Failed to delete doctor", variant: "destructive" });
    }
  };

  const addTimeSlot = async (slot: Omit<TimeSlot, 'id'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'slots'), {
        ...slot,
        hospitalId: user.uid,
        createdAt: new Date()
      });
    } catch (error) {
      console.error("Error adding slot:", error);
      toast({ title: "Failed to add slot", variant: "destructive" });
    }
  };

  const updateTimeSlot = async (id: string, data: Partial<TimeSlot>) => {
    try {
      await updateDoc(doc(db, 'slots', id), data);
    } catch (error) {
      console.error("Error updating slot:", error);
      toast({ title: "Failed to update slot", variant: "destructive" });
    }
  };

  const deleteTimeSlot = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'slots', id));
    } catch (error) {
      console.error("Error deleting slot:", error);
      toast({ title: "Failed to delete slot", variant: "destructive" });
    }
  };

  const generateSlots = async (doctorId: string, date: string, startTime: string, endTime: string, duration: number) => {
    if (!user) return;

    try {
      const batch = writeBatch(db);

      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);

      let currentHour = startHour;
      let currentMin = startMin;
      let count = 0;

      while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const slotStart = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;

        currentMin += duration;
        if (currentMin >= 60) {
          currentHour += Math.floor(currentMin / 60);
          currentMin = currentMin % 60;
        }

        if (currentHour < endHour || (currentHour === endHour && currentMin <= endMin)) {
          const slotEnd = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;

          const newSlotRef = doc(collection(db, 'slots'));
          batch.set(newSlotRef, {
            doctorId,
            hospitalId: user.uid,
            date,
            startTime: slotStart,
            endTime: slotEnd,
            status: 'AVAILABLE',
            createdAt: new Date()
          });
          count++;
        }
      }

      await batch.commit();
      toast({
        title: "Slots Generated",
        description: `Successfully created ${count} slots for ${date}`
      });

    } catch (error) {
      console.error("Error generating slots:", error);
      toast({ title: "Failed to generate slots", variant: "destructive" });
    }
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
