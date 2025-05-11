'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';

export default function CommentsPage() {
  const [formSent, setFormSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const form = e.currentTarget;
    const feedback = (form.elements.namedItem("feedback") as HTMLTextAreaElement).value;
    const feature = (form.elements.namedItem("feature") as HTMLSelectElement).value;
    const satisfaction = (form.elements.namedItem("satisfaction") as HTMLInputElement).value;
  
    try {
      const res = await fetch("/api/send-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback, feature, satisfaction }),
      });
  
      const result = await res.json();
      if (result.success) {
        setFormSent(true);
      } else {
        alert("Hubo un error al enviar el correo.");
      }
    } catch (err) {
      console.error("Error al enviar:", err);
      alert("Error al conectar con el servidor.");
    }
  
    form.reset();
  };
  

  return (
    <>
      <Header />
      <main className="flex items-center justify-center min-h-screen px-4 pt-24 bg-gray-50">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 sm:p-10">
          <h1 className="text-2xl font-bold text-center text-red-500 mb-4">
            💬 Cómo calificas tu experiencia?
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Tu opinión nos ayuda a mejorar nuestros servicios. ¡Gracias por contribuir!
          </p>

          {formSent ? (
            <div className="text-center text-green-600 font-semibold">
              ¡Gracias por tu retroalimentación! ✅
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  ¿Qué aspecto fue más útil para ti?
                </label>
                <select
                  name="feature"
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  required
                >
                  <option value="">Selecciona una opción</option>
                  <option value="diagnostico">Diagnóstico rápido</option>
                  <option value="asistente">Asistente inteligente</option>
                  <option value="tratamientos">Recomendaciones de tratamiento</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  ¿Qué tan satisfecho/a estás con la experiencia?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <label key={val} className="flex flex-col items-center text-sm">
                      <input
                        type="radio"
                        name="satisfaction"
                        value={val}
                        required
                        className="mb-1"
                      />
                      {val}⭐
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  ¿Tienes comentarios adicionales?
                </label>
                <textarea
                  name="feedback"
                  placeholder="Escribe aquí tus comentarios, sugerencias o problemas..."
                  className="w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  rows={4}
                  required
                ></textarea>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md cursor-pointer"
              >
                📩 Enviar Feedback
              </Button>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
