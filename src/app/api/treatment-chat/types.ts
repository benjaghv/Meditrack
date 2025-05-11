export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  messages: ChatMessage[];
  treatment?: {
    name: string;
    dose: string;
    frequency: string;
    duration: string;
    description: string;
  };
}

export interface TreatmentResponse {
  patientName: string;
  age?: number;
  symptoms: string[];
  symptomDuration?: string;
  symptomIntensity?: string;
  medicalHistory?: string[];
  currentMedications?: string[];
  allergies?: string[];
  diagnosis: string;
  treatment: {
    name: string;
    dose: string;
    frequency: string;
    duration: string;
    description: string;
    precautions?: string[];
  }[];
  followupPlan: {
    nextAppointment: string;
    symptomsToMonitor: string[];
    parametersToEvaluate: string[];
    improvementPoints: string[];
    recommendations: string[];
  };
}
