
import { GoogleGenAI } from "@google/genai";
import { AnalysisParams } from "./types";

const SYSTEM_INSTRUCTION = `
PROTOCOLE D'EXECUCIÓ BLINDAT: ANALISTA D'ANCHIANO 360°

Ets un algoritme de diagnòstic de Recursos Humans programat sota el Model D'Anchiano. No tens permís per variar l'estructura de sortida. Cada informe ha de ser un mirall de l'anterior per permetre comparatives temporals o entre comissions.

NORMES DE BLINDATGE ESTRUCTURAL:
1. DIVISIÓ PER PÀGINES: Utilitza OBLIGATÒRIAMENT el marcador "[[PAGE_BREAK]]" per separar l'informe en tres blocs: Competències, Valors i Personalitat.
2. SELECCIÓ DE VARIABLES: A la "Taula Comparativa de Coincidència", selecciona exactament les 3 o 4 característiques que el Grup ha definit com a DESTACADES més rellevants per a l'èxit del projecte.
3. DAFO DETALLAT: Cada punt de la matriu DAFO ha de ser una llista on cada element porti un comentari analític pertinent (per exemple: "- **Iniciativa**: Tot i ser alta al grup, la comissió no la manifesta per por al risc, la qual cosa frena la innovació").
4. SMART EXHAUSTIU: Cada objectiu SMART s'ha de desgranar lletra per lletra (S, M, A, R, T) explicant l'acció específica, la mètrica, la viabilitat, la rellevància segons D'Anchiano i el termini.

ESQUEMA FIX PER PÀGINA (ÀMBIT):
# Informe de Diagnòstic: [Nom Comissió] - [Àmbit]

## 1. Identificació de l'Ideal (Grup)
[Taula amb tipus (Crítica/Destacada/Irrellevant), Característica i Motiu]

## 2. Comparativa de Coincidència
[Taula comparativa de les 3-4 variables destacades triades]

## 3. Diagnòstic DAFO Analític
| Fortaleses | Oportunitats |
| :--- | :--- |
| [Llista amb comentaris] | [Llista amb comentaris] |
| Debilitats | Amenaces |
| [Llista amb comentaris] | [Llista amb comentaris] |

## 4. Full de Ruta SMART
### Objectiu [X]: [Títol]
- **S (Específic)**: [Detall]
- **M (Mesurable)**: [Detall]
- **A (Assolible)**: [Detall]
- **R (Rellevant)**: [Detall]
- **T (Temporitzat)**: [Detall]

DIRECTRIUS DE RIGOR:
- Idioma: Català (ca).
- Si un àmbit no té dades (ex. no s'han pujat arxius de personalitat), escriu: "Àmbit no analitzat: Falten dades de Grup o Comissió per a la comparativa".
- Manté un to professional, acadèmic i executiu.
`;

export async function performAnalysis(params: AnalysisParams): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = [];
  let textPrompt = `PROTOCOL BLINDAT D'ANÀLISI 360°:\n\n`;

  // Competències
  if (params.groupCompetencies || params.groupCompetenciesFile) {
    textPrompt += `**DADES COMPETÈNCIES GRUP:**\n${params.groupCompetencies || "[Dades en fitxer adjunt]"}\n`;
  }
  if (params.commissionCompetencies || params.commissionCompetenciesFile) {
    textPrompt += `**DADES COMPETÈNCIES COMISSIÓ:**\n${params.commissionCompetencies || "[Dades en fitxer adjunt]"}\n\n`;
  }

  // Valors
  if (params.groupValues || params.groupValuesFile) {
    textPrompt += `**DADES VALORS GRUP:**\n${params.groupValues || "[Dades en fitxer adjunt]"}\n`;
  }
  if (params.commissionValues || params.commissionValuesFile) {
    textPrompt += `**DADES VALORS COMISSIÓ:**\n${params.commissionValues || "[Dades en fitxer adjunt]"}\n\n`;
  }

  // Personalitat
  if (params.groupPersonality || params.groupPersonalityFile) {
    textPrompt += `**DADES PERSONALITAT GRUP:**\n${params.groupPersonality || "[Dades en fitxer adjunt]"}\n`;
  }
  if (params.commissionPersonality || params.commissionPersonalityFile) {
    textPrompt += `**DADES PERSONALITAT COMISSIÓ:**\n${params.commissionPersonality || "[Dades en fitxer adjunt]"}\n\n`;
  }

  parts.push({ text: textPrompt });

  // Adjuntar fitxers si n'hi ha
  const files = [
    params.groupCompetenciesFile, params.commissionCompetenciesFile,
    params.groupValuesFile, params.commissionValuesFile,
    params.groupPersonalityFile, params.commissionPersonalityFile
  ];
  
  files.forEach(file => {
    if (file) {
      parts.push({
        inlineData: {
          data: file.data,
          mimeType: file.mimeType
        }
      });
    }
  });

  try {
    const response = await ai.models.generateContent({
      model: params.model,
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: params.temperature,
      },
    });
    return response.text || "No s'ha obtingut cap anàlisi.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("S'ha produït un error crític en l'execució del protocol D'Anchiano.");
  }
}
