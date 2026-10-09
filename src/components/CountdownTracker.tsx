import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Bell, 
  CheckCircle2
} from 'lucide-react';

interface CountdownTrackerProps {
  timerHours: number;
  actionType: 'OFF' | 'ON';
  targetResultTime: string;
}

export const CountdownTracker: React.FC<CountdownTrackerProps> = ({
  timerHours,
  actionType,
  targetResultTime,
}) => {
  const [isRunning, setIsRunning] = React.useState(false);
  const [remainingSeconds, setRemainingSeconds] = React.useState(timerHours * 3600);
  const [hasFinished, setHasFinished] = React.useState(false);

  // Sync remainingSeconds when timerHours changes if not running
  React.useEffect(() => {
    if (!isRunning) {
      setRemainingSeconds(timerHours * 3600);
      setHasFinished(false);
    }
  }, [timerHours, isRunning]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setHasFinished(true);
            try {
              // Beep sound
              const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.frequency.setValueAtTime(880, audioCtx.currentTime);
              gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.8);
            } catch {
              // Audio context not allowed or failed
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remainingSeconds]);

  const totalSeconds = Math.max(1, timerHours * 3600);
  const progressPercent = Math.min(100, Math.max(0, ((totalSeconds - remainingSeconds) / totalSeconds) * 100));

  const hoursLeft = Math.floor(remainingSeconds / 3600);
  const minutesLeft = Math.floor((remainingSeconds % 3600) / 60);
  const secondsLeft = remainingSeconds % 60;

  const handleToggle = () => {
    if (hasFinished) {
      setRemainingSeconds(timerHours * 3600);
      setHasFinished(false);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(timerHours * 3600);
    setHasFinished(false);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-lg border border-slate-700 mt-6 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
              <Bell className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm tracking-wide uppercase text-indigo-300">
              Cronômetro da Contagem do Ar
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Acompanhe em tempo real o tempo que resta até o ar {actionType === 'OFF' ? 'desligar' : 'ligar'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
              isRunning 
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" /> Pausar
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> {hasFinished ? 'Reiniciar' : 'Iniciar Contagem'}
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs cursor-pointer"
            title="Resetar tempo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Countdown Visualizer */}
      <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Tempo Restante Estimado</span>
          <div className="text-3xl sm:text-4xl font-mono font-black tracking-wider text-emerald-400 mt-0.5">
            {String(hoursLeft).padStart(2, '0')}:
            {String(minutesLeft).padStart(2, '0')}:
            {String(secondsLeft).padStart(2, '0')}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <span>Previsão de término:</span>
            <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
              {targetResultTime}
            </span>
          </div>
        </div>

        {/* Progress Bar and Indicator */}
        <div className="w-full sm:w-1/2 space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Progresso da contagem</span>
            <span className="font-bold text-slate-200">{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Início (0h)</span>
            <span>Programado ({timerHours}h)</span>
          </div>
        </div>
      </div>

      {hasFinished && (
        <div className="mt-3 p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl flex items-center gap-2 text-emerald-300 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Tempo esgotado!</strong> O ar condicionado agora deve ter sido {actionType === 'OFF' ? 'desligado' : 'ligado'} com sucesso!
          </span>
        </div>
      )}
    </div>
  );
};
