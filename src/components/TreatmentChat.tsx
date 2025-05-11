'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSquare, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Treatment {
  name?: string;
  type?: string;
  description?: string;
  self_medication?: boolean;
  reason?: string;
  dose?: string;
  frequency?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Diagnosis {
  diagnosis?: {
    condition?: string;
    treatment?: Treatment;
    savedAt?: string;
  };
}

function DiagnosisSelector({ onSelect }: { onSelect: (diag: Diagnosis) => void }) {
  const [diagnostics, setDiagnostics] = useState<Diagnosis[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('diagnostics');
    if (stored) setDiagnostics(JSON.parse(stored));
  }, []);

  return (
    <div className="mt-0 relative flex justify-start">
      <button
        className="px-4 py-1 rounded bg-[#dc2626] text-white hover:bg-[#f87171] transition mt-0 mb-1 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        Diagnósticos guardados
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-2 border rounded bg-white shadow p-2 max-h-56 overflow-y-auto z-50 min-w-[220px]">
          {diagnostics.length === 0 ? (
            <div className="text-gray-500 text-sm">No hay diagnósticos guardados.</div>
          ) : (
            diagnostics.map((diag: Diagnosis, idx: number) => (
              <button
                key={idx}
                className="block w-full text-left px-2 py-1 hover:bg-[#f87171] hover:text-white rounded cursor-pointer"
                onClick={() => { onSelect(diag); setOpen(false); }}
              >
                {diag.diagnosis?.condition || 'Sin título'}
                <span className="block text-xs text-gray-400">
                  {diag.diagnosis?.savedAt ? new Date(diag.diagnosis.savedAt).toLocaleString() : ''}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function TreatmentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '¡Hola! Estoy aquí para ayudarte a definir un tratamiento médico. Por favor, describe tus síntomas y necesidades médicas.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [isMedicationsModalOpen, setIsMedicationsModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (!isFirstLoad && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsFirstLoad(false);
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/treatment-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      });

      if (!response.ok) throw new Error('Error al comunicarse con el asistente');

      const data = await response.json();
      if (data.success && data.content) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Lo siento, no pude conectarme con el asistente. Intenta nuevamente.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDiagnosis = async (diag: Diagnosis) => {
    const { diagnosis } = diag;
    const treatment = diagnosis?.treatment;
    setSelectedTreatment(treatment || null);
    setIsMedicationsModalOpen(true);

    const diagText = `Contexto de diagnóstico guardado:\nDiagnóstico: ${diagnosis?.condition}\nTratamiento: ${treatment?.name}\nTipo: ${treatment?.type}\nDescripción: ${treatment?.description}\nAutomedicación: ${treatment?.self_medication ? 'Sí' : 'No'}\nRazón: ${treatment?.reason}`;

    const newMessage: ChatMessage = { role: 'user', content: diagText };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/treatment-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      });

      if (!response.ok) throw new Error('Error al comunicarse con el asistente');

      const data = await response.json();
      if (data.success && data.content) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Lo siento, no pude conectarme con el asistente. Intenta nuevamente.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-0 pt-4 pb-1 mt-1 sm:mt-7">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <img src="https://static.vecteezy.com/system/resources/previews/041/922/879/non_2x/assistant-virtual-assistance-icon-illustration-vector.jpg"
               alt="Agente IA"
               className="h-8 w-8 rounded-full object-cover border border-gray-200 bg-white" />
          Asistente Médico Inteligente
        </CardTitle>
        <div className="text-base text-gray-600">
          Describe tus síntomas y necesidades médicas para obtener recomendaciones personalizadas.
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-2">
        <div className="space-y-2 h-[50vh] sm:h-[300px] xl:h-[380px] overflow-y-auto p-1 border rounded-lg">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
              <div className={`rounded-lg p-3 max-w-[70%] ${message.role === 'user' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <div className="font-medium mb-1">
                  {message.role === 'user' ? 'Tú' : 'Asistente'}
                </div>
                <div className="break-words whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 mt-0">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#dc2626] text-white hover:bg-[#f87171] transition cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-1">
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                Enviar
              </div>
            )}
          </Button>
        </form>
        <DiagnosisSelector onSelect={handleSelectDiagnosis} />
      </CardContent>

      <Dialog open={isMedicationsModalOpen} onOpenChange={setIsMedicationsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Medicamento Recomendado</DialogTitle>
          </DialogHeader>
          {selectedTreatment && (
            <div className="space-y-2 text-sm">
              <p><strong>Nombre:</strong> {selectedTreatment.name || 'N/A'}</p>
              <p><strong>Tipo:</strong> {selectedTreatment.type || 'N/A'}</p>
              <p><strong>Descripción:</strong> {selectedTreatment.description || 'N/A'}</p>
              <p><strong>Automedicación:</strong> {selectedTreatment.self_medication ? 'Sí' : 'No'}</p>
              <p><strong>Razón:</strong> {selectedTreatment.reason || 'N/A'}</p>
              <p><strong>Dosis:</strong> {selectedTreatment.dose || 'N/A'}</p>
              <p><strong>Frecuencia:</strong> {selectedTreatment.frequency || 'N/A'}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
