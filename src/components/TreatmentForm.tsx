'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

type Medication = {
  name: string;
  description?: string;
};

export default function TreatmentForm() {
  const [treatment, setTreatment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [medications, setMedications] = useState<Medication[] | null>(null);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ treatment: treatment.trim() }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener los medicamentos');
      }

      const data: Medication[] = await response.json();
      setMedications(data);
      setIsModalOpen(true);
    } catch {
      setError('Error al obtener los medicamentos. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Ingresa tu tratamiento o procedimiento</CardTitle>
        <div className="text-sm text-gray-600 mt-2">
          Ejemplo: dolor de cabeza intenso, fiebre alta, ansiedad constante, fatiga extrema. 
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Cuanto más específico, mejor los medicamentos recomendados.
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="¿Qué tratamiento o procedimiento necesitas?"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ver medicamentos recomendados
          </Button>
        </form>

        {error && <div className="text-red-500 mt-2">{error}</div>}

        {isModalOpen && medications && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Medicamentos recomendados:</h3>
            <ul className="list-disc list-inside mt-2">
              {medications.map((med, index) => (
                <li key={index}>{med.name}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
