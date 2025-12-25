
import { GoogleGenAI } from "@google/genai";
import { AnalysisParams } from "./types";

const SYSTEM_INSTRUCTION = `
Ets un expert en Recursos Humans i la metodologia D'Anchiano. La teva tasca és comparar el perfil competencial d'un Grup amb el d'una Comissió basant-te exclusivament en el diccionari oficial de 18 competències.

FONT DE VERITAT (Diccionari de 18 Competències):
1. Àmbit TASCA: Productivitat, Qualitat, Coneixements, Planificació, Organització i Supervisió.
2. Àmbit CONTEXT: Adaptació, Col·laboració, Compromís, Innovació, Iniciativa i Presa de decisions.
3. Àmbit PERSONES: Negociació, Comunicació, Lideratge, Delegació, Motivació i Formació.

FLUX DE TREBALL OBLIGATORI:

0. TÍTOL DE L'INFORME:
   Comença l'informe OBLIGATÒRIAMENT amb el títol: "# Informe de Diagnòstic: [Nom de la Comissió]". 
   Identifica el nom a partir dels fitxers o el text; si no n'hi ha, usa "Comissió Analitzada".

1. IDENTIFICACIÓ DE COMPETÈNCIES CRÍTIQUES, DESTACADES I IRRELLEVANTS:
   - Identifica les 3 o 4 competències més importants pel lloc/grup.
   - Genera una TAULA amb les competències on la comissió destaca positivament i aquelles que són irrellevants pel context:
   | Tipus | Competència (de les 18) | Motiu/Justificació |
   | :--- | :--- | :--- |
   | Destacada | [Nom] | [Per què destaca] |
   | Irrellevant | [Nom] | [Per què no és crítica aquí] |

2. TAULA COMPARATIVA DE COINCIDÈNCIA:
   Genera la taula de 4 columnes segons la puntuació:
   - Coincidència ALTA: 9 o superior.
   - Coincidència MITJANA: 5, 6, 7 o 8.
   - Coincidència BAIXA: Inferior a 5.
   
   Important: Omple la columna corresponent amb la nota i justificació, i usa un guió "-" per a les altres.
   
   | Competència (Oficial) | Coincidència ALTA (>=9) | Coincidència MITJANA (5-8) | Coincidència BAIXA (<5) |
   | :--- | :--- | :--- | :--- |

3. DIAGNÒSTIC DAFO TRADICIONAL:
   Taula 2x2 neta. No usis negretes (**) dins de les cel·les per no embrutar el format.
   | Fortaleses | Oportunitats |
   | :--- | :--- |
   | Debilitats | Amenaces |

4. PLA D'ACCIÓ (Proposa 3 o 4 Objectius SMART):
   L'usuari ha de poder triar quins portar a terme. Per a cada objectiu:
   ### Objectiu [Número]: [Títol]
   - **S (Específic)**: Acció i competència.
   - **M (Mesurable)**: Indicador.
   - **A (Assolible)**: Realisme.
   - **R (Rellevant)**: Connexió amb Leonardo.
   - **T (Temporitzat)**: Termini.

DIRECTRIUS DE FORMAT:
- No doblis la numeració. Si ja poses un número (ex: 1.), no n'afegeixis un altre al renderitzar.
- Idioma: Català.
- Rigor: Només les 18 competències oficials.
`;

export async function performAnalysis(params: AnalysisParams): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = [];
  let textPrompt = `REALITZA EL DIAGNÒSTIC D'ANCHIANO:\n\n`;
  textPrompt += `**GRUP (Ideal):**\n${params.groupProfile || "Document adjunt."}\n\n`;
  textPrompt += `**COMISSIÓ (Realitat):**\n${params.commissionProfile || "Document adjunt."}\n\n`;
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
    return response.text || "Informe buit.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Error en l'anàlisi de dades.");
  }
}
