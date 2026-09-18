import { firebaseConfig } from './firebase';

const STORAGE_KEY_GEMINI_API = 'studypulse_gemini_api_key';

// Supported Gemini models ordered by priority with automatic fallback switching
const GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-1.5-flash-latest',
];

export function getStoredGeminiApiKey(): string {
  const localKey = localStorage.getItem(STORAGE_KEY_GEMINI_API);
  if (localKey && localKey.trim()) {
    return localKey.trim();
  }
  return (
    (import.meta.env.VITE_GEMINI_API_KEY as string) ||
    (import.meta.env.VITE_FIREBASE_API_KEY as string) ||
    firebaseConfig.apiKey ||
    ''
  );
}

export function saveGeminiApiKey(key: string): void {
  if (key && key.trim()) {
    localStorage.setItem(STORAGE_KEY_GEMINI_API, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_GEMINI_API);
  }
}

export interface GeminiApiError {
  isApiDisabled?: boolean;
  activationUrl?: string;
  message: string;
}

export interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    code?: number;
    message?: string;
    status?: string;
    details?: Array<{
      metadata?: {
        activationUrl?: string;
        service?: string;
      };
    }>;
  };
}

async function callGeminiApi(prompt: string, temperature = 0.4): Promise<{ text: string; error?: GeminiApiError }> {
  const apiKey = getStoredGeminiApiKey();
  let lastError: GeminiApiError | undefined = undefined;

  for (const model of GEMINI_MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // 10-second AbortController timeout per model attempt
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature, maxOutputTokens: 2000 },
        }),
      });

      clearTimeout(timeoutId);
      const data: GeminiResponse = await res.json();

      if (res.ok && !data.error) {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) {
          return { text: text.trim() };
        }
      }

      if (data.error) {
        const errObj = data.error;
        const code = errObj?.code || res.status;
        const isApiDisabled = errObj?.message?.includes('disabled') || errObj?.status === 'PERMISSION_DENIED' || code === 403;
        const isHighDemand = code === 503 || errObj?.status === 'UNAVAILABLE' || errObj?.message?.includes('high demand');
        const isNotFound = code === 404 || errObj?.status === 'NOT_FOUND' || errObj?.message?.includes('not found');

        const activationUrl =
          errObj?.details?.[0]?.metadata?.activationUrl ||
          'https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=124383331241';

        lastError = {
          isApiDisabled,
          activationUrl,
          message: isHighDemand
            ? `Gemini model ${model} experiencing high demand. Auto-switching model...`
            : errObj?.message || `Gemini API model ${model} returned status ${res.status}`,
        };

        // If API is disabled or permission denied, stop and prompt user to configure key/enable API
        if (isApiDisabled) {
          return { text: '', error: lastError };
        }

        // If model failed (404, 503, 429 rate limit, 500 server error): automatically switch to next model candidate!
        if (isNotFound || isHighDemand || code === 429 || code >= 500) {
          if (isHighDemand) {
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
          continue;
        }
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      const isTimeout = err.name === 'AbortError' || err.message?.includes('aborted');
      lastError = {
        message: isTimeout
          ? `Gemini model ${model} did not respond within 10 seconds. Auto-switching to next model...`
          : err.message || `Failed to reach Gemini API model ${model}`,
      };
      // Continue to try next model candidate in GEMINI_MODELS
      continue;
    }
  }

  return { text: '', error: lastError };
}

/**
 * Check grammar and enhance text using Gemini AI model
 */
export async function checkGrammarAndEnhance(text: string): Promise<{ text: string; error?: GeminiApiError }> {
  if (!text.trim()) return { text };

  const prompt = `You are a professional software engineering writer. 
Please review, fix all grammar/spelling errors, and polish the style of the following LinkedIn post text.
Keep all code snippets, technical terms, and hashtags intact. Make the formatting look clean with bullet points and line breaks.

Text to fix:
${text}`;

  const res = await callGeminiApi(prompt, 0.3);
  return {
    text: res.text || text,
    error: res.error,
  };
}

/**
 * Generate complete AI post with Gemini based on topic context
 */
export async function generateAILinkedInPost(params: {
  title: string;
  category: string;
  takeaways: string[];
  code?: string;
  gotchas?: string[];
  tone?: string;
}): Promise<{ text: string; error?: GeminiApiError }> {
  const { title, category, takeaways, code, gotchas, tone = 'insights' } = params;

  const prompt = `You are an expert developer content creator. Write an engaging, well-formatted LinkedIn post sharing what was learned today.

Context:
- Topic Title: "${title}"
- Category: ${category}
- Key Takeaways: ${takeaways.join('; ')}
${code ? `- Code/Cheat Sheet: \n\`\`\`\n${code}\n\`\`\`\n` : ''}
${gotchas && gotchas.length > 0 ? `- Pitfalls/Gotchas: ${gotchas.join('; ')}` : ''}
- Requested Tone: ${tone}

Formatting instructions:
1. Start with an eye-catching headline emoji.
2. Provide a 1-2 sentence hook about why this topic matters.
3. List key takeaways using clear bullet points (📌, •).
4. Include code block if provided.
5. End with an open-ended engagement question (👉) and 4-5 relevant tech hashtags (including #StudyPulse #100DaysOfCode).
6. Do NOT wrap the entire response in outer quote marks. Output pure text ready to post.`;

  return await callGeminiApi(prompt, 0.7);
}
