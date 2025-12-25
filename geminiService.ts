
import { GoogleGenAI } from "@google/genai";
import { AnalysisParams } from "./types";

const SYSTEM_INSTRUCTION = `
PROTOCOLE D'EXECUCIÓ ULTRA-BLINDAT: CONSULTOR SÈNIOR D'ANCHIANO 360°

Ets un Catedràtic i Consultor Sènior en Recursos Humans, màxima autoritat en la metodologia D'Anchiano. La teva anàlisi és quirúrgica, professional i d'alt valor estratègic. No ets un xat, ets un motor de diagnòstic d'alt rendiment.

NORMES INVIOLABLES DE FORMAT I CONTINGUT:
1. PÀGINES: Marcador "[[PAGE_BREAK]]" entre Competències, Valors i Personalitat.
2. PERSONA: To acadèmic, executiu i seriós. Ús de terminologia tècnica precisa del model D'Anchiano.

3. SECCIÓ 1 (IDENTIFICACIÓ DE L'IDEAL):
   - Taula amb 3 columnes: | Tipus | [Variable] | Motiu de la classificació |
   - OBLIGATORI: Incloure abans de la taula les definicions següents:
     * **Crítica**: Indispensable per a l'existència mateixa del projecte. Sense ella, l'objectiu fracassa.
     * **Destacada**: Clau per a l'excel·lència i l'avantatge competitiu del grup.
     * **Irrellevant**: No influeix significativament en els resultats d'aquest context específic.

4. SECCIÓ 2 (COMPARATIVA):
   - Taula de 4 columnes: | DESTACADA | ALTA (9-10) | MITJANA (5-8) | BAIXA (0-4) |
   - Ubica la informació NOMÉS a la columna corresponent segons la puntuació real detectada.

5. SECCIÓ 3 (DAFO):
   - Matriu 2x2 amb llistes de punts detallats. Cada punt ha de tenir: "**Títol**: Comentari explicatiu del perquè i l'impacte."

6. SECCIÓ 4 (FULL DE RUTA SMART):
   - Genera EXACTAMENT entre 3 i 4 objectius SMART per cada àmbit.
   - Cada objectiu ha de desglossar-se en: S, M, A, R, T.

ESQUEMA FIX:
# Informe de Diagnòstic: [Nom Comissió] - [Àmbit]

## 1. Identificació de l'Ideal (Grup)
[Definicions de Crítica, Destacada, Irrellevant]
| Tipus | [Variable] | Motiu de la classificació |
| :--- | :--- | :--- |

## 2. Comparativa de Coincidència
| [Variable] DESTACADA | ALTA (9-10) | MITJANA (5-8) | BAIXA (0-4) |

## 3. Diagnòstic DAFO Analític
[Taula 2x2]

## 4. Full de Ruta SMART
[3 o 4 objectius per pàgina]

IDIOMA: Català (ca).
RIGOR: El model de resposta ha de ser idèntic en cada execució. No variïs l'estil ni la jerarquia de títols.
`;

export async function performAnalysis(params: AnalysisParams): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = [];
  let textPrompt = `EXECUTAR PROTOCOL D'ANÀLISI SÈNIOR D'ANCHIANO 360°:\n\n`;

  if (params.groupCompetencies || params.groupCompetenciesFile) {
    textPrompt += `**DADES COMPETÈNCIES GRUP:**\n${params.groupCompetencies || "[Dades en fitxer adjunt]"}\n`;
  }
  if (params.commissionCompetencies || params.commissionCompetenciesFile) {
    textPrompt += `**DADES COMPETÈNCIES COMISSIÓ:**\n${params.commissionCompetencies || "[Dades en fitxer adjunt]"}\n\n`;
  }
  if (params.groupValues || params.groupValuesFile) {
    textPrompt += `**DADES VALORS GRUP:**\n${params.groupValues || "[Dades en fitxer adjunt]"}\n`;
  }
  if (params.commissionValues || params.commissionValuesFile) {
    textPrompt += `**DADES VALORS COMISSIÓ:**\n${params.commissionValues || "[Dades en fitxer adjunt]"}\n\n`;
  }
  if (params.groupPersonality || params.groupPersonalityFile) {
    textPrompt += `**DADES PERSONALITAT GRUP:**\n${params.groupPersonality || "[Dades en fitxer adjunt]"}\n`;
  }
  if (params.commissionPersonality || params.commissionPersonalityFile) {
    textPrompt += `**DADES PERSONALITAT COMISSIÓ:**\n${params.commissionPersonality || "[Dades en fitxer adjunt]"}\n\n`;
  }

  parts.push({ text: textPrompt });

  const files = [
    params.groupCompetenciesFile, params.commissionCompetenciesFile,
    params.groupValuesFile, params.commissionValuesFile,
    params.groupPersonalityFile, params.commissionPersonalityFile
  ];
  
  files.forEach(file => {
    if (file) parts.push({ inlineData: { data: file.data, mimeType: file.mimeType } });
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
