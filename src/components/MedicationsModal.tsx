'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RecommendedMedications from './RecommendedMedications';

interface MedicationsModalProps {
  treatment: string;
}

interface Medicamento {
  nombre: string;
  dosis: string;
  frecuencia: number;
  duracion: number;
  descripcion: string;
}

interface MedicationsResponse {
  medicamentos: Medicamento[];
}

export default function MedicationsModal({ treatment }: MedicationsModalProps) {
  const [medications, setMedications] = useState<MedicationsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      fetchMedications();
    }
  }, [isModalOpen]);

  const fetchMedications = async () => {
    setIsLoading(true);
    setError('');
    setMedications(null);

    try {
      const response = await fetch('/api/medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treatment }),
      });

      if (!response.ok) throw new Error('Error al obtener los medicamentos');

      const data = await response.json();

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
            <p className="text-sm text-muted-foreground">{treatment}</p>
          </div>

          {isLoading ? (
            <p className="text-center text-gray-500">Cargando medicamentos...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : medications?.medicamentos?.length ? (
            <div className="space-y-4 h-[300px] overflow-y-auto">
              {medications.medicamentos.map((med, index) => (
                <div key={index} className="p-4 border rounded-lg mb-4">
                  <h4 className="font-medium mb-2">Medicamento {index + 1}</h4>
                  <div className="space-y-1">
                    <Detail label="Nombre" value={med.nombre} />
                    <Detail label="Dosis" value={med.dosis} />
                    <Detail label="Frecuencia" value={`${med.frecuencia} veces al día`} />
                    <Detail label="Duración" value={`${med.duracion} días`} />
                    <Detail label="Descripción" value={med.descripcion} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No se encontraron medicamentos recomendados.</p>
          )}

          <RecommendedMedications
            medications={medications}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center">
      <span className="font-medium w-24">{label}:</span>
      <span className="ml-2">{value}</span>
    </div>
  );
}
