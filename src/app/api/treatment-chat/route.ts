import { NextResponse } from 'next/server';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    console.log('📥 Recibiendo solicitud POST');
    const { messages }: { messages: Message[] } = await request.json();
    console.log('📝 Mensajes recibidos:', messages);

    
    const systemPrompt: Message = {
      role: 'system',
      content: `
        Eres un asistente médico virtual cuyo propósito principal es ayudar a evaluar los síntomas de los pacientes y ofrecer recomendaciones claras.
        Realiza preguntas directas para obtener los datos más relevantes sobre los síntomas del paciente, y evita distracciones.
        Después de 2-3 preguntas clave, proporciona una recomendación sobre qué hacer a continuación, como consultar a un médico, hacer un seguimiento o esperar.
        No es necesario calcular o reportar probabilidades, solo sugerir acciones con base en las respuestas.

        Tu lenguaje debe ser profesional, empático y claro, y siempre debes aclarar que no sustituyes una consulta médica presencial.
      `,
    };
  
    if (!messages.some(msg => msg.role === 'system')) {
      messages.unshift(systemPrompt);
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error('❌ GROQ_API_KEY no está configurada');
      return NextResponse.json({
        error: 'Falta la clave de API',
        details: 'Por favor, define GROQ_API_KEY en tu archivo .env.local',
      }, { status: 500 });
    }

    const models = [
      'llama3-70b-8192',
      'mixtral-8x7b-32768',
      'llama2-70b-4096',
    ];
    

    for (const model of models) {
      try {
        console.log(`🤖 Intentando modelo: ${model}`);

        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {

          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.7,
            max_tokens: 2000,
            stream: false,
          }),
        });

        console.log(`🔁 Status respuesta: ${groqResponse.status}`);

        if (!groqResponse.ok) {
          const errorData = await groqResponse.json().catch(() => null);
          console.warn('⚠️ Fallo en modelo:', model, errorData);

          // Continúa con el siguiente modelo si este falla
          continue;
        }

        const apiResponse = await groqResponse.json();
        const content = apiResponse?.choices?.[0]?.message?.content;

        if (!content) {
          console.error('❌ Respuesta sin contenido válido');
          return NextResponse.json({
            error: 'Respuesta de la API sin contenido',
            details: 'La respuesta no contiene contenido válido'
          }, { status: 500 });
        }

        console.log('✅ Respuesta exitosa:', content);

        // Devolver la respuesta completa con los mensajes
        return NextResponse.json({
          success: true,
          content: content,
          messages: [...messages, { role: 'assistant', content: content }],
          model: model,
          timestamp: new Date().toISOString()
        });

      } catch (modelError) {
        console.error(`⚠️ Error con modelo ${model}:`, modelError);
        continue; // Intenta con el siguiente modelo
      }
    }

    // Si ninguno de los modelos funcionó
    return NextResponse.json({
      error: 'Todos los modelos fallaron',
      details: 'Intenta nuevamente más tarde',
    }, { status: 500 });

  } catch (error) {
    console.error('💥 Error general del servidor:', error);
    return NextResponse.json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
