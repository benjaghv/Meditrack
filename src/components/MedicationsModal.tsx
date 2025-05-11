'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RecommendedMedications from './RecommendedMedications';

interface MedicationsModalProps {
  treatment: string;
}

export default function MedicationsModal({ treatment }: MedicationsModalProps) {
  const [medications, setMedications] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecommendedModalOpen, setIsRecommendedModalOpen] = useState(false);

  const fetchMedications = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ treatment }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener los medicamentos');
      }

      const data = await response.json();
      
      // Verificar que la estructura del JSON es correcta
      if (!data?.medicamentos || !Array.isArray(data.medicamentos)) {
        throw new Error('Formato de respuesta incorrecto');
      }

      setMedications(data);
    } catch (err) {
      console.error('Error en fetchMedications:', err);
      setError('Error al obtener los medicamentos. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Ver medicamentos recomendados
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Medicamentos Recomendados</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Tratamiento</h4>
            <p className="text-sm text-muted-foreground">
              {treatment}
            </p>
          </div>
          <Button
            onClick={() => {
              fetchMedications();
              setIsRecommendedModalOpen(true);
            }}
            disabled={isLoading}
            className="w-full bg-[#dc2626] text-white hover:bg-[#f87171] transition"
          >
            {isLoading ? 'Cargando...' : 'Ver medicamentos recomendados'}
          </Button>
          <RecommendedMedications
            medications={medications}
            isOpen={isRecommendedModalOpen}
            onClose={() => setIsRecommendedModalOpen(false)}
          />
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          {medications?.medicamentos?.length > 0 ? (
            <div className="space-y-4">
              <div className="h-[300px] overflow-y-auto">
              {medications.medicamentos.map((med: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg mb-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Medicamento {index + 1}</h4>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <span className="font-medium w-24">Nombre:</span>
                          <span className="ml-2">{med.nombre}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-24">Dosis:</span>
                          <span className="ml-2">{med.dosis}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-24">Frecuencia:</span>
                          <span className="ml-2">{med.frecuencia} veces al día</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-24">Duración:</span>
                          <span className="ml-2">{med.duracion} días</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-24">Descripción:</span>
                          <span className="ml-2">{med.descripcion}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              {isLoading ? (
                <p className="text-gray-500">Cargando medicamentos...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <p className="text-gray-500">No se encontraron medicamentos recomendados.</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
