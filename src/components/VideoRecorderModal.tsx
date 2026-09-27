import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Video, Download, Play, Square, Sparkles, CheckCircle2, 
  Film, AlertCircle, RefreshCw, Loader2
} from 'lucide-react';
import { SCRIPT_ACTS } from '../data/scriptData';
import { ScriptAct } from '../types/script';

interface VideoRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoRecorderModal: React.FC<VideoRecorderModalProps> = ({ isOpen, onClose }) => {
  const [selectedActId, setSelectedActId] = useState<string>('cold-open');
  const [resolution, setResolution] = useState<'1080p' | '720p'>('720p');
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Ready to render cinematic video');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  if (!isOpen) return null;

  const targetAct = SCRIPT_ACTS.find(a => a.id === selectedActId) || SCRIPT_ACTS[0];

  const startRendering = async () => {
    if (!canvasRef.current) return;
    setIsRecording(true);
    setRecordedVideoUrl(null);
    recordedChunksRef.current = [];
    setStatusMessage('Initializing video canvas engine...');

    const canvas = canvasRef.current;
    const width = resolution === '1080p' ? 1920 : 1280;
    const height = resolution === '1080p' ? 1080 : 720;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load images for the act
    setStatusMessage('Preloading cinematic scene assets...');
    const loadedImages: HTMLImageElement[] = [];
    for (const shot of targetAct.cameraShots) {
      if (shot.imagePlaceholder) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = shot.imagePlaceholder!;
        });
        loadedImages.push(img);
      }
    }

    if (loadedImages.length === 0) {
      setStatusMessage('Error: could not load scene visuals.');
      setIsRecording(false);
      return;
    }

    // Setup canvas stream and MediaRecorder
    try {
      const stream = canvas.captureStream(30); // 30 FPS
      
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4000000 });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideoUrl(videoUrl);
        setIsRecording(false);
        setStatusMessage('Video render complete! Ready for download.');
      };

      recorder.start(100);

      // Animation parameters
      const totalFrames = 30 * 12; // 12 seconds preview render
      let currentFrame = 0;
      const lines = targetAct.narrationText;

      const drawFrame = () => {
        if (currentFrame >= totalFrames) {
          if (recorder.state === 'recording') {
            recorder.stop();
          }
          return;
        }

        const progress = currentFrame / totalFrames;
        setRecordProgress(Math.round(progress * 100));

        // Select active image based on time
        const imgIndex = Math.min(
          loadedImages.length - 1, 
          Math.floor(progress * loadedImages.length)
        );
        const currentImg = loadedImages[imgIndex];

        // 1. Draw Background with Ken Burns zoom
        ctx.fillStyle = '#0a0a0c';
        ctx.fillRect(0, 0, width, height);

        if (currentImg && currentImg.complete) {
          const scale = 1.0 + (progress % (1 / loadedImages.length)) * 0.15;
          const sw = width * scale;
          const sh = height * scale;
          const sx = (width - sw) / 2;
          const sy = (height - sh) / 2;

          ctx.save();
          ctx.drawImage(currentImg, sx, sy, sw, sh);
          ctx.restore();
        }

        // 2. Noir Vignette Gradient
        const grad = ctx.createRadialGradient(
          width / 2, height / 2, width * 0.2, 
          width / 2, height / 2, width * 0.7
        );
        grad.addColorStop(0, 'rgba(0,0,0,0.1)');
        grad.addColorStop(1, 'rgba(0,0,0,0.85)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // 3. Top Watermark
        ctx.font = `600 ${height * 0.024}px serif`;
        ctx.fillStyle = '#d4af37';
        ctx.fillText('THE QUEEN & THE SHADOW', width * 0.04, height * 0.07);

        ctx.font = `400 ${height * 0.018}px sans-serif`;
        ctx.fillStyle = '#f4eedb';
        ctx.fillText(
          `${targetAct.actNumber === 'COLD OPEN' ? 'COLD OPEN' : `ACT ${targetAct.actNumber}`} · ${targetAct.title.toUpperCase()}`,
          width * 0.04,
          height * 0.10
        );

        // 4. Subtitle Narration Line
        const lineIdx = Math.min(lines.length - 1, Math.floor(progress * lines.length));
        const subtitleText = lines[lineIdx];

        ctx.font = `italic 600 ${height * 0.038}px Georgia, serif`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 10;

        // Wrap subtitle
        const maxWidth = width * 0.85;
        const words = subtitleText.split(' ');
        let currentLineText = '';
        const linesToDraw: string[] = [];

        for (const word of words) {
          const testLine = currentLineText + word + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && currentLineText !== '') {
            linesToDraw.push(currentLineText);
            currentLineText = word + ' ';
          } else {
            currentLineText = testLine;
          }
        }
        linesToDraw.push(currentLineText);

        const startY = height * 0.82 - (linesToDraw.length - 1) * (height * 0.04);
        linesToDraw.forEach((l, i) => {
          ctx.fillText(`"${l.trim()}"`, width / 2, startY + i * (height * 0.045));
        });

        // Reset text alignment
        ctx.textAlign = 'start';
        ctx.shadowBlur = 0;

        currentFrame++;
        animationFrameRef.current = requestAnimationFrame(drawFrame);
      };

      drawFrame();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
      setStatusMessage('Error rendering video: ' + String(err));
    }
  };

  const stopRecording = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#121216] border border-[#2a2a30] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#26262a] bg-[#0c0c0e]">
          <div className="flex items-center gap-2.5">
            <Video className="w-5 h-5 text-[#d4af37]" />
            <div>
              <h3 className="font-cinzel font-bold text-white text-base">
                Cinematic Video Export Studio
              </h3>
              <p className="text-xs text-stone-400">
                Render and export high-definition video clips with cinematic artwork, subtitles, and pacing.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Select Act to Render
              </label>
              <select
                value={selectedActId}
                onChange={(e) => setSelectedActId(e.target.value)}
                disabled={isRecording}
                className="w-full bg-[#1a1a20] border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                {SCRIPT_ACTS.map((act) => (
                  <option key={act.id} value={act.id}>
                    {act.actNumber === 'COLD OPEN' || act.actNumber === 'CTA' ? act.actNumber : `Act ${act.actNumber}`}: {act.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Video Resolution
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as '1080p' | '720p')}
                disabled={isRecording}
                className="w-full bg-[#1a1a20] border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="720p">720p HD (1280x720) — Fast</option>
                <option value="1080p">1080p Full HD (1920x1080) — Best Quality</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Action
              </label>
              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  Stop Recording ({recordProgress}%)
                </button>
              ) : (
                <button
                  onClick={startRendering}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#c5a059] hover:brightness-110 text-black text-xs font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  Start Video Render
                </button>
              )}
            </div>
          </div>

          {/* Render Preview Area */}
          <div className="relative aspect-video bg-black rounded-lg border border-[#2a2a30] overflow-hidden flex items-center justify-center">
            {/* The Canvas used for recording */}
            <canvas
              ref={canvasRef}
              className={`w-full h-full object-contain ${recordedVideoUrl ? 'hidden' : 'block'}`}
            />

            {/* Video Player when recording is finished */}
            {recordedVideoUrl && (
              <video
                src={recordedVideoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            )}

            {/* Inactive overlay placeholder */}
            {!isRecording && !recordedVideoUrl && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/60">
                <Film className="w-12 h-12 text-[#d4af37]/60 mb-3" />
                <h4 className="font-cinzel text-base text-white font-semibold">
                  Ready to Render "{targetAct.title}"
                </h4>
                <p className="text-xs text-stone-400 max-w-md mt-1">
                  Click 'Start Video Render' to generate a full animated video clip with Ken Burns cinematography, visual motifs, and stylized subtitles.
                </p>
              </div>
            )}

            {/* Recording Progress Bar */}
            {isRecording && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-3 rounded-lg border border-white/10 flex items-center justify-between text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#d4af37]" />
                  <span>{statusMessage}</span>
                </div>
                <span className="font-mono text-[#d4af37] font-bold">{recordProgress}%</span>
              </div>
            )}
          </div>

          {/* Download Action when Video is Ready */}
          {recordedVideoUrl && (
            <div className="p-4 bg-[#18181f] border border-[#d4af37]/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#d4af37]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Video clip rendered successfully! Ready for your YouTube project.</span>
              </div>
              <a
                href={recordedVideoUrl}
                download={`Queen_and_Shadow_${targetAct.id}_${resolution}.webm`}
                className="px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-black font-bold text-xs rounded-lg flex items-center gap-1.5 shadow hover:brightness-110"
              >
                <Download className="w-4 h-4" />
                Download Video (.webm)
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
