import React from 'react';
import { 
  Moon, 
  Briefcase, 
  Coffee, 
  Baby, 
  Flame,
  ArrowRight
} from 'lucide-react';

export interface ScenarioItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  actionType: 'OFF' | 'ON';
  suggestedTargetTime: string; // e.g. "06:00"
  description: string;
  badge?: string;
}

interface ScenarioPresetsProps {
  onSelectScenario: (scenario: ScenarioItem) => void;
  activeId?: string;
}

export const ScenarioPresets: React.FC<ScenarioPresetsProps> = ({
  onSelectScenario,
  activeId
}) => {
  const scenarios: ScenarioItem[] = [
    {
      id: 'sleep-night',
      title: 'Dormir Fresquinho & Desligar de Manhã',
      subtitle: 'Ideal para economizar luz enquanto dorme',
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
      actionType: 'OFF',
      suggestedTargetTime: '06:00',
      description: 'Deixa o quarto gelado no início da noite e desliga ao amanhecer.',
      badge: 'Mais Usado'
    },
    {
      id: 'sleep-midnight',
      title: 'Desligar de Madrugada (Garganta Seca)',
      subtitle: 'Desliga no meio da noite (3h às 4h)',
      icon: <Baby className="w-5 h-5 text-purple-400" />,
      actionType: 'OFF',
      suggestedTargetTime: '03:30',
      description: 'Evita acordar com frio extremo ou tosse no meio da madrugada.',
    },
    {
      id: 'morning-wakeup',
      title: 'Ligar Pouco Antes de Acordar',
      subtitle: 'Ar liga sozinho às 06:30 para refrescar o dia',
      icon: <Coffee className="w-5 h-5 text-amber-500" />,
      actionType: 'ON',
      suggestedTargetTime: '06:30',
      description: 'Acorde com o quarto na temperatura perfeita sem passar calor.',
    },
    {
      id: 'work-from-home',
      title: 'Home Office / Almoço',
      subtitle: 'Desligar às 12:00 no intervalo',
      icon: <Briefcase className="w-5 h-5 text-emerald-500" />,
      actionType: 'OFF',
      suggestedTargetTime: '12:00',
      description: 'Programar o desligamento automático para a hora de pausar o trabalho.',
    },
    {
      id: 'return-home',
      title: 'Ligar Antes de Chegar da Rua',
      subtitle: 'Chegar em casa com o quarto já gelado',
      icon: <Flame className="w-5 h-5 text-rose-500" />,
      actionType: 'ON',
      suggestedTargetTime: '18:30',
      description: 'Deixe o timer ligado antes de sair para o ar estar frio na volta.',
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-slate-800 dark:text-white flex items-center gap-2">
            <span>⚡</span> Cenários Prontos do Dia a Dia
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Clique em um cenário comum para preencher o horário desejado em 1 toque
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {scenarios.map((sc) => {
          const isSelected = activeId === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc)}
              className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between group cursor-pointer ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-850'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-xs border border-slate-200/60 dark:border-slate-700">
                    {sc.icon}
                  </div>
                  {sc.badge && (
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                      {sc.badge}
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {sc.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {sc.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[11px] font-semibold">
                <span className="text-slate-600 dark:text-slate-300">
                  Meta: <strong className="text-indigo-600 dark:text-indigo-400">{sc.suggestedTargetTime}</strong> ({sc.actionType === 'OFF' ? 'Desligar' : 'Ligar'})
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center">
                  Usar <ArrowRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
