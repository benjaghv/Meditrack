'use client';

import { useState } from 'react';

interface SymptomFormProps {
  onSubmit: (data: { symptoms: string[], previousTreatments: string[] }) => void;
}

export function SymptomForm({ onSubmit }: SymptomFormProps) {
  const [symptoms, setSymptoms] = useState<string>('');
  const [previousTreatments] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const symptomsArray = symptoms.split(',').map(s => s.trim()).filter(s => s);
    const treatmentsArray = previousTreatments.split(',').map(s => s.trim()).filter(s => s);
    onSubmit({ symptoms: symptomsArray, previousTreatments: treatmentsArray });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-red-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-full">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">¿Cómo te sientes hoy?</h2>
            <p className="text-gray-600">Describe tus síntomas y te ayudaré a entender qué podría estar pasando.</p>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Síntomas</label>
          <input
            type="text"
            placeholder="Ej: dolor de cabeza, fiebre, etc."
            value={symptoms}
            onChange={(e) => {
              setSymptoms(e.target.value);
            }}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>
      </div>

      <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white hover:text-white/90 transition-all duration-200 px-8 py-4 rounded-lg text-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-102">
        Obtener diagnóstico
      </button>
    </form>
  );
}
