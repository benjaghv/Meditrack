import { NextResponse } from 'next/server';
import { DiagnosisResponse } from '@/types';

export interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function POST(request: Request) {
  try {
    const { symptoms } = await request.json();
    const debugSymptoms = symptoms.length === 0 ? ['dolor de cabeza', 'fiebre'] : symptoms;

    const prompt = `Eres un asistente médico experto. Analiza los siguientes síntomas y proporciona un diagnóstico, tratamiento recomendado y si es seguro automedicarse.

Síntomas: ${debugSymptoms.join(', ')}

Genera una respuesta EXCLUSIVAMENTE en formato JSON válido:
{
  "diagnosis": {
    "condition": "Diagnóstico",
    "probability": "Porcentaje de certeza entre 0 y 100 (por ejemplo: 85)",
    "treatment": {
      "name": "Tratamiento",
      "type": "Con receta/Sin receta",
      "description": "Descripción breve",
      "self_medication": "Sí/No",
      "reason": "Razón por la que sí/no se puede automedicar"
    }
  }
}
No incluyas ningún texto adicional fuera del JSON. Responde solo con el JSON válido.`;

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Falta GROQ_API_KEY' }, { status: 500 });
    }

    const models = [
      'meta-llama/llama-4-scout-17b-16e-instruct',
      'llama3-70b-8192',
      'mixtral-8x7b-32768'
    ];

    for (const model of models) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1500
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`⚠️ Modelo ${model} falló con status ${response.status}:`, errorText);
          continue; // Intenta el siguiente modelo
        }

        const data: GroqResponse = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
          console.warn(`⚠️ Modelo ${model} no devolvió contenido`);
          continue;
        }

        const start = content.indexOf('{');
        const end = content.lastIndexOf('}') + 1;

        if (start === -1 || end === -1) throw new Error('No se pudo encontrar un JSON válido');

        const jsonContent = content.substring(start, end);
        const parsedResponse = JSON.parse(jsonContent) as DiagnosisResponse;

        if (!parsedResponse?.diagnosis?.treatment) {
          throw new Error('Respuesta de modelo inválida');
        }

        return NextResponse.json(parsedResponse);

      } catch (modelError) {
        console.error(`⚠️ Error al intentar modelo ${model}:`, modelError);
        continue;
      }
    }

    return NextResponse.json({
      error: 'Todos los modelos fallaron. Intenta nuevamente más tarde.'
    }, { status: 503 });

  } catch (error) {
    console.error('💥 Error general del servidor:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
