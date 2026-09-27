import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json({ limit: '50mb' }));

// Safe initialization of GoogleGenAI SDK with server-side environment key
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI(apiKey ? { apiKey } : undefined);

// -------------------------------------------------------------
// 1. GEMINI MULTI-TURN CHATBOT (Elena, Shadow, Script Director)
// -------------------------------------------------------------
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, role = 'director', model = 'gemini-3.5-flash' } = req.body;

    const roleSystemInstructions: Record<string, string> = {
      queen: `You are Elena, also known as "The Queen", the formidable female boss and mastermind from the dark mafia romance story "The Queen & The Shadow".
Character background: You were hired at 24 as the syndicate's sharpest accountant. Armed with patience, razor-sharp intellect, and ledgers, you dismantled a 15-year tyrannical regime and now rule the city alongside your enforcer, The Shadow.
Tone & Persona: Calm, calculating, silky, fearless, possessing effortless executive power. You speak with quiet authority and an occasional razor-sharp smirk. You value loyalty above all and despise recklessness. Respond in-character.`,

      shadow: `You are "The Shadow", the lethal male gangster, enforcer, and loyal protector from "The Queen & The Shadow".
Character background: Raised by the syndicate since age twelve with no name, file, or past. You were ordered to eliminate Elena, but she showed you the truth and gave you a choice. You chose to protect her and rule by her side.
Tone & Persona: Deep, stoic, dangerous, quiet, intensely protective of Elena. You speak with absolute economy of words. You scan exits and eliminate threats before they materialize. Respond in-character.`,

      director: `You are the Lead Mafia Romance Screenwriter & Cinematic Showrunner for "The Queen & The Shadow — Origin Story".
Your specialty: Dark romance, mafia thrillers, cinematic pacing, high-retention YouTube storytelling, character dynamics, dialogue punch-up, and visual motifs (red heels on marble, the gold watch, lowered weapons, rain-slicked city skylines).
Assist the user with screenplay expansions, dialogue beats, scene direction, character motivations, and production strategies.`,

      fast: `You are a high-speed screenplay assistant for "The Queen & The Shadow". Provide rapid, concise creative answers and dialogue polish.`
    };

    const systemInstruction = roleSystemInstructions[role] || roleSystemInstructions.director;
    const selectedModel = role === 'fast' ? 'gemini-3.1-flash-lite' : (model || 'gemini-3.5-flash');

    // Format chat contents
    const contents = (messages || []).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || 'Silence lingers in the room.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate response.' });
  }
});

// -------------------------------------------------------------
// 2. SEARCH GROUNDING (gemini-3.5-flash with googleSearch tool)
// -------------------------------------------------------------
app.post('/api/search-grounding', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Perform up-to-date research relevant to cinematic mafia storytelling, dark romance tropes, or production trends for: "${query}". Provide grounded facts, citations, and creative applications.`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || '';
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata || null;

    res.json({ text, groundingMetadata });
  } catch (error: any) {
    console.error('Search grounding error:', error);
    res.status(500).json({ error: error.message || 'Failed to search.' });
  }
});

// -------------------------------------------------------------
// 3. MAPS GROUNDING (gemini-3.5-flash with googleMaps tool)
// -------------------------------------------------------------
app.post('/api/maps-grounding', async (req: Request, res: Response) => {
  try {
    const { locationQuery } = req.body;
    if (!locationQuery) {
      return res.status(400).json({ error: 'locationQuery is required.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Find real-world geographical details, architectural landmarks, atmospheric city quarters, or coordinates for cinematic mafia film staging in: "${locationQuery}". Ground with Google Maps details.`,
      config: {
        tools: [{ googleMaps: {} }],
      }
    });

    const text = response.text || '';
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata || null;

    res.json({ text, groundingMetadata });
  } catch (error: any) {
    console.error('Maps grounding error:', error);
    res.status(500).json({ error: error.message || 'Failed to ground maps location.' });
  }
});

// -------------------------------------------------------------
// 4. AUDIO TRANSCRIPTION (gemini-3.5-transcribe)
// -------------------------------------------------------------
app.post('/api/transcribe', async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 is required.' });
    }

    const audioPart = {
      inlineData: {
        mimeType,
        data: audioBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: { 
        parts: [
          audioPart, 
          { text: 'Transcribe this spoken audio accurately for a mafia romance screenplay.' }
        ] 
      },
    });

    res.json({ transcription: response.text || '' });
  } catch (error: any) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: error.message || 'Failed to transcribe audio.' });
  }
});

