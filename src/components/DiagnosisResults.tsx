'use client';

import React from 'react';

interface DiagnosisResultsProps {
  diagnosis: {
    diagnosis: {
      condition: string;
      treatment: {
        name: string;
        type: 'Con receta' | 'Sin receta';
        description: string;
        self_medication: string;
        reason: string;
      };
    };
  };
}

export default function DiagnosisResults({ diagnosis }: DiagnosisResultsProps) {

  const [saved, setSaved] = React.useState(false);

  if (!diagnosis) return null;
  const handleSave = () => {
    const stored = localStorage.getItem("diagnostics");
    const arr = stored ? JSON.parse(stored) : [];
    arr.push({ ...diagnosis, savedAt: new Date().toISOString() });
    localStorage.setItem("diagnostics", JSON.stringify(arr));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {diagnosis.diagnosis.condition}
          </h3>
          <button
            onClick={handleSave}
            className={`ml-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition ${saved ? 'opacity-60 pointer-events-none' : ''}`}
          >
            {saved ? '¡Guardado!' : 'Guardar diagnóstico'}
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Tratamiento recomendado:</h3>
            <p className="text-muted-foreground">{diagnosis.diagnosis.treatment.name}</p>
          </div>
          <div>
            <h3 className="font-medium">Tipo de tratamiento:</h3>
            <p className="text-muted-foreground">{diagnosis.diagnosis.treatment.type}</p>
          </div>
          <div>
            <h3 className="font-medium">Descripción:</h3>
            <p className="text-muted-foreground">{diagnosis.diagnosis.treatment.description}</p>
          </div>
          <div>
            <h3 className="font-medium">Puede automedicarse:</h3>
            <p className="text-muted-foreground">{diagnosis.diagnosis.treatment.self_medication}</p>
          </div>
          <div>
            <h3 className="font-medium">Razón:</h3>
            <p className="text-muted-foreground">{diagnosis.diagnosis.treatment.reason}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
