import { ScriptAct } from '../types/script';

function formatSrtTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor((totalSeconds % 1) * 1000);

  const pad = (n: number, z = 2) => ('00' + n).slice(-z);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(milliseconds, 3)}`;
}

function formatVttTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor((totalSeconds % 1) * 1000);

  const pad = (n: number, z = 2) => ('00' + n).slice(-z);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`;
}

export function generateSrt(acts: ScriptAct[]): string {
  let counter = 1;
  const entries: string[] = [];

  acts.forEach((act) => {
    const actDuration = act.endSeconds - act.startSeconds;
    const lines = act.narrationText;
    const lineDuration = actDuration / Math.max(1, lines.length);

    lines.forEach((line, idx) => {
      const lineStart = act.startSeconds + idx * lineDuration;
      const lineEnd = lineStart + lineDuration - 0.2;

      entries.push(`${counter}\n${formatSrtTime(lineStart)} --> ${formatSrtTime(lineEnd)}\n${line}\n`);
      counter++;
    });
  });

  return entries.join('\n');
}

export function generateVtt(acts: ScriptAct[]): string {
  const srtBody = acts.flatMap((act) => {
    const actDuration = act.endSeconds - act.startSeconds;
    const lines = act.narrationText;
    const lineDuration = actDuration / Math.max(1, lines.length);

    return lines.map((line, idx) => {
      const lineStart = act.startSeconds + idx * lineDuration;
      const lineEnd = lineStart + lineDuration - 0.2;
      return `${formatVttTime(lineStart)} --> ${formatVttTime(lineEnd)}\n${line}\n`;
    });
  }).join('\n');

  return `WEBVTT - The Queen & The Shadow (Origin Story)\n\n${srtBody}`;
}

export function generateScriptText(acts: ScriptAct[]): string {
  let output = `THE QUEEN & THE SHADOW — Origin Story\nLong-Form YouTube Script (~12–14 min)\n\n`;

  acts.forEach((act) => {
    output += `========================================================\n`;
    output += `${act.actNumber === 'COLD OPEN' || act.actNumber === 'CTA' ? act.actNumber : `ACT ${act.actNumber}`} — ${act.title.toUpperCase()} [${act.timestamp}]\n`;
    output += `[VISUAL: ${act.visualNote}]\n`;
    output += `========================================================\n\n`;
    output += act.narrationText.join('\n\n') + '\n\n';
  });

  return output;
}

export function downloadTextFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