// -------------------------------------------------------------
// 5. CREATE & EDIT IMAGES (gemini-3.1-flash-image / lite-image)
// -------------------------------------------------------------
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const { prompt, base64Image, mimeType = 'image/jpeg', aspectRatio = '1:1' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const fullPrompt = `${prompt}. Dark mafia romance noir aesthetic, cinematic film lighting, luxury anime manhwa art style, color palette of black, charcoal, crimson red, and champagne gold.`;

    const parts: any[] = [];
    if (base64Image) {
      parts.push({
        inlineData: {
          data: base64Image,
          mimeType,
        }
      });
    }
    parts.push({ text: fullPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as '1:1' | '16:9' | '9:16',
        }
      }
    });

    let generatedImageUrl: string | null = null;
    let descriptionText = '';

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      } else if (part.text) {
        descriptionText += part.text;
      }
    }

    res.json({ imageUrl: generatedImageUrl, text: descriptionText });
  } catch (error: any) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: error.message || 'Image generation failed.' });
  }
});

// -------------------------------------------------------------
// 6. VEO VIDEO GENERATION (veo-3.1-lite-generate-preview)
// -------------------------------------------------------------
app.post('/api/generate-video', async (req: Request, res: Response) => {
  try {
    const { prompt, imageBase64, mimeType = 'image/png', aspectRatio = '16:9' } = req.body;

    const payload: any = {
      model: 'veo-3.1-lite-generate-preview',
      prompt: prompt || 'Cinematic slow camera movement in a dark mafia romance setting, rain on glass, film noir lighting.',
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
      }
    };

    if (imageBase64) {
      payload.image = {
        imageBytes: imageBase64,
        mimeType,
      };
    }

    const operation = await ai.models.generateVideos(payload);
    res.json({ operationName: operation.name });
  } catch (error: any) {
    console.error('Veo video generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to start video generation.' });
  }
});

app.post('/api/video-status', async (req: Request, res: Response) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required.' });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    res.json({ done: updated.done || false });
  } catch (error: any) {
    console.error('Video status error:', error);
    res.status(500).json({ error: error.message || 'Failed to check status.' });
  }
});

app.post('/api/video-download', async (req: Request, res: Response) => {
  try {
    const { operationName } = req.body;
    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;

    if (!uri) {
      return res.status(404).json({ error: 'Video URI not found.' });
    }

    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': apiKey },
    });

    res.setHeader('Content-Type', 'video/mp4');
    videoRes.body!.pipeTo(
      new WritableStream({
        write(chunk) { res.write(chunk); },
        close() { res.end(); },
      })
    );
  } catch (error: any) {
    console.error('Video download error:', error);
    res.status(500).json({ error: error.message || 'Failed to download video.' });
  }
});

// -------------------------------------------------------------
// 7. MUSIC GENERATION (lyria-3-clip-preview)
// -------------------------------------------------------------
app.post('/api/generate-music', async (req: Request, res: Response) => {
  try {
    const { prompt = 'Cinematic dark mafia romance orchestral strings with rain ambience and noir piano.' } = req.body;

    const response = await ai.models.generateContentStream({
      model: 'lyria-3-clip-preview',
      contents: prompt,
    });

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    res.json({ audioBase64, mimeType, lyrics });
  } catch (error: any) {
    console.error('Music generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate music.' });
  }
});

// -------------------------------------------------------------
// 8. VOICE SYNTHESIS (gemini-3.8-flash-lite-tts)
// -------------------------------------------------------------
app.post('/api/generate-speech', async (req: Request, res: Response) => {
  try {
    const { text, persona = 'queen' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required.' });
    }

    const voiceName = persona === 'shadow' ? 'Fenrir' : persona === 'queen' ? 'Kore' : 'Puck';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [{ text }],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    res.json({ base64Audio });
  } catch (error: any) {
    console.error('Speech generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate speech.' });
  }
});

// -------------------------------------------------------------
// VITE SPA MIDDLEWARE MOUNT
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
