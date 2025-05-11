export interface Treatment {
  name: string;
  type: 'Con receta' | 'Sin receta';
  description: string;
  self_medication: 'Sí' | 'No';
  reason: string;
}

export interface DiagnosisResponse {
  diagnosis: {
    condition: string;
    probability: 'Alta' | 'Media' | 'Baja';
    treatment: Treatment;
  };
}
