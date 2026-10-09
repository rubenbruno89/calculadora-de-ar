import React from 'react';
import { 
  Power, 
  Clock, 
  ArrowUp, 
  ArrowDown
} from 'lucide-react';

interface RemoteSimulatorProps {
  timerHours: number;
  timerMode: 'OFF' | 'ON' | 'BOTH';
  onHoursChange: (hours: number) => void;
  temp?: number;
  onTempChange?: (temp: number) => void;
}

export const RemoteSimulator: React.FC<RemoteSimulatorProps> = ({
  timerHours,
  timerMode,
  onHoursChange,
  temp = 23,
  onTempChange,
}) => {
  const [acState, setAcState] = React.useState<'on' | 'off'>('on');
  const [fanSpeed, setFanSpeed] = React.useState<'low' | 'med' | 'auto'>('auto');
  const [mode, setMode] = React.useState<'cool' | 'eco' | 'fan'>('cool');
  const [activeBtn, setActiveBtn] = React.useState<string | null>(null);

  const handlePress = (id: string, action: () => void) => {
    setActiveBtn(id);
    action();
    setTimeout(() => setActiveBtn(null), 180);
  };

  return (
    <div className="w-full max-w-[310px] mx-auto bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 rounded-3xl p-4 shadow-2xl border border-slate-300 dark:border-slate-700/80 relative select-none">
      {/* Top IR emitter */}
      <div className="w-12 h-2.5 bg-slate-900 rounded-full mx-auto -mt-2 mb-3 shadow-inner opacity-70"></div>

      {/* LCD Display */}
      <div className="bg-[#b9d5c0] dark:bg-[#183424] p-3.5 rounded-xl border-2 border-slate-400/50 dark:border-emerald-950 shadow-inner text-slate-800 dark:text-emerald-300 font-mono relative overflow-hidden mb-4">
        {/* LCD scan lines subtle overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_50%,transparent_50%)] bg-[length:100%_4px] pointer-events-none"></div>

        {/* Status icons bar */}
        <div className="flex justify-between items-center text-[11px] font-bold tracking-wider border-b border-slate-800/20 dark:border-emerald-500/20 pb-1 mb-2">
          <div className="flex items-center gap-1.5">
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${mode === 'cool' ? 'bg-slate-800 text-white dark:bg-emerald-400 dark:text-slate-950' : 'opacity-40'}`}>COOL</span>
            <span className={`px-1 py-0.5 rounded text-[10px] ${mode === 'eco' ? 'bg-slate-800 text-white dark:bg-emerald-400 dark:text-slate-950' : 'opacity-40'}`}>ECO</span>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>FAN:</span>
            <span className="font-extrabold uppercase">{fanSpeed}</span>
          </div>
        </div>

        {/* Main Temperature & Big Display */}
        <div className="flex items-baseline justify-between my-1">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-tight block opacity-75">TEMPERATURA</span>
            <div className="text-3xl font-extrabold tracking-tighter leading-none">
              {temp}°<span className="text-base font-medium">C</span>
            </div>
          </div>

          {/* TIMER INDICATOR */}
          <div className="text-right bg-black/10 dark:bg-white/5 p-1.5 rounded-lg border border-slate-700/20 dark:border-emerald-500/20 min-w-[90px]">
            <div className="flex items-center justify-end gap-1 text-[10px] font-extrabold text-amber-700 dark:text-amber-300">
              <Clock className="w-3 h-3 animate-pulse" />
              <span>TIMER {timerMode}</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-emerald-100 leading-none mt-0.5">
              {timerHours > 0 ? `${timerHours}h` : '--'}
            </div>
            <div className="text-[9px] opacity-75">
              {timerHours > 0 ? `desliga em ${timerHours}h` : 'desativado'}
            </div>
          </div>
        </div>

        {/* LCD bottom footer message */}
        <div className="mt-2 pt-1 border-t border-slate-800/15 dark:border-emerald-500/20 text-[10px] flex justify-between items-center opacity-85">
          <span>PROGRAMADOR 1h-24h</span>
          <span className="font-bold flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            IR ATIVO
          </span>
        </div>
      </div>

      {/* Remote Keys Pad */}
      <div className="space-y-3">
        {/* Row 1: Power & Temp */}
        <div className="grid grid-cols-3 gap-2 items-center">
          <button
            onClick={() => handlePress('pwr', () => setAcState(s => s === 'on' ? 'off' : 'on'))}
            className={`flex flex-col items-center justify-center p-2.5 rounded-2xl shadow font-semibold text-xs transition-all active:scale-95 ${
              activeBtn === 'pwr' ? 'ring-2 ring-rose-400' : ''
            } ${
              acState === 'on' 
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30' 
                : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Power className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">POWER</span>
          </button>

          <div className="col-span-2 grid grid-cols-2 gap-2 bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-300 dark:border-slate-700">
            <button
              onClick={() => handlePress('tempDown', () => onTempChange && onTempChange(Math.max(16, temp - 1)))}
              className={`flex items-center justify-center gap-1 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 shadow-sm text-slate-700 dark:text-slate-200 active:scale-95 transition-all text-xs font-bold ${
                activeBtn === 'tempDown' ? 'bg-slate-200' : ''
              }`}
            >
              <ArrowDown className="w-3.5 h-3.5" /> TEMP -
            </button>
            <button
              onClick={() => handlePress('tempUp', () => onTempChange && onTempChange(Math.min(30, temp + 1)))}
              className={`flex items-center justify-center gap-1 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 shadow-sm text-slate-700 dark:text-slate-200 active:scale-95 transition-all text-xs font-bold ${
                activeBtn === 'tempUp' ? 'bg-slate-200' : ''
              }`}
            >
              <ArrowUp className="w-3.5 h-3.5" /> TEMP +
            </button>
          </div>
        </div>

        {/* TIMER SECTION ON REMOTE (Highlighted) */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 p-3 rounded-2xl border-2 border-indigo-200 dark:border-indigo-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> TECLAS DO SEU CONTROLE
            </span>
            <span className="text-[10px] bg-indigo-200/60 dark:bg-indigo-800/60 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded-full font-bold">
              Passo: 1h
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => handlePress('timerDown', () => onHoursChange(Math.max(1, timerHours - 1)))}
              className={`py-2.5 px-2 bg-white dark:bg-slate-700 rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-sm text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-1 hover:bg-indigo-50 dark:hover:bg-slate-600 active:scale-95 transition-all ${
                activeBtn === 'timerDown' ? 'ring-2 ring-indigo-400 scale-95' : ''
              }`}
            >
              <ArrowDown className="w-4 h-4 text-indigo-500" />
              <span>TIMER - 1h</span>
            </button>

            <button
              onClick={() => handlePress('timerUp', () => onHoursChange(Math.min(24, timerHours + 1)))}
              className={`py-2.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-500/20 font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all ${
                activeBtn === 'timerUp' ? 'ring-2 ring-indigo-300 scale-95' : ''
              }`}
            >
              <ArrowUp className="w-4 h-4 text-white" />
              <span>TIMER + 1h</span>
            </button>
          </div>

          {/* Quick presets row on remote */}
          <div className="grid grid-cols-4 gap-1 text-[10px] font-semibold">
            {[1, 2, 4, 8].map(h => (
              <button
                key={h}
                onClick={() => handlePress(`preset-${h}`, () => onHoursChange(h))}
                className={`py-1 rounded-lg border transition-all ${
                  timerHours === h 
                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold' 
                    : 'bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-indigo-100 dark:border-slate-700 hover:bg-white'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Remote Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={() => handlePress('mode', () => setMode(m => m === 'cool' ? 'eco' : m === 'eco' ? 'fan' : 'cool'))}
            className="py-2 bg-white dark:bg-slate-700 rounded-xl text-[11px] font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 border border-slate-200 dark:border-slate-600"
          >
            MODO
          </button>
          <button 
            onClick={() => handlePress('fan', () => setFanSpeed(f => f === 'low' ? 'med' : f === 'med' ? 'auto' : 'low'))}
            className="py-2 bg-white dark:bg-slate-700 rounded-xl text-[11px] font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 border border-slate-200 dark:border-slate-600"
          >
            VENTO
          </button>
          <button 
            onClick={() => handlePress('clear', () => onHoursChange(0))}
            className="py-2 bg-slate-200 dark:bg-slate-800 rounded-xl text-[10px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-300"
          >
            LIMPAR
          </button>
        </div>
      </div>

      <div className="text-center mt-3 text-[10px] text-slate-400 dark:text-slate-500 font-sans tracking-wide">
        CONTROLE REMOTO UNIVERSAL
      </div>
    </div>
  );
};
