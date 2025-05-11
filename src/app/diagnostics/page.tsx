"use client";

import { useEffect, useState, useRef } from "react";
import Header from "@/components/Header";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MedicationsModal from "@/components/MedicationsModal";
import { Trash2 } from 'lucide-react';

interface Treatment {
  name: string;
  type: string;
  description: string;
  self_medication: string;
  reason: string;
}

interface Diagnosis {
  condition: string;
  probability: number;
  treatment: Treatment;
}

interface SavedDiagnosis {
  diagnosis: Diagnosis;
  savedAt: string;
}


function DiagnosisModalView({ diagnosis }: { diagnosis: SavedDiagnosis }) {
  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Diagnóstico</h4>
        <p className="text-sm text-muted-foreground">{diagnosis?.diagnosis?.condition}</p>
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
        <p className="text-sm text-muted-foreground">{diagnosis?.diagnosis?.treatment?.name}</p>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Tipo de Tratamiento</h4>
        <p className="text-sm text-muted-foreground">{diagnosis?.diagnosis?.treatment?.type}</p>
      </div>
      {diagnosis?.diagnosis?.treatment?.name && (
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Medicamentos Recomendados</h4>
          <MedicationsModal treatment={diagnosis.diagnosis.treatment.name} />
        </div>
      )}
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Descripción</h4>
        <p className="text-sm text-muted-foreground">{diagnosis?.diagnosis?.treatment?.description}</p>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium leading-none">¿Puede automedicarse?</h4>
        <p className="text-sm text-muted-foreground">{diagnosis?.diagnosis?.treatment?.self_medication}</p>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Razón</h4>
        <p className="text-sm text-muted-foreground">{diagnosis?.diagnosis?.treatment?.reason}</p>
      </div>
    </div>
  );
}

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<SavedDiagnosis[]>([]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const deleteButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("diagnostics");
    if (stored) setDiagnostics(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && deleteIdx !== null && deleteButtonRef.current) {
        e.preventDefault();
        deleteButtonRef.current.click();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteIdx]);

  const handleDelete = (idx: number) => {
    const updated = diagnostics.filter((_, i) => i !== idx);
    setDiagnostics(updated);
    localStorage.setItem("diagnostics", JSON.stringify(updated));
    setDeleteIdx(null);
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-2">
      <Header />
      <div className="w-full max-w-4xl mx-auto mt-3 md:mt-9">
  <h1 className="text-2xl font-bold mb-6 text-center">Diagnósticos Guardados</h1>

        {diagnostics.length === 0 ? (
          <div className="text-center text-gray-500">No hay diagnósticos guardados.</div>
        ) : (
          <div className="space-y-4 pl-3">
            {diagnostics.map((diag, idx) => (
              <div key={idx} className="flex items-center">
                {/* Botón de borrar */}
                <button
                  className="mr-2 p-1 rounded hover:bg-red-100"
                  onClick={() => {
                    setOpenIdx(null);
                    setDeleteIdx(idx);
                  }}
                  aria-label="Eliminar diagnóstico"
                >
                  <Trash2 size={20} className="text-red-500 cursor-pointer" />
                </button>

                {/* Dialogo de diagnóstico */}
                <Dialog open={openIdx === idx} onOpenChange={open => setOpenIdx(open ? idx : null)}>
                <div className="border rounded-lg p-4 pb-5 bg-gray-50 flex-1 flex items-center justify-between mx-2 sm:mx-0">

                    <div>
                      <div className="font-semibold">{diag.diagnosis?.condition || "Sin título"}</div>
                      <div className="text-sm text-gray-600">{diag.diagnosis?.treatment?.description}</div>
                      
                    </div>
                    <DialogTrigger asChild>
                      <button className="ml-4 px-4 py-2 rounded bg-[#dc2626] text-white hover:bg-[#f87171] transition cursor-pointer">
                        Ver
                      </button>
                    </DialogTrigger>
                  </div>
                  <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Diagnóstico y Recomendaciones</DialogTitle>
                    </DialogHeader>
                    <DiagnosisModalView diagnosis={diag} />
                  </DialogContent>
                </Dialog>

                {/* Dialogo de confirmación de eliminación */}
                <Dialog open={deleteIdx === idx} onOpenChange={open => !open && setDeleteIdx(null)}>
                  <DialogContent className="max-w-xs">
                    <DialogHeader>
                      <DialogTitle>¿Eliminar diagnóstico?</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="flex-1 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        onClick={() => setDeleteIdx(null)}
                      >
                        Cancelar
                      </button>
                      <button
                        ref={deleteButtonRef}
                        className="flex-1 px-3 py-1 rounded bg-[#dc2626] text-white hover:bg-[#f87171] cursor-pointer"
                        onClick={() => handleDelete(idx)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
