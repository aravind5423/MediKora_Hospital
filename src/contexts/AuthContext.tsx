import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Hospital } from '@/types/hospital';
import { auth, db, googleProvider } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPopup,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  hospital: Hospital | null;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (hospitalData: Partial<Hospital>, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => void;
  updateHospital: (data: Partial<Hospital>) => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          // Fetch existing hospital profile
          const docRef = doc(db, "hospitals", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // Convert Firestore Timestamp to Date if necessary
            const data = docSnap.data() as any;
            setHospital({
              ...data,
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
            } as Hospital);
          } else {
            console.log("No such document!");
            // Initialize empty hospital for new Google users so they aren't blocked, 
            // but isProfileComplete will be false, forcing them to details page.
            setHospital({
              id: currentUser.uid,
              name: currentUser.displayName || '',
              email: currentUser.email || '',
              phone: '',
              address: '',
              city: '',
              state: '',
              pincode: '',
              licenseNumber: '',
              isVerified: false,
              createdAt: new Date(),
            });
          }
        } else {
          setHospital(null);
        }
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching auth/profile data:", error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if hospital profile exists
      const docRef = doc(db, "hospitals", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Create new hospital profile for Google user
        const newHospital: Hospital = {
          id: user.uid,
          name: user.displayName || '',
          email: user.email || '',
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          licenseNumber: '',
          isVerified: false,
          createdAt: new Date(),
        };
        await setDoc(docRef, newHospital);
        setHospital(newHospital);
        toast({
          title: "Account Created",
          description: "Welcome! Please complete your hospital profile.",
        });
      } else {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.displayName || 'User'}!`,
        });
      }
      return true;
    } catch (error: any) {
      console.error("Google Sign In Error:", error);
      toast({
        title: "Google Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (hospitalData: Partial<Hospital>, password: string): Promise<boolean> => {
    if (!hospitalData.email || !password) return false;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, hospitalData.email, password);

      const newHospital: Hospital = {
        id: userCredential.user.uid,
        name: hospitalData.name || '',
        email: hospitalData.email,
        phone: hospitalData.phone || '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        licenseNumber: '',
        isVerified: false,
        createdAt: new Date(),
      };

      // Save to Firestore
      await setDoc(doc(db, "hospitals", userCredential.user.uid), newHospital);

      setHospital(newHospital);
      return true;
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Reset Email Sent",
        description: "Check your inbox for further instructions.",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Failed to send reset email",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setHospital(null);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const updateHospital = async (data: Partial<Hospital>) => {
    if (hospital && user) {
      const updatedHospital = { ...hospital, ...data };
      setHospital(updatedHospital);

      // Update in Firestore
      try {
        await updateDoc(doc(db, "hospitals", user.uid), data);
      } catch (error) {
        console.error("Error updating hospital data:", error);
        toast({
          title: "Update Failed",
          description: "Could not save changes to the server.",
          variant: "destructive",
        });
      }
    }
  };

  const isProfileComplete = !!(hospital?.name && hospital?.address && hospital?.city);

  return (
    <AuthContext.Provider value={{
      hospital,
      isAuthenticated: !!user,
      isProfileComplete,
      isLoading,
      login,
      register,
      loginWithGoogle,
      resetPassword,
      logout,
      updateHospital,
      user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
