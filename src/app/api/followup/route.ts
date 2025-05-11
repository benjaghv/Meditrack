import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export interface Followup {
  id: string;
  patientName: string;
  symptoms: string[];
  diagnosis: string;
  treatment: {
    name: string;
    dose: string;
    frequency: string;
    duration: string;
    description: string;
  };
  startDate: string;
  status: 'active' | 'completed' | 'cancelled';
  notes: string[];
  checkups: {
    date: string;
    symptoms: string[];
    improvements: string[];
    concerns: string[];
  }[];
}

// Simulación de base de datos
let followups: Followup[] = [];

export async function GET() {
  return NextResponse.json(followups);
}

export async function POST(request: Request) {
  try {
    const { patientName, symptoms, diagnosis, treatment } = await request.json();
    
    const newFollowup: Followup = {
      id: uuidv4(),
      patientName,
      symptoms,
      diagnosis,
      treatment,
      startDate: new Date().toISOString(),
      status: 'active',
      notes: [],
      checkups: []
    };

    followups.push(newFollowup);
    return NextResponse.json(newFollowup);
  } catch (error) {
    console.error('Error creating followup:', error);
    return NextResponse.json(
      { error: 'Error al crear el seguimiento' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, data } = await request.json();
    const index = followups.findIndex(f => f.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Seguimiento no encontrado' },
        { status: 404 }
      );
    }

    followups[index] = { ...followups[index], ...data };
    return NextResponse.json(followups[index]);
  } catch (error) {
    console.error('Error updating followup:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el seguimiento' },
      { status: 500 }
    );
  }
}
