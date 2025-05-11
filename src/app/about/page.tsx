'use client';

import Header from '@/components/Header';

const AboutPage = () => {
  return (
    <main className="pt-28 px-4 max-w-4xl mx-auto">
        <Header />
      <h2 className="text-3xl font-bold text-red-500 mb-6">Acerca del Sistema</h2>

      <section className="bg-white shadow-md rounded-xl p-6 mb-6">
  <h3 className="text-xl font-semibold mb-4">¿Qué es MediTrack?</h3>
  <p className="text-gray-700 leading-relaxed">
  MediTrack es una plataforma inteligente diseñada para ofrecer diagnósticos rápidos y eficientes, brindando apoyo a cualquier persona que necesite resolver inquietudes relacionadas con su salud. Utiliza algoritmos avanzados de inteligencia artificial para analizar los síntomas ingresados, proporcionando recomendaciones personalizadas de diagnóstico y posibles tratamientos. Esta herramienta está pensada para mejorar la toma de decisiones sobre la salud, facilitando el seguimiento de casos y optimizando la calidad de los diagnósticos.

  </p>
</section>

<section className="bg-white shadow-md rounded-xl p-6 mb-6">
  <h3 className="text-xl font-semibold mb-4">Características Principales</h3>
  <ul className="list-disc pl-5 text-gray-700 leading-relaxed space-y-1">
    <li>🔍 <strong>Diagnóstico Rápido:</strong> Obtén diagnósticos rápidos basados en el análisis de síntomas, ideales para obtener una referencia inicial.</li>
    <li>🤖 <strong>Asistencia Inteligente:</strong> Un agente de IA que te guía, analizando tus síntomas y contexto para ofrecerte información clara sobre posibles condiciones de salud.</li>
    <li>📝 <strong>Historial de Diagnósticos:</strong> Guarda el historial de diagnósticos para un seguimiento continuo y análisis posterior de tu salud.</li>
  </ul>
</section>

<section className="bg-white shadow-md rounded-xl p-6 mb-6">
  <h3 className="text-xl font-semibold mb-4">¿Cómo Funciona MediTrack?</h3>
  <p className="text-gray-700 leading-relaxed">
    MediTrack utiliza inteligencia artificial para procesar los síntomas ingresados por el usuario y generar diagnósticos preliminares. A través de su plataforma fácil de usar, 
    los usuarios pueden ingresar síntomas, obtener posibles diagnósticos y recibir sugerencias sobre tratamientos. Los datos se procesan en tiempo real, permitiendo la creación de 
    un historial para un seguimiento continuo del estado de salud.
  </p>
  <p className="text-gray-700 leading-relaxed mt-4">
    Además, la plataforma proporciona recomendaciones sobre tratamientos basados en la información médica disponible, siempre destacando la importancia de consultar con un profesional de la salud.
  </p>
</section>


      <section className="bg-white shadow-md rounded-xl p-6
      mb-4">
        <h3 className="text-xl font-semibold mb-4">Aviso de Uso y Privacidad</h3>

<p className="text-gray-700 leading-relaxed mb-4">
  Este sistema es una herramienta de apoyo diseñada para proporcionar posibles diagnósticos y recomendaciones generales
  basadas en los síntomas que el usuario ingrese.
</p>

<p className="text-gray-700 leading-relaxed mb-4">
  ⚠️ <strong>Los resultados generados son solo de carácter referencial</strong> y no deben considerarse como un diagnóstico médico definitivo.
</p>

<p className="text-gray-700 leading-relaxed mb-4">
  La precisión de las sugerencias dependerá de la calidad y especificidad de los síntomas proporcionados por el usuario. 
  Por lo tanto, los resultados pueden variar en función de la información ingresada.
</p>

<p className="text-gray-700 leading-relaxed mb-4">
  Recomendamos siempre consultar con un profesional de la salud calificado antes de tomar decisiones relacionadas con 
  tratamientos, medicamentos u otras acciones derivadas de los resultados obtenidos en esta plataforma.
</p>

<p className="text-gray-700 leading-relaxed mb-4">
  Al utilizar esta plataforma, el usuario acepta que los desarrolladores no son responsables por cualquier uso indebido de la información proporcionada.
</p>

      </section>
    </main>
  );
};

export default AboutPage;
