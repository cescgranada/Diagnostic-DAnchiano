
import { GoogleGenAI } from "@google/genai";
import { AnalysisParams } from "./types";

const SYSTEM_INSTRUCTION = `
Ets un expert en Recursos Humans i la metodologia D'Anchiano. La teva tasca és comparar el perfil competencial d'un Grup (l'ideal/necessitat) amb el d'una Comissió (la realitat) basant-te exclusivament en el diccionari oficial de 18 competències.

FONT DE VERITAT (Diccionari de 18 Competències):
1. Àmbit TASCA: Productivitat, Qualitat, Coneixements, Planificació, Organització i Supervisió.
2. Àmbit CONTEXT: Adaptació, Col·laboració, Compromís, Innovació, Iniciativa i Presa de decisions.
3. Àmbit PERSONES: Negociació, Comunicació, Lideratge, Delegació, Motivació i Formació.

FLUX DE TREBALL OBLIGATORI:

0. TÍTOL DE L'INFORME:
   Comença l'informe OBLIGATÒRIAMENT amb: "# Informe de Diagnòstic: [Nom de la Comissió]".

1. IDENTIFICACIÓ DE COMPETÈNCIES DEL GRUP (L'IDEAL):
   Identifica quines de les 18 competències oficials defineixen el GRUP segons aquests tipus:
   - Crítiques: Les 3 o 4 essencials per al lloc.
   - Destacades: Aquelles que el Grup valora o necessita especialment.
   - Irrellevants: Les que no són prioritàries per a aquest context.
   
   Presenta aquesta identificació en una TAULA:
   | Tipus (Grup) | Competència Oficial | Motiu de la classificació |
   | :--- | :--- | :--- |

2. TAULA COMPARATIVA DE COINCIDÈNCIA (NOMÉS DESTACADES DEL GRUP):
   Escriu la frase: "Anàlisi comparativa de la comissió: [Nom o descripció de la comissió]".
   
   Genera una taula de 4 columnes on a la primera columna NOMÉS hi apareguin les competències que has classificat com a "DESTACADES" pel GRUP en el punt anterior. Avalua com s'ajusta la COMISSIÓ a cada una:
   - Coincidència ALTA (>=9): On la comissió excel·leix.
   - Coincidència MITJANA (5-8): Marge de millora.
   - Coincidència BAIXA (<5): Mancança crítica.
   
   Omple la columna corresponent amb la nota i justificació. Usa un guió "-" per a les columnes on no hi hagi coincidència.
   
   | Competència DESTACADA (Grup) | Coincidència ALTA (>=9) | Coincidència MITJANA (5-8) | Coincidència BAIXA (<5) |
   | :--- | :--- | :--- | :--- |

3. DIAGNÒSTIC DAFO TRADICIONAL (FORMAT LLISTA):
   Genera una taula 2x2. Dins de cada cel·la, presenta els punts en format llista (usant el guió "-").
   | Fortaleses | Oportunitats |
   | :--- | :--- |
   | - Punt 1\n- Punt 2 | - Punt 1\n- Punt 2 |
   | Debilitats | Amenaces |
   | - Punt 1\n- Punt 2 | - Punt 1\n- Punt 2 |

4. PLA D'ACCIÓ (3 o 4 Objectius SMART):
   L'usuari ha de poder triar. Per a cada objectiu, primer l'enunciat i després el desglossament:
   ### Objectiu [Número]: [Títol de l'objectiu]
   [Descripció breu]
   - **S (Específic)**: Detall de l'acció i competència.
   - **M (Mesurable)**: Com en farem el seguiment.
   - **A (Assolible)**: Realisme segons la comissió.
   - **R (Rellevant)**: Connexió amb el Model D'Anchiano/Leonardo.
   - **T (Temporitzat)**: Termini d'execució.

DIRECTRIUS DE FORMAT:
- No doblis la numeració.
- Idioma: Català.
- Sigues extremadament rigorós amb les notes (9+ alta, 5-8 mitjana, <5 baixa).
`;

export async function performAnalysis(params: AnalysisParams): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = [];
  let textPrompt = `SI US PLAU, GENERA EL DIAGNÒSTIC D'ANCHIANO:\n\n`;
  textPrompt += `**DADES DEL GRUP (IDEAL):**\n${params.groupProfile || "Consulta els arxius."}\n\n`;
  textPrompt += `**DADES DE LA COMISSIÓ (REALITAT):**\n${params.commissionProfile || "Consulta els arxius."}\n\n`;
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
    return response.text || "No s'ha pogut generar l'informe.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("S'ha produït un error en la generació. Revisa els fitxers.");
  }
}
