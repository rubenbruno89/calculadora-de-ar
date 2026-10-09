import React from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  tag?: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Por que meu controle remoto universal só permite alterar de 1 em 1 hora?",
    answer: "A grande maioria dos controles universais (como modelos K-1028E, KT-1000, Chunghop, Elgin universal, etc.) utiliza um protocolo simples de 'Delay Timer' (temporizador decrescente de horas cheias) de 1h a 24h, em vez de um relógio com data e minutos. Isso barateia o produto e garante compatibilidade com centenas de marcas de splits que só aceitam esse sinal específico.",
    tag: "Hardware"
  },
  {
    question: "Como o ar sabe a hora se eu programar agora?",
    answer: "Ele não sabe a hora do dia! Quando você aperta 'TIMER 3h', o ar condicionado inicia um contador interno decrescente de 180 minutos (3 horas) a partir daquele exato instante. Se você apertar às 23:15, ele desligará às 02:15.",
    tag: "Funcionamento"
  },
  {
    question: "Como faço para ligar às 06:00 da manhã se vou dormir às 23:20?",
    answer: "A calculadora calcula exatamente isso! De 23:20 até 06:00 são 6 horas e 40 minutos. Como o controle não aceita fração, a opção mais próxima é programar 7h (ele ligará às 06:20) ou 6h (ele ligará às 05:20). Você escolhe na calculadora qual prefere!",
    tag: "Exemplo prático"
  },
  {
    question: "O ar precisa ficar apontado para o controle depois de programado?",
    answer: "Não! O sinal infravermelho é transmitido instantaneamente no momento em que você pressiona o botão no controle. Uma vez que o ar condicionado apitou e a luz 'TIMER' acendeu na evaporadora, você pode colocar o controle na mesa de cabeceira normalmente.",
    tag: "Dica importante"
  },
  {
    question: "Como cancelar o timer caso mude de ideia?",
    answer: "Aponte o controle para o ar e aperte o botão TIMER até o número zerar, ou procure pelo botão 'CANCEL'/'CLEAR' do controle. Em muitos modelos, desligar e ligar pelo botão POWER também reseta as configurações de timer ativas.",
    tag: "Cancelamento"
  },
  {
    question: "E se a energia acabar durante a noite?",
    answer: "Na maioria dos aparelhos, quedas de energia apagam a memória do timer do split. Ao retornar a energia, o ar condicionado voltará no modo prévio (ou desligado) e o timer terá sido cancelado.",
    tag: "Atenção"
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 md:p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm mt-6">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
          Dúvidas Frequentes sobre Controles Universais de Ar Condicionado
        </h3>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-3.5">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-start justify-between text-left gap-3 group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {faq.tag && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300">
                      {faq.tag}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {faq.question}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
              </button>

              {isOpen && (
                <p className="mt-2 text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-1">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
