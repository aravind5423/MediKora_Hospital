import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Building2, MapPin, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function HospitalDetails() {
  const { hospital, updateHospital, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: hospital?.name || '',
    address: hospital?.address || '',
    city: hospital?.city || '',
    state: hospital?.state || '',
    pincode: hospital?.pincode || '',
    licenseNumber: hospital?.licenseNumber || '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateHospital(formData);
      toast({
        title: "Profile Updated",
        description: "Your hospital details have been saved successfully.",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Complete = formData.name && formData.licenseNumber;
  const isStep2Complete = formData.address && formData.city && formData.state && formData.pincode;

  const steps = [
    { num: 1, title: 'Basic Info', completed: isStep1Complete },
    { num: 2, title: 'Location', completed: isStep2Complete },
    { num: 3, title: 'Complete', completed: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MediKora</span>
          </div>
          <span className="text-sm text-muted-foreground">{hospital?.email}</span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${step.completed || currentStep > step.num
                      ? 'bg-gradient-primary text-primary-foreground'
                      : currentStep === step.num
                        ? 'bg-primary/20 text-primary border-2 border-primary'
                        : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    {step.completed || currentStep > step.num ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      step.num
                    )}
                  </div>
                  <span className={`text-sm mt-2 ${currentStep === step.num ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {step.title}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-24 h-0.5 mx-4 ${step.completed ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card variant="elevated" className="max-w-2xl mx-auto border-0 animate-scale-in">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              {currentStep === 1 && <Building2 className="w-6 h-6 text-primary" />}
              {currentStep === 2 && <MapPin className="w-6 h-6 text-primary" />}
              {currentStep === 3 && <FileText className="w-6 h-6 text-primary" />}
              {currentStep === 1 && 'Hospital Information'}
              {currentStep === 2 && 'Location Details'}
              {currentStep === 3 && 'Review & Complete'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Enter your hospital\'s basic information'}
              {currentStep === 2 && 'Provide your hospital\'s address'}
              {currentStep === 3 && 'Review your details and complete setup'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="name">Hospital Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="City General Hospital"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License / Registration Number *</Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder="HOSP-2024-XXXXX"
                      required
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Medical Lane"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Mumbai"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Maharashtra"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="400001"
                      required
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-secondary/50 rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-foreground">Hospital Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <p className="font-medium text-foreground">{formData.name}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">License:</span>
                        <p className="font-medium text-foreground">{formData.licenseNumber}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Address:</span>
                        <p className="font-medium text-foreground">
                          {formData.address}, {formData.city}, {formData.state} - {formData.pincode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={
                      (currentStep === 1 && !isStep1Complete) ||
                      (currentStep === 2 && !isStep2Complete)
                    }
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Complete Setup'}
                    {!isSubmitting && <CheckCircle2 className="w-4 h-4 ml-2" />}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
