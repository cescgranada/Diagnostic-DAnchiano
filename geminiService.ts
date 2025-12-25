
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
   Abans de la taula, defineix breument les categories segons el Model D'Anchiano:
   - **Crítiques**: Competències imprescindibles i fonamentals per al lloc; sense elles no es pot assolir l'èxit.
   - **Destacades**: Competències que aporten un valor afegit significatiu i que el grup prioritza.
   - **Irrellevants**: Competències que no tenen un impacte necessari en l'execució de les tasques d'aquest context.

   Identifica quines de les 18 competències oficials defineixen el GRUP en una TAULA. 
   IMPORTANT: Per facilitar el colorit visual, utilitza exactament les paraules "CRÍTICA", "DESTACADA" o "IRRELLEVANT" en majúscules a la primera columna.
   
   | Tipus (Grup) | Competència Oficial | Motiu de la classificació |
   | :--- | :--- | :--- |
   | CRÍTICA | [Nom] | [Justificació] |
   | DESTACADA | [Nom] | [Justificació] |
   | IRRELEVANT | [Nom] | [Justificació] |

2. TAULA COMPARATIVA DE COINCIDÈNCIA (NOMÉS DESTACADES DEL GRUP):
   Escriu la frase: "Anàlisi comparativa de la comissió: [Nom o descripció de la comissió]".
   
   Genera una taula de 4 columnes on a la primera columna NOMÉS hi apareguin les competències classificades anteriorment com a "DESTACADA" pel GRUP. Avalua la COMISSIÓ:
   - Coincidència ALTA (>=9): Nota i justificació a la columna 2.
   - Coincidència MITJANA (5-8): Nota i justificació a la columna 3.
   - Coincidència BAIXA (<5): Nota i justificació a la columna 4.
   
   Usa un guió "-" per a les columnes sense valor.

   | Competència DESTACADA (Grup) | Coincidència ALTA (>=9) | Coincidència MITJANA (5-8) | Coincidència BAIXA (<5) |
   | :--- | :--- | :--- | :--- |

3. DIAGNÒSTIC DAFO TRADICIONAL (FORMAT LLISTA):
   Genera una taula 2x2. Dins de cada cel·la, presenta els punts en format llista (usant "-").
   | Fortaleses | Oportunitats |
   | :--- | :--- |
   | - Punt A\n- Punt B | - Punt C\n- Punt D |
   | Debilitats | Amenaces |
   | - Punt E\n- Punt F | - Punt G\n- Punt H |

4. PLA D'ACCIÓ (3 o 4 Objectius SMART):
   Proposa 3 o 4 objectius perquè l'usuari triï. Per a cada un:
   ### Objectiu [Número]: [Títol]
   [Descripció de l'objectiu]
   - **S (Específic)**: Detall de l'acció i competència.
   - **M (Mesurable)**: Indicador.
   - **A (Assolible)**: Realisme.
   - **R (Rellevant)**: Connexió amb Leonardo.
   - **T (Temporitzat)**: Termini.

DIRECTRIUS DE FORMAT:
- No doblis la numeració. Si poses "1.", no posis "1.1." a sota si és el mateix nivell.
- Idioma: Català.
- Sigues extremadament rigorós amb les notes.
`;

export async function performAnalysis(params: AnalysisParams): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = [];
  let textPrompt = `GENERA L'INFORME D'ANCHIANO AMB LES SEGÜENTS DADES:\n\n`;
  textPrompt += `**MODEL GRUP (IDEAL):**\n${params.groupProfile || "Consulta els documents."}\n\n`;
  textPrompt += `**COMISSIÓ ACTUAL (REALITAT):**\n${params.commissionProfile || "Consulta els documents."}\n\n`;
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
    return response.text || "Informe no generat.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("S'ha produït un error de connexió amb l'IA.");
  }
}
