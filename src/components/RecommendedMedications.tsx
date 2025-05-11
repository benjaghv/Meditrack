'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RecommendedMedicationsProps {
  medications: MedicationsResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Medicamento {
  nombre: string;
  tipo?: string;
  dosis: string;
  frecuencia: number;
  duracion: number;
  descripcion: string;
}

interface MedicationsResponse {
  medicamentos: Medicamento[];
}


export default function RecommendedMedications({ medications, isOpen, onClose }: RecommendedMedicationsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[825px] max-h-[680px] overflow-y-auto pb-0 pt-6">
        <DialogHeader>
          <DialogTitle>Medicamentos Recomendados</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {medications?.medicamentos?.slice(0, 5).map((med: Medicamento, index: number) => (
            <div key={index} className="p-4 border rounded-lg mb-4">
              <div className="space-y-2">
                <h4 className="font-medium">Medicamento {index + 1}</h4>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <span className="font-medium w-24">Nombre:</span>
                    <span className="ml-2">{med.nombre || 'No especificado'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-24">Tipo:</span>
                    <span className="ml-2">{med.tipo || 'No especificado'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-24">Dosis:</span>
                    <span className="ml-2">{med.dosis || 'No especificado'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-24">Frecuencia:</span>
                    <span className="ml-2">{med.frecuencia ? `${med.frecuencia} veces al día` : 'No especificado'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-24">Duración:</span>
                    <span className="ml-2">{med.duracion ? `${med.duracion} días` : 'No especificado'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-24">Descripción:</span>
                    <span className="ml-2">{med.descripcion || 'No especificado'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
