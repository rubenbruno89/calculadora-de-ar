import React from 'react';
import { 
  CheckCircle2, 
  Zap, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { calculateHourlyRecommendations } from '../utils/timerCalculations';

interface StepGuideProps {
  currentMinutes: number;
  targetTimeStr: string;
  actionType: 'OFF' | 'ON';
  selectedOption: 'rounded' | 'floor' | 'ceil';
  onSelectOption: (option: 'rounded' | 'floor' | 'ceil') => void;
  temp: number;
}

export const StepGuide: React.FC<StepGuideProps> = ({
  currentMinutes,
  targetTimeStr,
  actionType,
  selectedOption,
  onSelectOption,
  temp
}) => {
  const [copied, setCopied] = React.useState(false);
  const targetMinutes = React.useMemo(() => {
    const [h, m] = targetTimeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }, [targetTimeStr]);

  const rec = React.useMemo(() => {
    return calculateHourlyRecommendations(currentMinutes, targetMinutes);
  }, [currentMinutes, targetMinutes]);

  const chosenHours = selectedOption === 'rounded' 
    ? rec.roundedHours 
    : selectedOption === 'floor' 
    ? rec.floorHours 
    : rec.ceilHours;

  const chosenResult = selectedOption === 'rounded'
    ? rec.roundedResult
    : selectedOption === 'floor'
    ? rec.floorResult
    : rec.ceilResult;

  const handleCopySummary = () => {
    const text = `Timer Ar Condicionado: Colocar no controle remoto ${chosenHours}h (${actionType === 'OFF' ? 'Desligar' : 'Ligar'}). Horário estimado: ${chosenResult.timeStr}.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Step by step card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 md:p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold">1</span>
              Como Programar no seu Controle
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Siga os 3 passos simples apontando o controle para o ar condicionado
            </p>
          </div>
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            title="Copiar instrução"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>

        {/* 3 Step Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Step 1 */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 relative">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Passo 1</span>
            <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100 mt-1">
              {actionType === 'OFF' ? 'Com o Ar Ligado' : 'Com o Ar Desligado'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {actionType === 'OFF' 
                ? `Certifique-se de que o ar condicionado está funcionando na temperatura desejada (${temp}°C).`
                : `Deixe o aparelho em modo Standby conectado na tomada.`}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-indigo-50/70 dark:bg-indigo-950/30 p-4 rounded-xl border-2 border-indigo-200 dark:border-indigo-800/80 relative">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Passo 2 (Crucial)</span>
            <h4 className="font-semibold text-sm text-indigo-950 dark:text-indigo-200 mt-1 flex items-center gap-1">
              Aperte TIMER até: <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded shadow-sm">{chosenHours}h</span>
            </h4>
            <p className="text-xs text-indigo-900/80 dark:text-indigo-300 mt-1 leading-relaxed">
              Como o controle só aceita de 1 em 1 hora, você deve pressionar o botão <strong>TIMER {actionType}</strong> até o visor marcar exatamente <strong>{chosenHours}h</strong>.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 relative">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Passo 3</span>
            <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100 mt-1">
              Confirme o 'Bip'
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Aponte para o ar condicionado. O aparelho emitirá um bip sonoro e a luz de TIMER (relógio/led amarelo) acenderá na carcaça.
            </p>
          </div>
        </div>

        {/* Comparison of the 3 integer choices */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Comparativo de Opções (Arredondamento)
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Meta exata: <strong className="text-slate-700 dark:text-slate-200">{targetTimeStr}</strong> (em {(rec.diffMinutes / 60).toFixed(1)}h)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Option Floor */}
            <div 
              onClick={() => onSelectOption('floor')}
              className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                selectedOption === 'floor'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Opção Menor</span>
                {selectedOption === 'floor' && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
              </div>
              <div className="text-2xl font-black text-slate-800 dark:text-white my-1">
                {rec.floorHours} <span className="text-sm font-semibold text-slate-500">horas</span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Irá {actionType === 'OFF' ? 'desligar' : 'ligar'} às <strong className="text-slate-900 dark:text-white">{rec.floorResult.timeStr}</strong>
              </div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                {rec.floorDeltaMinutes === 0 
                  ? '🎯 Exatamente no horário!' 
                  : `${Math.abs(rec.floorDeltaMinutes)} min mais cedo`}
              </div>
            </div>

            {/* Option Rounded (Recommended) */}
            <div 
              onClick={() => onSelectOption('rounded')}
              className={`cursor-pointer p-3.5 rounded-xl border-2 transition-all relative ${
                selectedOption === 'rounded'
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/30'
                  : 'border-indigo-300 dark:border-indigo-800 bg-white dark:bg-slate-800'
              }`}
            >
              <span className="absolute -top-2.5 right-3 bg-indigo-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                Mais Próximo
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">Recomendado</span>
                {selectedOption === 'rounded' && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
              </div>
              <div className="text-2xl font-black text-indigo-900 dark:text-indigo-200 my-1">
                {rec.roundedHours} <span className="text-sm font-semibold text-slate-500">horas</span>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                Irá {actionType === 'OFF' ? 'desligar' : 'ligar'} às <strong className="text-indigo-600 dark:text-indigo-400">{rec.roundedResult.timeStr}</strong>
              </div>
              <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-300 mt-1">
                {rec.roundedDeltaMinutes === 0
                  ? '🎯 Na mosca (0 min de diferença)!'
                  : rec.roundedDeltaMinutes > 0
                  ? `Diferença de apenas +${rec.roundedDeltaMinutes} min`
                  : `Diferença de apenas ${rec.roundedDeltaMinutes} min`}
              </div>
            </div>

            {/* Option Ceil */}
            <div 
              onClick={() => onSelectOption('ceil')}
              className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                selectedOption === 'ceil'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Opção Maior</span>
                {selectedOption === 'ceil' && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
              </div>
              <div className="text-2xl font-black text-slate-800 dark:text-white my-1">
                {rec.ceilHours} <span className="text-sm font-semibold text-slate-500">horas</span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Irá {actionType === 'OFF' ? 'desligar' : 'ligar'} às <strong className="text-slate-900 dark:text-white">{rec.ceilResult.timeStr}</strong>
              </div>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">
                {rec.ceilDeltaMinutes === 0 
                  ? '🎯 Exatamente no horário!' 
                  : `${rec.ceilDeltaMinutes} min mais tarde`}
              </div>
            </div>
          </div>
        </div>

        {/* Why hourly timers work this way explanation */}
        <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Entenda por que o controle é assim:</strong> A maioria dos controles remotos universais (KT-1000, KT-e08, Chunghop, etc.) não possui relógio interno de tempo real com minutos; eles contam um timer decrescente simples no próprio circuito do split (1h, 2h, 3h...). Por isso, ao escolher <strong>{chosenHours}h</strong> agora, o ar desliga/liga precisamente às <strong>{chosenResult.timeStr}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
