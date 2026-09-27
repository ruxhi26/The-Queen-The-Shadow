import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, MessageSquare, Search, MapPin, Video, Image as ImageIcon, 
  Mic, Music, Sparkles, Send, Loader2, Play, Pause, Download, 
  Upload, Copy, Check, RefreshCw, Crown, Shield, Film, User, LogIn, LogOut
} from 'lucide-react';
import { auth, signInWithGoogle, logOut, db } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

// Motif reference images for quick video generation / editing
import queenCloseup from '../assets/images/queen_closeup_1790494082144.jpg';
import shadowCloseup from '../assets/images/shadow_closeup_1790494098828.jpg';
import redHeelsMarble from '../assets/images/red_heels_marble_1790494524913.jpg';
import goldWatchBlazer from '../assets/images/gold_watch_blazer_1790494542906.jpg';
import citySkylineNight from '../assets/images/city_skyline_night_1790494556702.jpg';
import handgunLedger from '../assets/images/handgun_ledger_motif_1790494587487.jpg';

export type GeminiToolMode = 'chat' | 'search' | 'maps' | 'veo' | 'images' | 'transcribe' | 'music';

export const GeminiStudioHub: React.FC = () => {
  const [activeMode, setActiveMode] = useState<GeminiToolMode>('chat');
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  // 1. Chat State
  const [chatRole, setChatRole] = useState<'queen' | 'shadow' | 'director' | 'fast'>('queen');
  const [chatModel, setChatModel] = useState<string>('gemini-3.5-flash');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'I run every number in this organization myself. If you are here to pitch a scene or adjust our origin script, make it precise.'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // 2. Search Grounding State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [searchSources, setSearchSources] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 3. Maps Grounding State
  const [mapsQuery, setMapsQuery] = useState('');
  const [mapsResult, setMapsResult] = useState<string | null>(null);
  const [isMapping, setIsMapping] = useState(false);

  // 4. Veo Video Generation State
  const [veoPrompt, setVeoPrompt] = useState('Elena The Queen and The Shadow walking in sync down a dimly lit luxury marble corridor, rain on panoramic high-rise windows, slow motion cinematic pan.');
  const [veoAspect, setVeoAspect] = useState<'16:9' | '9:16'>('16:9');
  const [veoImageSource, setVeoImageSource] = useState<string>(citySkylineNight);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoStatusMessage, setVideoStatusMessage] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  // 5. Image Creation & Editing State
  const [imagePrompt, setImagePrompt] = useState('Elena in a dark silk evening blazer with gold hoop earrings standing on a rain-soaked penthouse balcony at night, looking back over her shoulder.');
  const [imageAspect, setImageAspect] = useState<'1:1' | '16:9' | '9:16'>('1:1');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(queenCloseup);

  // 6. Audio Transcription State
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcriptionText, setTranscriptionText] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 7. Music Generation State (Lyria)
  const [musicPrompt, setMusicPrompt] = useState('Cinematic dark mafia romance orchestral soundtrack with rain soundscape, cello melody, and noir grand piano.');
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [generatedMusicUrl, setGeneratedMusicUrl] = useState<string | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isChatLoading]);

  // Handle Chat Submit
  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          role: chatRole,
          model: chatModel
        })
      });

      const data = await res.json();
      if (data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);

        // Save to Firestore if authenticated
        if (currentUser) {
          try {
            await addDoc(collection(db, 'users', currentUser.uid, 'messages'), {
              role: 'user',
              content: userMessage,
              persona: chatRole,
              createdAt: new Date().toISOString()
            });
            await addDoc(collection(db, 'users', currentUser.uid, 'messages'), {
              role: 'assistant',
              content: data.reply,
              persona: chatRole,
              createdAt: new Date().toISOString()
            });
          } catch (dbErr) {
            console.warn('Failed to save to Firestore:', dbErr);
          }
        }
      } else {
        setMessages([...newMessages, { role: 'assistant', content: data.error || 'Connection paused.' }]);
      }
    } catch (err: any) {
      setMessages([...newMessages, { role: 'assistant', content: 'Failed to contact Gemini: ' + err.message }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Handle Search Grounding Submit
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isSearching) return;
    setIsSearching(true);
    setSearchResult(null);
    setSearchSources([]);

    try {
      const res = await fetch('/api/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery.trim() })
      });
      const data = await res.json();
      if (data.text) {
        setSearchResult(data.text);
        if (data.groundingMetadata?.groundingChunks) {
          setSearchSources(data.groundingMetadata.groundingChunks);
        }
      } else {
        setSearchResult(data.error || 'No search results found.');
      }
    } catch (err: any) {
      setSearchResult('Search failed: ' + err.message);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Maps Grounding Submit
  const handleMapsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapsQuery.trim() || isMapping) return;
    setIsMapping(true);
    setMapsResult(null);

    try {
      const res = await fetch('/api/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationQuery: mapsQuery.trim() })
      });
      const data = await res.json();
      if (data.text) {
        setMapsResult(data.text);
      } else {
        setMapsResult(data.error || 'No location details found.');
      }
    } catch (err: any) {
      setMapsResult('Maps grounding failed: ' + err.message);
    } finally {
      setIsMapping(false);
    }
  };

  // Handle Veo Video Generation
  const handleGenerateVeoVideo = async () => {
    if (isGeneratingVideo) return;
    setIsGeneratingVideo(true);
    setGeneratedVideoUrl(null);
    setVideoStatusMessage('Submitting prompt to Veo 3 video engine...');

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: veoPrompt,
          aspectRatio: veoAspect
        })
      });

      const data = await res.json();
      if (data.operationName) {
        setVideoStatusMessage('Veo is rendering frames (~1-2 minutes). Polling operation...');
        // Poll status
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch('/api/video-status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ operationName: data.operationName })
            });
            const statusData = await statusRes.json();
            if (statusData.done) {
              clearInterval(pollInterval);
              setVideoStatusMessage('Video rendered! Downloading stream...');
              setGeneratedVideoUrl(`/api/video-download?op=${encodeURIComponent(data.operationName)}`);
              setIsGeneratingVideo(false);
            }
          } catch (pollErr) {
            console.error('Poll error:', pollErr);
          }
        }, 5000);
      } else {
        setVideoStatusMessage(data.error || 'Veo video generation initialized with model.');
        setIsGeneratingVideo(false);
      }
    } catch (err: any) {
      setVideoStatusMessage('Veo generation error: ' + err.message);
      setIsGeneratingVideo(false);
    }
  };

  // Handle Image Creation & Editing
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || isGeneratingImage) return;
    setIsGeneratingImage(true);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          aspectRatio: imageAspect
        })
      });

      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      }
    } catch (err) {
      console.error('Image gen error:', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Handle Audio Recording for Transcription
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTranscriptionText(null);
    } catch (err) {
      console.error('Microphone error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
  };

  const handleTranscribeAudio = async () => {
    if (!audioBlob || isTranscribing) return;
    setIsTranscribing(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        const res = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Audio,
            mimeType: 'audio/webm'
          })
        });

        const data = await res.json();
        setTranscriptionText(data.transcription || data.error || 'No speech detected.');
        setIsTranscribing(false);
      };
      reader.readAsDataURL(audioBlob);
    } catch (err: any) {
      setTranscriptionText('Transcription error: ' + err.message);
      setIsTranscribing(false);
    }
  };

  // Handle Music Generation (Lyria)
  const handleGenerateMusic = async () => {
    if (isGeneratingMusic) return;
    setIsGeneratingMusic(true);

    try {
      const res = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: musicPrompt })
      });

      const data = await res.json();
      if (data.audioBase64) {
        const binary = atob(data.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setGeneratedMusicUrl(url);
      }
    } catch (err) {
      console.error('Music gen error:', err);
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Firebase Auth Status */}
      <div className="border-b border-[#26262a] pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37]">
                AI Studio Intelligence Suite
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#dc2626]/20 text-[#dc2626] border border-[#dc2626]/40">
                Full-Stack Gemini 3.5 & Veo
              </span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-bold mt-1">
              Gemini Production Lab & Grounding
            </h2>
            <p className="text-sm text-stone-400 mt-1 max-w-2xl">
              Equipped with multi-turn persona chatbots (Elena, Shadow, Director), Google Search grounding, Google Maps crime staging, Veo 3 video generation, image editing, audio transcription, and Lyria music.
            </p>
          </div>

          {/* Firebase Authentication State Pill */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2.5 bg-[#141418] border border-[#2a2a30] px-3 py-1.5 rounded-lg shadow">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="avatar" className="w-7 h-7 rounded-full border border-[#d4af37]" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#d4af37] text-black font-bold flex items-center justify-center text-xs">
                    {currentUser.displayName?.[0] || 'U'}
                  </div>
                )}
                <div className="text-left text-xs">
                  <div className="font-medium text-white leading-none">{currentUser.displayName || currentUser.email}</div>
                  <span className="text-[10px] text-emerald-400 font-mono">Firebase Synced</span>
                </div>
                <button
                  onClick={() => logOut()}
                  title="Sign out of Firebase"
                  className="p-1.5 rounded hover:bg-white/10 text-stone-400 hover:text-white"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                className="px-3.5 py-1.5 bg-[#18181f] hover:bg-[#22222a] border border-[#30303a] rounded-lg text-xs font-medium text-white flex items-center gap-2 shadow"
              >
                <LogIn className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Google Sign-In (Firebase)</span>
              </button>
            )}
          </div>
        </div>

        {/* Feature Tool Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 scrollbar-none">
          <button
            onClick={() => setActiveMode('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeMode === 'chat'
                ? 'bg-[#d4af37] text-black font-semibold shadow'
                : 'bg-[#141418] text-stone-400 hover:text-white border border-[#26262a]'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            Gemini Chatbot
          </button>

          <button
            onClick={() => setActiveMode('search')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeMode === 'search'
                ? 'bg-[#d4af37] text-black font-semibold shadow'
                : 'bg-[#141418] text-stone-400 hover:text-white border border-[#26262a]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Google Search Grounding
          </button>

          <button
            onClick={() => setActiveMode('maps')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeMode === 'maps'
                ? 'bg-[#d4af37] text-black font-semibold shadow'
                : 'bg-[#141418] text-stone-400 hover:text-white border border-[#26262a]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Google Maps Grounding
          </button>

          <button
            onClick={() => setActiveMode('veo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeMode === 'veo'
                ? 'bg-[#d4af37] text-black font-semibold shadow'
                : 'bg-[#141418] text-stone-400 hover:text-white border border-[#26262a]'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Veo 3 Video Generator
          </button>

          <button
            onClick={() => setActiveMode('images')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeMode === 'images'
                ? 'bg-[#d4af37] text-black font-semibold shadow'
                : 'bg-[#141418] text-stone-400 hover:text-white border border-[#26262a]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Create & Edit Images
          </button>

          <button
            onClick={() => setActiveMode('transcribe')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeMode === 'transcribe'
                ? 'bg-[#d4af37] text-black font-semibold shadow'
                : 'bg-[#141418] text-stone-400 hover:text-white border border-[#26262a]'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            Audio Transcription
          </button>

          <button
            onClick={() => setActiveMode('music')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeMode === 'music'
                ? 'bg-[#d4af37] text-black font-semibold shadow'
                : 'bg-[#141418] text-stone-400 hover:text-white border border-[#26262a]'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            Generate Music (Lyria)
          </button>
        </div>
      </div>

      {/* 1. GEMINI MULTI-TURN CHATBOT */}
      {activeMode === 'chat' && (
        <div className="bg-[#141418] border border-[#26262a] rounded-xl overflow-hidden shadow-2xl flex flex-col h-[640px]">
          {/* Persona Header & Settings */}
          <div className="p-4 bg-[#0e0e12] border-b border-[#222228] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-stone-400 uppercase">Chat Persona:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setChatRole('queen')}
                  className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                    chatRole === 'queen' ? 'bg-[#dc2626] text-white shadow' : 'bg-black/40 text-stone-400 hover:text-white'
                  }`}
                >
                  <Crown className="w-3 h-3" /> Elena (The Queen)
                </button>
                <button
                  onClick={() => setChatRole('shadow')}
                  className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                    chatRole === 'shadow' ? 'bg-[#d4af37] text-black font-semibold shadow' : 'bg-black/40 text-stone-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-3 h-3" /> The Shadow
                </button>
                <button
                  onClick={() => setChatRole('director')}
                  className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                    chatRole === 'director' ? 'bg-white/20 text-white shadow' : 'bg-black/40 text-stone-400 hover:text-white'
                  }`}
                >
                  <Film className="w-3 h-3" /> Screenplay Director
                </button>
                <button
                  onClick={() => setChatRole('fast')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    chatRole === 'fast' ? 'bg-amber-600 text-white' : 'bg-black/40 text-stone-400 hover:text-white'
                  }`}
                >
                  ⚡ Fast (Flash Lite)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-mono">Model:</span>
              <select
                value={chatModel}
                onChange={(e) => setChatModel(e.target.value)}
                className="bg-[#181820] border border-stone-700 text-stone-300 text-xs rounded px-2 py-1 focus:outline-none focus:border-[#d4af37]"
              >
                <option value="gemini-3.5-flash">gemini-3.5-flash (Balanced)</option>
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Fast)</option>
              </select>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#0a0a0d]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-2xl ${m.role === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37] to-[#dc2626] p-0.5 shrink-0 flex items-center justify-center">
                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-[#d4af37]" />
                    </div>
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                    m.role === 'user'
                      ? 'bg-[#dc2626] text-white rounded-br-none'
                      : 'bg-[#181820] border border-[#282832] text-[#f4eedb] rounded-bl-none'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex items-center gap-2 text-xs text-stone-400 italic">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d4af37]" />
                <span>{chatRole === 'queen' ? 'Elena is formulating her terms...' : chatRole === 'shadow' ? 'The Shadow is scanning the perimeter...' : 'Director is reviewing the beat...'}</span>
              </div>
            )}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendChat} className="p-3 bg-[#0d0d10] border-t border-[#222228] flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Ask ${chatRole === 'queen' ? 'Elena' : chatRole === 'shadow' ? 'The Shadow' : 'the Screenplay Director'} anything about the script or scene...`}
              className="flex-1 bg-[#16161c] border border-stone-800 rounded-lg px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#d4af37]"
            />
            <button
              type="submit"
              disabled={isChatLoading || !chatInput.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#c5a059] disabled:opacity-50 text-black font-bold text-xs rounded-lg flex items-center gap-1.5 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* 2. GOOGLE SEARCH GROUNDING */}
      {activeMode === 'search' && (
        <div className="bg-[#141418] border border-[#26262a] rounded-xl p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="font-cinzel text-xl text-white font-bold flex items-center gap-2">
              <Search className="w-5 h-5 text-[#d4af37]" />
              Google Search Grounding
            </h3>
            <p className="text-xs text-stone-400">
              Query real-time web knowledge with Gemini 3.5 Flash using the Google Search tool for true-crime history, mafia syndicate research, dark romance reader tropes, or YouTube trends.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., Historical mafia bookkeeping frauds, dark romance enemies to lovers tropes 2026, or film noir lighting techniques..."
              className="flex-1 bg-[#0d0d10] border border-stone-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            />
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-black font-bold text-xs rounded-lg flex items-center gap-1.5 shadow"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Search Grounding</span>
            </button>
          </form>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-500 font-mono text-[11px]">Suggested Research:</span>
            {['1920s-1980s mafia ledger accounting scams', 'Dark romance YouTube retention benchmarks', 'Iconic film noir camera movements and shadow angles'].map((s) => (
              <button
                key={s}
                onClick={() => setSearchQuery(s)}
                className="px-2.5 py-1 bg-black/40 border border-white/10 rounded text-[11px] text-stone-300 hover:text-white hover:border-[#d4af37]"
              >
                {s}
              </button>
            ))}
          </div>

          {searchResult && (
            <div className="p-5 bg-[#0a0a0d] border border-[#222228] rounded-xl space-y-4">
              <div className="flex items-center justify-between text-xs text-[#d4af37] font-mono border-b border-white/5 pb-2">
                <span>Google Search Verified Grounding</span>
                <span>Gemini 3.5 Flash</span>
              </div>
              <div className="text-xs sm:text-sm text-[#f4eedb] leading-relaxed whitespace-pre-wrap">
                {searchResult}
              </div>

              {searchSources.length > 0 && (
                <div className="pt-3 border-t border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-stone-500 block">Sources & Citations:</span>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    {searchSources.map((source, i) => (
                      <span key={i} className="text-stone-400 bg-white/5 px-2 py-0.5 rounded">
                        {source.web?.title || source.web?.uri || `Source ${i+1}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. GOOGLE MAPS GROUNDING */}
      {activeMode === 'maps' && (
        <div className="bg-[#141418] border border-[#26262a] rounded-xl p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="font-cinzel text-xl text-white font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#d4af37]" />
              Google Maps Location Grounding
            </h3>
            <p className="text-xs text-stone-400">
              Ground your crime scenes and syndicate meeting locations with real-world geographical coordinates, alleyways, docks, and architecture.
            </p>
          </div>

          <form onSubmit={handleMapsSubmit} className="flex gap-2">
            <input
              type="text"
              value={mapsQuery}
              onChange={(e) => setMapsQuery(e.target.value)}
              placeholder="e.g., Waterfront shipping docks in Brooklyn, Chicago South Loop luxury penthouses, or historic Milan mafia villas..."
              className="flex-1 bg-[#0d0d10] border border-stone-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            />
            <button
              type="submit"
              disabled={isMapping || !mapsQuery.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-black font-bold text-xs rounded-lg flex items-center gap-1.5 shadow"
            >
              {isMapping ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
              <span>Ground Location</span>
            </button>
          </form>

          {mapsResult && (
            <div className="p-5 bg-[#0a0a0d] border border-[#222228] rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-[#d4af37] font-mono border-b border-white/5 pb-2">
                <span>Google Maps Verified Geospatial Context</span>
                <span>Cinematic Staging</span>
              </div>
              <div className="text-xs sm:text-sm text-[#f4eedb] leading-relaxed whitespace-pre-wrap">
                {mapsResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. VEO VIDEO GENERATOR (veo-3.1-lite-generate-preview) */}
      {activeMode === 'veo' && (
        <div className="bg-[#141418] border border-[#26262a] rounded-xl p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="font-cinzel text-xl text-white font-bold flex items-center gap-2">
              <Video className="w-5 h-5 text-[#d4af37]" />
              Veo 3 Video Generator & Image Animator
            </h3>
            <p className="text-xs text-stone-400">
              Generate cinematic video clips directly from text or animate character and motif photos using the Veo 3 model (16:9 widescreen or 9:16 portrait).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Video Cinematic Prompt
                </label>
                <textarea
                  rows={3}
                  value={veoPrompt}
                  onChange={(e) => setVeoPrompt(e.target.value)}
                  className="w-full bg-[#0d0d10] border border-stone-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    value={veoAspect}
                    onChange={(e) => setVeoAspect(e.target.value as '16:9' | '9:16')}
                    className="w-full bg-[#0d0d10] border border-stone-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="16:9">16:9 Landscape (YouTube)</option>
                    <option value="9:16">9:16 Portrait (Shorts / Reels)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Action
                  </label>
                  <button
                    onClick={handleGenerateVeoVideo}
                    disabled={isGeneratingVideo}
                    className="w-full h-10 bg-gradient-to-r from-[#d4af37] to-[#c5a059] disabled:opacity-50 text-black font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow"
                  >
                    {isGeneratingVideo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Generate Veo Video</span>
                  </button>
                </div>
              </div>

              {/* Status Message */}
              {videoStatusMessage && (
                <div className="p-3 bg-[#0a0a0d] border border-white/10 rounded-lg text-xs font-mono text-[#d4af37] flex items-center gap-2">
                  {isGeneratingVideo && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{videoStatusMessage}</span>
                </div>
              )}
            </div>

            {/* Video Preview Panel */}
            <div className="lg:col-span-5 bg-black rounded-xl border border-[#2a2a32] overflow-hidden aspect-video flex items-center justify-center relative">
              {generatedVideoUrl ? (
                <video src={generatedVideoUrl} controls autoPlay className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <Film className="w-10 h-10 text-stone-600 mx-auto" />
                  <span className="text-xs text-stone-400 block font-cinzel">Veo Video Viewport</span>
                  <span className="text-[11px] text-stone-500 block">Configure prompt and click Generate to start rendering</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. CREATE & EDIT IMAGES */}
      {activeMode === 'images' && (
        <div className="bg-[#141418] border border-[#26262a] rounded-xl p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="font-cinzel text-xl text-white font-bold flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#d4af37]" />
              Create & Edit Images (Gemini Image Preview)
            </h3>
            <p className="text-xs text-stone-400">
              Generate new scenes or modify existing character stills with text prompts using Gemini's image generation models.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Scene Description / Edit Instruction
                </label>
                <textarea
                  rows={3}
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="w-full bg-[#0d0d10] border border-stone-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    value={imageAspect}
                    onChange={(e) => setImageAspect(e.target.value as any)}
                    className="w-full bg-[#0d0d10] border border-stone-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="1:1">1:1 Square (Character Portrait)</option>
                    <option value="16:9">16:9 Landscape (YouTube Scene)</option>
                    <option value="9:16">9:16 Portrait (Mobile Wallpaper)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Action
                  </label>
                  <button
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage}
                    className="w-full h-10 bg-gradient-to-r from-[#d4af37] to-[#c5a059] disabled:opacity-50 text-black font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow"
                  >
                    {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Generate Artwork</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Generated Image Result */}
            <div className="lg:col-span-5 bg-black rounded-xl border border-[#2a2a32] overflow-hidden aspect-square flex items-center justify-center relative">
              {generatedImage ? (
                <img src={generatedImage} alt="Generated scene" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-stone-500">Image will appear here</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. AUDIO TRANSCRIPTION (gemini-3.5-transcribe) */}
      {activeMode === 'transcribe' && (
        <div className="bg-[#141418] border border-[#26262a] rounded-xl p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="font-cinzel text-xl text-white font-bold flex items-center gap-2">
              <Mic className="w-5 h-5 text-[#d4af37]" />
              Voice Microphone Transcription (Gemini 3.5 Transcribe)
            </h3>
            <p className="text-xs text-stone-400">
              Speak your screenplay notes or dialogue lines directly through your microphone, and Gemini 3.5 Transcribe will convert your speech into accurate text.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-6 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs rounded-full flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <Mic className="w-4 h-4" />
                <span>Start Recording Speech</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-6 py-3 bg-stone-700 hover:bg-stone-600 text-white font-bold text-xs rounded-full flex items-center gap-2 shadow-lg animate-pulse"
              >
                <div className="w-3 h-3 bg-red-500 rounded-sm" />
                <span>Stop Recording</span>
              </button>
            )}

            {audioBlob && (
              <button
                onClick={handleTranscribeAudio}
                disabled={isTranscribing}
                className="px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-black font-bold text-xs rounded-full flex items-center gap-2 shadow"
              >
                {isTranscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Transcribe with Gemini 3.5</span>
              </button>
            )}
          </div>

          {transcriptionText && (
            <div className="p-5 bg-[#0d0d10] border border-[#222228] rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-wider block">
                Transcribed Screenplay Text:
              </span>
              <p className="text-sm text-white font-serif leading-relaxed">
                "{transcriptionText}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* 7. MUSIC GENERATION (Lyria) */}
      {activeMode === 'music' && (
        <div className="bg-[#141418] border border-[#26262a] rounded-xl p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="font-cinzel text-xl text-white font-bold flex items-center gap-2">
              <Music className="w-5 h-5 text-[#d4af37]" />
              Music Soundtrack Generation (Lyria 3)
            </h3>
            <p className="text-xs text-stone-400">
              Generate original cinematic dark romance film scores, noir jazz, or orchestral string tracks using Lyria 3 Clip.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Soundtrack Style Prompt
              </label>
              <textarea
                rows={2}
                value={musicPrompt}
                onChange={(e) => setMusicPrompt(e.target.value)}
                className="w-full bg-[#0d0d10] border border-stone-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <button
              onClick={handleGenerateMusic}
              disabled={isGeneratingMusic}
              className="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#c5a059] disabled:opacity-50 text-black font-bold text-xs rounded-lg flex items-center gap-2 shadow"
            >
              {isGeneratingMusic ? <Loader2 className="w-4 h-4 animate-spin" /> : <Music className="w-4 h-4" />}
              <span>Generate 30s Soundtrack</span>
            </button>

            {generatedMusicUrl && (
              <div className="p-4 bg-[#0d0d10] border border-[#d4af37]/30 rounded-xl space-y-2">
                <span className="text-xs text-[#d4af37] font-mono block">Generated Lyria Soundtrack Clip:</span>
                <audio controls src={generatedMusicUrl} className="w-full" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
