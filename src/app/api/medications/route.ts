import { NextResponse } from 'next/server';
import axios from 'axios';
import { GroqResponse } from '@/app/api/diagnose/route';

interface MedicationResponse {
  medications: Array<{
    nombre: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
    descripcion: string;
  }>;
}

export async function POST(request: Request) {
  try {
    const { treatment } = await request.json();
    
    const prompt = `Eres un asistente médico experto. Para el tratamiento "${treatment}", proporciona los medicamentos ESSENCIALES y MÁS COMUNES. Muestra solo los medicamentos más importantes y frecuentemente usados, no más de 5.

Genera una respuesta EXCLUSIVAMENTE en formato JSON válido:
{
  "medicamentos": [
    {
      "nombre": "Nombre del medicamento",
      "dosis": "Dosis (mg/ml/gramos)",
      "frecuencia": "Número de veces al día (ej: 1 vez al día, 2 veces al día, etc.)",
      "duracion": "Número de días (ej: 5 días, 10 días, etc.)",
      "descripcion": "Descripción breve del medicamento, incluyendo para qué se usa o cuál es su función",
      "tipo": "Con receta o Sin receta"
    }
  ]
}

No incluyas ningún texto adicional fuera del JSON. Responde solo con el JSON válido.`;

    const groqResponse = await axios.post<GroqResponse>('https://api.groq.com/openai/v1/chat/completions', {
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: 0.7
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      }
    });

    const content = groqResponse.data.choices[0].message.content;
    console.log('Respuesta de Groq:', content);

    try {
      // Limpiar el formato de backticks y otros caracteres no deseados
      const cleanContent = content
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '');

      // Extraer solo el JSON válido
      const start = cleanContent.indexOf('{');
      const end = cleanContent.lastIndexOf('}') + 1;
      
      if (start !== -1 && end !== -1) {
        const jsonContent = cleanContent.substring(start, end);
        console.log('JSON limpio:', jsonContent);
        
        const parsedResponse = JSON.parse(jsonContent) as MedicationResponse;
        return NextResponse.json(parsedResponse);
      } else {
        throw new Error('No se pudo encontrar un JSON válido en la respuesta');
      }
    } catch (error) {
      console.error('Error al procesar la respuesta:', error);
      return NextResponse.json({
        medicamentos: [
          {
            nombre: 'No se pudieron obtener medicamentos',
            dosis: 'N/A',
            frecuencia: 'N/A',
            duracion: 'N/A',
            descripcion: 'Hubo un error al procesar la respuesta'
          }
        ]
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      error: 'Error al obtener los medicamentos'
    }, { status: 500 });
  }
}
