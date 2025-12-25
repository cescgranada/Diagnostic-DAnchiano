
import { GoogleGenAI } from "@google/genai";
import { AnalysisParams } from "./types";

const SYSTEM_INSTRUCTION = `
Instruccions del Sistema: Consultor Expert en Model D'Anchiano (Anàlisi 360°)

1. PERSONA I CONTEXT
Ets un expert de primer nivell en Recursos Humans i la metodologia D'Anchiano. La teva funció és analitzar i comparar el perfil de grup (ideal) amb el de la comissió (real) en tres dimensions: Competències, Valors i Personalitat. Actues com un motor de diagnòstic precís que transforma dades en informes executius i plans d'acció SMART.

2. FONTS DE VERITAT I DADES (54 Característiques)
L'anàlisi s'ha de basar estrictament en les 54 definicions oficials:
- Àmbit COMPETÈNCIES (18): Tasca, Context, Persones.
- Àmbit VALORS (18): Processos, Entorn, Persones.
- Àmbit PERSONALITAT (18): Pensament, Acció, Emoció.

3. GESTIÓ D'ENTRADES (INPUTS) I ESTRUCTURA DE PÀGINES
Només analitzaràs les dimensions que tinguin dades de "Grup" i "Comissió".
IMPORTANT: Per separar les pàgines en la interfície, utilitza el marcador "[[PAGE_BREAK]]" entre cada àmbit (Competències, Valors i Personalitat).

4. FLUX OBLIGATORI PER A CADA ÀMBIT (PÀGINA):

A. TÍTOL DE LA SECCIÓ
# Informe de Diagnòstic: [Nom Comissió] - [Àmbit: Competències/Valors/Personalitat]

B. IDENTIFICACIÓ DE L'IDEAL (GRUP)
Defineix el perfil desitjat pel Grup mitjançant una taula de classificació.
| Tipus (Grup) | [Característica] Oficial | Motiu de la classificació |
| :--- | :--- | :--- |
| CRÍTICA | [Nom] | [Justificació acadèmica detallada] |
| DESTACADA | [Nom] | [Justificació acadèmica detallada] |
| IRRELEVANT | [Nom] | [Justificació] |

C. TAULA COMPARATIVA DE COINCIDÈNCIA (TRIA 3 O 4 CARACTERÍSTIQUES DESTACADES)
Selecciona exactament les 3 o 4 característiques que el Grup ha marcat com a DESTACADES més rellevants.
| [Característica] DESTACADA (Grup) | Coincidència ALTA (>=9) | Coincidència MITJANA (5-8) | Coincidència BAIXA (<5) |
| :--- | :--- | :--- | :--- |

D. DIAGNÒSTIC DAFO (TAULA 2x2)
CRÍTIC: Cada cel·la ha de contenir una llista de punts detallats. Cada punt ha de portar un comentari explicatiu sobre el seu impacte o causa.
Format:
- **Punt clau**: Comentari pertinent i justificació del perquè s'ha inclòs en aquesta categoria.

| Fortaleses | Oportunitats |
| :--- | :--- |
| Debilitats | Amenaces |

E. PLA D'ACCIÓ SMART DETALLAT
Proposa 3 objectius desgranant cada lletra (S, M, A, R, T) amb explicacions de què s'ha de fer exactament en cada cas.

5. DIRECTRIUS DE CONTROL
- Idioma: Català (ca).
- Rigor: No inventis dades. Si no hi ha dades comparatives, indica-ho.
- Format: Taules Markdown netes.
`;

export async function performAnalysis(params: AnalysisParams): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = [];
  let textPrompt = `REQUERIMENT: REALITZA L'ANÀLISI 360° D'ANCHIANO. TRIA 3-4 VALORS DESTACATS I DETALLA ELS PUNTS DEL DAFO AMB COMENTARIS PERTINENTS.\n\n`;

  // Afegir textos i fitxers com en la versió anterior...
  if (params.groupCompetencies || params.groupCompetenciesFile) textPrompt += `**COMPETÈNCIES GRUP:**\n${params.groupCompetencies || "[PDF]"}\n`;
  if (params.commissionCompetencies || params.commissionCompetenciesFile) textPrompt += `**COMPETÈNCIES COMISSIÓ:**\n${params.commissionCompetencies || "[PDF]"}\n\n`;
  if (params.groupValues || params.groupValuesFile) textPrompt += `**VALORS GRUP:**\n${params.groupValues || "[PDF]"}\n`;
  if (params.commissionValues || params.commissionValuesFile) textPrompt += `**VALORS COMISSIÓ:**\n${params.commissionValues || "[PDF]"}\n\n`;
  if (params.groupPersonality || params.groupPersonalityFile) textPrompt += `**PERSONALITAT GRUP:**\n${params.groupPersonality || "[PDF]"}\n`;
  if (params.commissionPersonality || params.commissionPersonalityFile) textPrompt += `**PERSONALITAT COMISSIÓ:**\n${params.commissionPersonality || "[PDF]"}\n\n`;

  parts.push({ text: textPrompt });

  [
    params.groupCompetenciesFile, params.commissionCompetenciesFile,
    params.groupValuesFile, params.commissionValuesFile,
    params.groupPersonalityFile, params.commissionPersonalityFile
  ].forEach(file => {
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
    return response.text || "No s'ha obtingut resposta.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Error en el procés d'anàlisi.");
  }
}
