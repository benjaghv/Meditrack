import { NextResponse } from 'next/server';
import axios from 'axios';
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
    const { symptoms, previousTreatments } = await request.json();
    
    // Ejemplo de síntomas para depuración
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

    // Intentar extraer el JSON de la respuesta
    try {
      // Buscar el primer y último corchete
      const start = content.indexOf('{');
      const end = content.lastIndexOf('}') + 1;
      
      if (start !== -1 && end !== -1) {
        // Extraer el JSON del contenido
        const jsonContent = content.substring(start, end);
        console.log('JSON extraído:', jsonContent);
        
        // Intentar parsear el JSON
        const parsedResponse = JSON.parse(jsonContent) as DiagnosisResponse;
        
        if (!parsedResponse.diagnosis || !parsedResponse.diagnosis.treatment) {
          throw new Error('Respuesta inválida de la API');
        }
        
        return NextResponse.json(parsedResponse);
      } else {
        throw new Error('No se pudo encontrar un JSON válido en la respuesta');
      }
    } catch (error) {
      console.error('Error al procesar la respuesta:', error);
      throw new Error('Error al procesar la respuesta de la API');
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Error al procesar el diagnóstico'
    }, { status: 500 });
  }
}
