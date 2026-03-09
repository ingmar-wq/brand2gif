"use client";

interface ProgressBarProps {
  progress: number; // 0 to 1
  label?: string;
}

export default function ProgressBar({ progress, label }: ProgressBarProps) {
  const percent = Math.round(progress * 100);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1.5">
          <span className="text-sm text-zinc-400">{label}</span>
          <span className="text-sm text-zinc-500 font-mono">{percent}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
