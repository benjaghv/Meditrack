import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Instanciamos la API de Resend con la clave
const resend = new Resend(process.env.RESEND_API_KEY);

// Usamos un named export para POST
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { feedback, feature, satisfaction } = body;

  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev", // O tu email verificado
      to: "benjaminghv@gmail.com", // Tu correo o uno dinámico
      subject: "Nueva retroalimentación recibida",
      html: `
        <h2>💬 Feedback recibido</h2>
        <p><strong>Característica destacada:</strong> ${feature}</p>
        <p><strong>Satisfacción:</strong> ${satisfaction} estrellas</p>
        <p><strong>Comentarios:</strong><br/>${feedback}</p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    // Verificar si el error es una instancia de Error
    if (error instanceof Error) {
      console.error("Error al enviar correo:", error);
      return NextResponse.json({ success: false, error: error.message });
    } else {
      console.error("Error desconocido:", error);
      return NextResponse.json({ success: false, error: 'Error desconocido' });
    }
  }
}
