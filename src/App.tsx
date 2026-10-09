import React from 'react';
import { 
  Clock, 
  Power, 
  Calculator, 
  Info, 
  Moon, 
  Sun, 
  Zap,
  RotateCw,
  Sparkles
} from 'lucide-react';
import { formatTimeHM, calculateHourlyRecommendations, parseTimeToMinutes } from './utils/timerCalculations';
import { RemoteSimulator } from './components/RemoteSimulator';
import { StepGuide } from './components/StepGuide';
import { CountdownTracker } from './components/CountdownTracker';
import { ScenarioPresets, ScenarioItem } from './components/ScenarioPresets';
import { FaqSection } from './components/FaqSection';
import confetti from 'canvas-confetti';

export function App() {
  // Current live time
  const [currentTime, setCurrentTime] = React.useState<Date>(new Date());
  const [manualTimeMode, setManualTimeMode] = React.useState(false);
  const [customCurrentTimeStr, setCustomCurrentTimeStr] = React.useState('22:45');

  // Configuration
  const [actionType, setActionType] = React.useState<'OFF' | 'ON'>('OFF');
  const [targetTimeStr, setTargetTimeStr] = React.useState('06:00');
  const [temp, setTemp] = React.useState(23);
  const [selectedOption, setSelectedOption] = React.useState<'rounded' | 'floor' | 'ceil'>('rounded');
  const [activeScenarioId, setActiveScenarioId] = React.useState<string | undefined>('sleep-night');
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Update clock every second if not manual mode
  React.useEffect(() => {
    if (manualTimeMode) return;
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [manualTimeMode]);

  // Derive current minutes from midnight
  const effectiveCurrentMinutes = React.useMemo(() => {
    if (manualTimeMode) {
      return parseTimeToMinutes(customCurrentTimeStr);
    }
    return currentTime.getHours() * 60 + currentTime.getMinutes();
  }, [manualTimeMode, customCurrentTimeStr, currentTime]);

  const effectiveCurrentTimeFormatted = React.useMemo(() => {
    if (manualTimeMode) {
      return customCurrentTimeStr;
    }
    return formatTimeHM(currentTime.getHours(), currentTime.getMinutes());
  }, [manualTimeMode, customCurrentTimeStr, currentTime]);

  const targetMinutes = React.useMemo(() => {
    return parseTimeToMinutes(targetTimeStr);
  }, [targetTimeStr]);

  const recommendations = React.useMemo(() => {
    return calculateHourlyRecommendations(effectiveCurrentMinutes, targetMinutes);
  }, [effectiveCurrentMinutes, targetMinutes]);

  const chosenHours = selectedOption === 'rounded' 
    ? recommendations.roundedHours 
    : selectedOption === 'floor' 
    ? recommendations.floorHours 
    : recommendations.ceilHours;

  const chosenResult = selectedOption === 'rounded'
    ? recommendations.roundedResult
    : selectedOption === 'floor'
    ? recommendations.floorResult
    : recommendations.ceilResult;

  const handleScenarioSelect = (sc: ScenarioItem) => {
    setActiveScenarioId(sc.id);
    setActionType(sc.actionType);
    setTargetTimeStr(sc.suggestedTargetTime);
    setSelectedOption('rounded');
    try {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch {
      // Ignore confetti issues if any
    }
  };

  const handleRemoteHoursChange = (hours: number) => {
    // If user changes hours directly on remote, update selection
    if (hours === recommendations.floorHours) {
      setSelectedOption('floor');
    } else if (hours === recommendations.ceilHours) {
      setSelectedOption('ceil');
    } else {
      setSelectedOption('rounded');
    }
  };

  // Quick preset hour shortcuts
  const handleQuickAddTarget = (hoursFromNow: number) => {
    const total = (effectiveCurrentMinutes + hoursFromNow * 60) % 1440;
    const h = Math.floor(total / 60);
    const m = total % 60;
    setTargetTimeStr(formatTimeHM(h, m));
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} transition-colors duration-200 font-sans`}>
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-base md:text-lg tracking-tight leading-none text-slate-900 dark:text-white">
                Calculadora de Timer <span className="text-indigo-600 dark:text-indigo-400">Ar Condicionado</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Para controles que só programam de 1 em 1 hora
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 cursor-pointer"
              title="Alternar tema claro/escuro"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6">
        
        {/* Banner Explanatório Amigável */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800 text-white rounded-3xl p-5 md:p-7 shadow-xl shadow-indigo-500/10 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white/95">
              <Sparkles className="w-3.5 h-3.5" /> Solução para o seu controle universal
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
              Seu controle não aceita minutos? Não se preocupe!
            </h2>
            <p className="text-xs md:text-sm text-indigo-100 leading-relaxed">
              Diga que horas você quer que o ar <strong className="text-white underline decoration-amber-400 underline-offset-2">{actionType === 'OFF' ? 'desligue' : 'ligue'}</strong>. Nós calculamos quantas horas inteiras você deve apertar no controle a partir de agora e mostramos o visor exato.
            </p>
          </div>
          
          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Grid: Left Column (Controls & Inputs) + Right Column (Remote Simulator) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Configuration & Calculator (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Input card: Horários e Ação */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 md:p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-5">
              
              {/* Select Action (Turn OFF vs Turn ON) */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  1. O que você quer fazer?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setActionType('OFF');
                      setActiveScenarioId(undefined);
                    }}
                    className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                      actionType === 'OFF'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/30'
                    }`}
                  >
                    <Power className={`w-4 h-4 ${actionType === 'OFF' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>DESLIGAR o Ar</span>
                  </button>

                  <button
                    onClick={() => {
                      setActionType('ON');
                      setActiveScenarioId(undefined);
                    }}
                    className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                      actionType === 'ON'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/30'
                    }`}
                  >
                    <RotateCw className={`w-4 h-4 ${actionType === 'ON' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>LIGAR o Ar</span>
                  </button>
                </div>
              </div>

              {/* Horário Atual vs Horário Desejado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Current Time Box */}
                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" /> Hora Atual
                    </span>
                    <button
                      onClick={() => setManualTimeMode(!manualTimeMode)}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                    >
                      {manualTimeMode ? 'Usar hora real' : 'Simular outra hora'}
                    </button>
                  </div>

                  {manualTimeMode ? (
                    <input
                      type="time"
                      value={customCurrentTimeStr}
                      onChange={(e) => setCustomCurrentTimeStr(e.target.value)}
                      className="w-full text-2xl font-mono font-bold bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-700 rounded-lg p-2 text-slate-800 dark:text-white"
                    />
                  ) : (
                    <div>
                      <div className="text-3xl font-mono font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {effectiveCurrentTimeFormatted}
                        <span className="text-sm font-normal text-slate-400 ml-1">
                          :{String(currentTime.getSeconds()).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Relógio ao vivo do seu aparelho
                      </div>
                    </div>
                  )}
                </div>

                {/* Target Time Box */}
                <div className="bg-indigo-50/60 dark:bg-indigo-950/30 p-4 rounded-xl border-2 border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> 
                      Hora que você quer {actionType === 'OFF' ? 'desligar' : 'ligar'}
                    </span>
                  </div>

                  <input
                    type="time"
                    value={targetTimeStr}
                    onChange={(e) => {
                      setTargetTimeStr(e.target.value);
                      setActiveScenarioId(undefined);
                    }}
                    className="w-full text-3xl font-mono font-black bg-white dark:bg-slate-800 border-2 border-indigo-400 dark:border-indigo-600 rounded-xl p-2 text-indigo-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  
                  <div className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-1 font-medium">
                    Faltam exatos <strong>{Math.floor(recommendations.diffMinutes / 60)}h {recommendations.diffMinutes % 60}min</strong>
                  </div>
                </div>
              </div>

              {/* Fast buttons for common hours */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-2">
                  Atalhos rápidos para horário alvo:
                </span>
                <div className="flex flex-wrap gap-2">
                  {['05:30', '06:00', '06:30', '07:00', '08:00', '18:00'].map(t => (
                    <button
                      key={t}
                      onClick={() => {
                        setTargetTimeStr(t);
                        setActiveScenarioId(undefined);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                        targetTimeStr === t
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                  <button
                    onClick={() => handleQuickAddTarget(4)}
                    className="text-xs px-2.5 py-1 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    +4 horas
                  </button>
                  <button
                    onClick={() => handleQuickAddTarget(8)}
                    className="text-xs px-2.5 py-1 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    +8 horas (noite inteira)
                  </button>
                </div>
              </div>
            </div>

            {/* MAIN RECOMMENDATION CARD - BIG & BOLD */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Clock className="w-36 h-36" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wide uppercase">
                  <span>✨</span> O que apertar no controle
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/20 pb-4">
                  <div>
                    <span className="text-xs text-indigo-100 uppercase tracking-wider block font-semibold">
                      Configure no botão TIMER {actionType}:
                    </span>
                    <div className="text-5xl md:text-6xl font-black font-mono tracking-tight text-white mt-1">
                      {chosenHours} <span className="text-2xl font-bold">HORAS</span>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-right">
                    <span className="text-[11px] text-indigo-100 block">Horário exato da ação:</span>
                    <span className="text-2xl font-black text-amber-300 font-mono">
                      {chosenResult.timeStr}
                    </span>
                    {chosenResult.isNextDay && (
                      <span className="text-[10px] block text-indigo-200">(no dia seguinte)</span>
                    )}
                  </div>
                </div>

                {/* Accuracy feedback */}
                <div className="flex items-center gap-2 text-xs text-indigo-100">
                  <Info className="w-4 h-4 shrink-0 text-amber-300" />
                  <span>
                    Diferença do seu pedido inicial ({targetTimeStr}): {' '}
                    <strong className="text-white">
                      {Math.abs(recommendations.roundedDeltaMinutes) === 0
                        ? 'Zero minutos (cravado!)'
                        : `${Math.abs(recommendations.roundedDeltaMinutes)} minutos ${
                            recommendations.roundedDeltaMinutes > 0 ? 'mais tarde' : 'mais cedo'
                          }`}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Step Guide & Comparison Card */}
            <StepGuide
              currentMinutes={effectiveCurrentMinutes}
              targetTimeStr={targetTimeStr}
              actionType={actionType}
              selectedOption={selectedOption}
              onSelectOption={setSelectedOption}
              temp={temp}
            />

            {/* Countdown Tracker */}
            <CountdownTracker
              timerHours={chosenHours}
              actionType={actionType}
              targetResultTime={chosenResult.timeStr}
            />

          </div>

          {/* RIGHT: Remote Simulator & Quick Assistant (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Remote Simulator Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-sm text-center">
              <div className="flex items-center justify-between mb-4 text-left">
                <div>
                  <h3 className="font-bold text-base text-slate-800 dark:text-white flex items-center gap-2">
                    <span>📱</span> Seu Controle Virtual
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Veja como o display do seu controle deve ficar
                  </p>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                  Sincronizado
                </span>
              </div>

              {/* The Remote Control Component */}
              <RemoteSimulator
                timerHours={chosenHours}
                timerMode={actionType}
                onHoursChange={handleRemoteHoursChange}
                temp={temp}
                onTempChange={setTemp}
              />

              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs text-slate-600 dark:text-slate-300 text-left border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                  <span>💡</span> Dica rápida:
                </div>
                <p>
                  No seu controle físico real, aperte a tecla <strong>TIMER</strong> até o número no visor LCD mudar para <strong>{chosenHours}h</strong>.
                </p>
              </div>
            </div>

            {/* Calculation summary cheat sheet card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
              <h4 className="font-bold text-sm tracking-wide text-indigo-300 uppercase flex items-center gap-2">
                <Calculator className="w-4 h-4" /> Resumo do Cálculo
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Hora de partida:</span>
                  <span className="font-mono font-bold text-white">{effectiveCurrentTimeFormatted}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Hora desejada original:</span>
                  <span className="font-mono font-bold text-white">{targetTimeStr}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Tempo exato até a meta:</span>
                  <span className="font-mono font-bold text-indigo-300">
                    {Math.floor(recommendations.diffMinutes / 60)}h e {recommendations.diffMinutes % 60}m ({recommendations.exactHoursDecimal.toFixed(2)}h)
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Horas inteiras ajustadas:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {chosenHours} horas cheias
                  </span>
                </div>
                <div className="flex justify-between py-1.5 pt-2">
                  <span className="text-slate-400 font-semibold">Hora que o ar vai desligar/ligar:</span>
                  <span className="font-mono font-extrabold text-amber-400 text-base">
                    {chosenResult.timeStr}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Presets and Scenarios */}
        <ScenarioPresets
          onSelectScenario={handleScenarioSelect}
          activeId={activeScenarioId}
        />

        {/* FAQ Section */}
        <FaqSection />

        {/* Footer */}
        <footer className="text-center py-6 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
          <p>
            Calculadora desenvolvida especialmente para controles remotos universais de ar condicionado com passos de 1 hora.
          </p>
          <p className="mt-1">
            Compatível com Gree, Midea, Springer, Carrier, LG, Samsung, Consul, Elgin, Fujitsu, TCL e marcas genéricas de controle remoto universal (KT-1000, KT-e08, K-1028E, Chunghop).
          </p>
        </footer>

      </main>
    </div>
  );
}

export default App;
