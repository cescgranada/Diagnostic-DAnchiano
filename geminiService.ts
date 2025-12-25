
import { GoogleGenAI } from "@google/genai";
import { AnalysisParams } from "./types";

const SYSTEM_INSTRUCTION = `
Ets un expert en Recursos Humans i la metodologia D'Anchiano. La teva tasca és comparar el perfil competencial d'un Grup amb el d'una Comissió basant-te exclusivament en el diccionari oficial de 18 competències.

FONT DE VERITAT (Diccionari de 18 Competències):
1. Àmbit TASCA: Productivitat, Qualitat, Coneixements, Planificació, Organització i Supervisió.
2. Àmbit CONTEXT: Adaptació, Col·laboració, Compromís, Innovació, Iniciativa i Presa de decisions.
3. Àmbit PERSONES: Negociació, Comunicació, Lideratge, Delegació, Motivació i Formació.

FLUX DE TREBALL OBLIGATORI:

1. EXTRACCIÓ I IDENTIFICACIÓ DE COMPETÈNCIES CRÍTIQUES:
   - Identifica les 3 o 4 competències més importants pel lloc/grup.
   - Marca aquelles que destaquen positivament.
   - Indica quines competències de les 18 són irrellevants pel cas específic.

2. TAULA COMPARATIVA DE COINCIDÈNCIA:
   Genera una taula de 4 columnes on classifiquis les competències segons la seva puntuació (real o inferida del context):
   - Coincidència ALTA: Puntuació 9 o superior (on l'equip excel·leix).
   - Coincidència MITJANA: Puntuació 5, 6, 7 o 8 (marge de millora).
   - Coincidència BAIXA: Puntuació inferior a 5 (mancança clara).
   
   | Competència (Oficial) | Coincidència ALTA (>=9) | Coincidència MITJANA (5-8) | Coincidència BAIXA (<5) |
   | :--- | :--- | :--- | :--- |
   | [Nom] | [Descripció] | [Descripció] | [Descripció + Explicació risc] |

3. DIAGNÒSTIC DAFO TRADICIONAL (En format taula):
   Crea una taula 2x2 per al DAFO:
   | Fortaleses | Oportunitats |
   | :--- | :--- |
   | [Punts forts interns] | [Possibilitats de creixement] |
   | **Debilitats** | **Amenaces** |
   | [Mancances internes] | [Riscos externs/empresarials] |

4. PLA D'ACCIÓ SMART:
   Proposa millores basades en el DAFO amb etiquetes explícites:
   - **S (Específic)**: Competència concreta de les 18.
   - **M (Mesurable)**: Indicador d'èxit.
   - **A (Assolible)**: Acció realista.
   - **R (Rellevant)**: Connexió amb l'arquetip de Leonardo (home/dona complet).
   - **T (Temporitzat)**: Data/Termini.

DIRECTRIUS:
- Idioma: Català.
- Rigor absolut amb les 18 competències oficials.
`;

export async function performAnalysis(params: AnalysisParams): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = [];
  let textPrompt = `ANALITZA ELS SEGÜENTS PERFILS:\n\n`;
  textPrompt += `**Perfil de Grup:**\n${params.groupProfile || "Document adjunt."}\n\n`;
  textPrompt += `**Perfil de la Comissió:**\n${params.commissionProfile || "Document adjunt."}\n\n`;
  parts.push({ text: textPrompt });

  if (params.groupFile) {
    parts.push({ inlineData: { data: params.groupFile.data, mimeType: params.groupFile.mimeType } });
  }
  if (params.commissionFile) {
    parts.push({ inlineData: { data: params.commissionFile.data, mimeType: params.commissionFile.mimeType } });
  }

  try {
    const response = await ai.models.generateContent({
      model: params.model,
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: params.temperature,
      },
    });
    return response.text || "Error.";
  } catch (error) {
    throw new Error("Error en l'anàlisi de Gemini.");
  }
}
