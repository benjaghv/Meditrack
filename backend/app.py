from fastapi import FastAPI
from transformers import pipeline
from pydantic import BaseModel

app = FastAPI()

# Cargar el modelo de Hugging Face
# Usamos un modelo gratuito para diagnósticos médicos
model = pipeline("text-classification", model="finiteautomata/bertweet-base-sentiment-analysis")

class DiagnosisRequest(BaseModel):
    symptoms: str
    previous_treatments: str

class TreatmentRequest(BaseModel):
    treatment: str

@app.post("/diagnose")
async def diagnose(request: DiagnosisRequest):
    # Aquí iría la lógica de diagnóstico
    # Por ahora, devolvemos una respuesta simple
    response = {
        "diagnoses": [
            {
                "name": "Posible Diagnóstico",
                "probability": "Alta",
                "treatments": [
                    {
                        "name": "Tratamiento sugerido",
                        "type": "Con receta",
                        "description": "Descripción del tratamiento"
                    }
                ]
            }
        ]
    }
    return response

@app.post("/treatment")
async def analyze_treatment(request: TreatmentRequest):
    # Análisis del tratamiento usando el modelo
    result = model(request.treatment)[0]
    
    response = {
        "analysis": {
            "sentiment": result["label"],
            "confidence": result["score"],
            "recommendation": "Recomendación basada en el análisis"
        }
    }
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
