import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MedicationsModal from './MedicationsModal';

interface Diagnosis {
  diagnosis: {
    condition: string;
    probability?: number;
    treatment?: {
      name?: string;
      type?: string;
      description?: string;
      self_medication?: string;
      reason?: string;
    };
  };
}

function DiagnosisModalContent({ diagnosis }: { diagnosis: Diagnosis }) {
  const [saved, setSaved] = useState(false);
  const [, setError] = useState<string | null>(null);


  const handleSave = () => {
    try {
      const existing = JSON.parse(localStorage.getItem("diagnostics") || "[]");
      const updated = [...existing, diagnosis];
      localStorage.setItem("diagnostics", JSON.stringify(updated));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Error al guardar el diagnóstico localmente.");
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Diagnóstico</h4>
        <p className="text-sm text-muted-foreground">
          {diagnosis?.diagnosis?.condition}
        </p>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Probabilidad</h4>
        <p className="text-sm text-muted-foreground">
          {diagnosis?.diagnosis?.probability
            ? `${Number(diagnosis.diagnosis.probability).toFixed(0)}%`
            : 'N/A'}
        </p>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Tratamiento Recomendado</h4>
        <p className="text-sm text-muted-foreground">
          {diagnosis?.diagnosis?.treatment?.name}
        </p>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Tipo de Tratamiento</h4>
        <p className="text-sm text-muted-foreground">
          {diagnosis?.diagnosis?.treatment?.type}
        </p>
      </div>
      {diagnosis?.diagnosis?.treatment?.name && (
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Medicamentos Recomendados</h4>
          <MedicationsModal treatment={diagnosis?.diagnosis?.treatment.name} />
        </div>
      )}
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Descripción</h4>
        <p className="text-sm text-muted-foreground">
          {diagnosis?.diagnosis?.treatment?.description}
        </p>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Puede automedicarse?</h4>
        <p className="text-sm text-muted-foreground">
          {diagnosis?.diagnosis?.treatment?.self_medication}
        </p>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Razón</h4>
        <p className="text-sm text-muted-foreground">
          {diagnosis?.diagnosis?.treatment?.reason}
        </p>
      </div>
      <button
        onClick={handleSave}
        className={`mt-4 px-4 py-2 rounded bg-[#dc2626] text-white hover:bg-[#f87171] transition ${saved ? 'opacity-60 pointer-events-none' : ''}`}
      >
        {saved ? '¡Guardado!' : 'Guardar diagnóstico'}
      </button>
    </div>
  );
}

export default function DiagnosisForm() {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms: symptoms.split(',').map(s => s.trim()) }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener el diagnóstico');
      }

      const data = await response.json();
      setDiagnosis(data);
      setIsModalOpen(true);
    } catch {
      setError('Error al obtener el diagnóstico. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Ingresa tus síntomas</CardTitle>
        <div className="text-sm text-gray-600 mt-2">
          Ejemplo: dolor de cabeza intenso, fiebre alta, ansiedad constante, fatiga extrema. 
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Cuanto más específico seas, más preciso será el diagnóstico.
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="¿Cómo te sientes?"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full bg-[#dc2626] text-white hover:bg-[#f87171] transition cursor-pointer">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Obtener diagnóstico
          </Button>
        </form>

        {diagnosis && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Ver diagnóstico
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] md:w-[90vw] lg:w-[80vw] max-w-[1000px] sm:rounded-lg p-4 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Diagnóstico y Recomendaciones</DialogTitle>
              </DialogHeader>
              <DiagnosisModalContent diagnosis={diagnosis} />
            </DialogContent>
          </Dialog>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
