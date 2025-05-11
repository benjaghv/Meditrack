'use client';

import TreatmentForm from './TreatmentForm';

export default function TreatmentTab() {
  return (
    <div className="container mx-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-8">
        <div className="text-center mb-2">
          <p className="text-gray-600 max-w-2xl mx-auto text-center">
            Ingresa tu tratamiento o procedimiento para obtener recomendaciones de medicamentos
          </p>
        </div>
        
        <div className="rounded-lg shadow-md p-6">
          <TreatmentForm />
        </div>
      </div>
    </div>
  );
}
