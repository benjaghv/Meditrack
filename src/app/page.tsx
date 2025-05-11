'use client';

import React from 'react';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';
import Header from '@/components/Header';
import DiagnosisForm from '@/components/DiagnosisForm';

export default function Home() {
  const [diagnosis, setDiagnosis] = React.useState<any>(null);

  const handleSubmit = async (data: { symptoms: string[]; previousTreatments: string[] }) => {
    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.error) {
        console.error('Error:', result.error);
        return;
      }

      setDiagnosis(result.diagnoses);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center p-0 pt-25 sm:pt-25">
      <div className="text-center mb-0">
  <p className="text-3xl sm:text-4xl font-semibold text-gray-900 max-w-2xl mx-auto leading-snug tracking-tight font-poppins">
    ¿No sabes qué tienes? <span className="text-red-500">MediTrack</span> te lo dice al instante.
  </p>
</div>

        <div className="rounded-lg shadow-md p-6 w-full max-w-2xl">
          <MedicalDisclaimer />

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-1">
                Diagnóstico Rápido
                <span className="ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-800 align-middle relative top-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <rect x="5" y="3" width="14" height="18" rx="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6M9 11h6M9 15h3" />
                    <rect
                      x="7.5"
                      y="5.5"
                      width="9"
                      height="13"
                      rx="1.2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.1"
                    />
                  </svg>
                </span>
              </h2>

              <DiagnosisForm />
            </div>
            
          </div>
      
        </div>
      
      </div>
      
    </div>
  );
}
