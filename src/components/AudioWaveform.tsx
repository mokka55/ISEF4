import React, { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  analyserNode: AnalyserNode | null;
  isRecording: boolean;
  isPaused: boolean;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  analyserNode,
  isRecording,
  isPaused,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserNode ? analyserNode.fftSize : 1024;
    const timeData = new Uint8Array(bufferLength);
    const freqData = new Uint8Array(analyserNode ? analyserNode.frequencyBinCount : 512);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.8)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center baseline
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      if (analyserNode && isRecording && !isPaused) {
        analyserNode.getByteTimeDomainData(timeData);
        analyserNode.getByteFrequencyData(freqData);

        // Draw frequency bars in background
        const barWidth = (width / freqData.length) * 2.5;
        let barX = 0;
        for (let i = 0; i < freqData.length; i += 2) {
          const barHeight = (freqData[i] / 255) * (height / 2);
          ctx.fillStyle = `rgba(37, 99, 235, ${0.15 + (freqData[i] / 255) * 0.35})`;
          ctx.fillRect(barX, height - barHeight, barWidth, barHeight);
          barX += barWidth + 1;
          if (barX > width) break;
        }

        // Draw oscilloscope waveform
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#38bdf8'; // Laser Cyan
        ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = timeData[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        // Flat baseline or idle pulse
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = isPaused ? '#f59e0b' : 'rgba(100, 116, 139, 0.5)';
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.font = '12px "JetBrains Mono", monospace';
        const label = isPaused
          ? 'RECORDING PAUSED'
          : isRecording
          ? 'INITIALIZING STREAM...'
          : 'MICROPHONE STANDBY — READY TO RECORD';
        const metrics = ctx.measureText(label);
        ctx.fillText(label, (width - metrics.width) / 2, height / 2 - 12);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyserNode, isRecording, isPaused]);

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-slate-700/80 bg-slate-950/90 shadow-inner">
      <div className="absolute top-2.5 left-3 flex items-center gap-2 text-xs font-mono text-slate-400 z-10 pointer-events-none">
        <span className="text-sky-400 font-semibold">OSCILLOSCOPE & FFT SPECTRUM</span>
        <span aria-hidden="true" className="text-slate-600">·</span>
        <span>2048 FFT</span>
        <span aria-hidden="true" className="text-slate-600">·</span>
        <span>44.1 kHz PCM</span>
      </div>
      <canvas
        ref={canvasRef}
        width={720}
        height={180}
        className="w-full h-44 block"
      />
    </div>
  );
};
