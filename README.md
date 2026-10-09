# ❄️ Calculadora de Ar

**Transforme o horário em que você quer ligar e desligar o ar-condicionado em horas inteiras para programar no controle universal.**

[![Abrir o site](https://img.shields.io/badge/abrir%20o%20site-rubenbruno89.github.io-3155e7?style=for-the-badge&labelColor=172028)](https://rubenbruno89.github.io/calculadora-de-ar/)
[![Sem build](https://img.shields.io/badge/build-nenhum-80a337?style=for-the-badge&labelColor=172028)](#-tecnologias)
[![Arquivo único](https://img.shields.io/badge/arquivo-único-e6a12c?style=for-the-badge&labelColor=172028)](#-estrutura)

**→ https://rubenbruno89.github.io/calculadora-de-ar/ ←**

</div>

---

## 📌 O problema

Controles universais de ar-condicionado costumam ter timer **LIGAR (ON)** e **DESLIGAR (OFF)** que funcionam por **contagem de horas inteiras**: 1h, 2h, 3h… até 10h ou 24h, dependendo do modelo.

O resultado é que **não dá para digitar "22:37"**. Você precisa responder à pergunta:

> *"Daqui a quantas **horas inteiras** o aparelho deve agir?"*

Fazer essa conta de cabeça — ainda mais quando o horário passa da meia-noite — quase sempre sai errado. Esta calculadora resolve isso em dois cliques.

---

## 💡 A solução

Você informa **a hora que quer ligar** e **a hora que quer desligar**. A página:

1. lê o **relógio do seu aparelho** (horário local, atualizado a cada segundo);
2. descobre qual timer vem primeiro, de acordo com o **estado atual do ar** (ligado ou desligado);
3. calcula quantos minutos faltam para cada ação, mesmo com **virada de dia**;
4. arredonda para **horas inteiras**, no modo que você escolher;
5. mostra **o que digitar no controle** e a **previsão real** de quando o timer vai agir.

### Exemplo

Agora são **21:20**. Você quer ligar às **22:00** e desligar às **06:00**, com o ar desligado:

| Passo | Timer | Conta | Programe |
|---|---|---|---|
| 01 | `TIMER ON` | 22:00 − 21:20 = 40 min → arredonda | **1 hora** |
| 02 | `TIMER OFF` | 06:00 de amanhã = 8h40 min → arredonda | **9 horas** |

Como cada timer conta a partir do momento em que é programado, a contagem do segundo timer começa **no instante do primeiro** — e a calculadora já considera isso na previsão.

---

## ✨ Funcionalidades

- 🕐 **Relógio ao vivo** no horário local do aparelho, com segundos.
- 🔁 **Virada de dia automática**: desligar às 06:00 quando agora é 21:00 cai no dia seguinte, sem você se preocupar.
- 🧠 **Ordem dos timers inteligente**: o estado atual do ar define se o `TIMER ON` ou o `TIMER OFF` vem primeiro.
- 🎯 **Três modos de arredondamento**:
  | Modo | Comportamento | Melhor para |
  |---|---|---|
  | **Mais perto** | Arredonda para a hora inteira mais próxima | Erro mínimo |
  | **Depois** | Arredonda para cima | O timer **não** pode agir antes do horário |
  | **Antes** | Arredonda para baixo | O timer pode agir um pouco mais cedo |
- ⚠️ **Aviso de colisão**: se o arredondamento escolhido fizer os dois timers caírem na mesma hora, você é avisado.
- 📋 **Copiar plano**: copia as duas instruções prontas para anotar ou enviar por mensagem.
- 💾 **Memória local**: horários, estado do ar e modo de arredondamento ficam salvos no navegador (sem servidor, sem cookie).
- 📱 **Responsivo**: funciona bem do celular ao desktop, com foco em uso no sofá, perto do aparelho.
- ♿ **Acessível**: navegação por teclado, `aria-pressed` nos botões, contraste alto e respeito a `prefers-reduced-motion`.
- 🔌 **Funciona offline**: tudo está embutido em um único arquivo HTML.

---

## 🚀 Como usar

1. Abra **[rubenbruno89.github.io/calculadora-de-ar](https://rubenbruno89.github.io/calculadora-de-ar/)**.
2. Veja a **hora atual** no canto do cabeçalho.
3. Em **01 / Seu plano**, escolha **LIGAR ÀS** e **DESLIGAR ÀS** (o horário de desligar pode ser no dia seguinte).
4. Diga se o ar está **desligado** ou **ligado** agora — isso define qual timer vem primeiro.
5. Escolha a **precisão do controle** (modo de arredondamento).
6. Em **02 / No controle**, siga as duas instruções e programe o controle.
7. Toque em **Copiar plano** se quiser salvar ou enviar a anotação.

> 💡 **Dica:** salve a página no celular (`Ctrl+S` no computador, ou "Adicionar à tela de início"). Ela abre depois mesmo sem internet — útil no quarto, onde o sinal costuma ser ruim.

---

## 🧮 Como o cálculo funciona

A lógica é curta e transparente, em JavaScript puro.

```js
// 1. Próxima ocorrência de um horário, respeitando a virada do dia
function nextOccurrence(value, reference, strictlyAfter) {
  const base = startOfMinute(reference);
  const candidate = atTime(base, value);          // hoje, no horário escolhido
  const precisaOutroDia = strictlyAfter
    ? candidate.getTime() <= base.getTime()       // precisa ser depois do 1º timer
    : candidate.getTime() < base.getTime();       // precisa ser no futuro

  if (precisaOutroDia) candidate.setDate(candidate.getDate() + 1);
  return candidate;
}

// 2. Arredondamento para horas inteiras
function wholeHours(minutes, rounding) {
  const exactHours = Math.max(0, minutes / 60);
  if (rounding === "up")   return Math.ceil(exactHours);   // depois
  if (rounding === "down") return Math.floor(exactHours);  // antes
  return Math.round(exactHours);                           // mais perto
}
```

**Fluxo completo:**

```
agora ──► alvo do 1º timer ──► alvo do 2º timer
              │                        │
        minutos até lá          minutos até lá
              │                        │
        arredonda (hora)        arredonda (hora)
              │                        │
        TIMER ON  = N horas     TIMER OFF = M horas
```

**Dois detalhes importantes:**

- A ordem dos timers é decidida pelo estado do aparelho: **desligado → liga primeiro**; **ligado → desliga primeiro**.
- Os horários são comparados em minutos inteiros, o que evita desvios de segundos e casos de borda no fuso horário local.

### ⚠️ Ressalva sobre o seu controle

O cálculo assume que **cada timer começa a contar no momento em que você o programa**. Alguns controles, porém, só iniciam a contagem do `TIMER OFF` quando o aparelho **já está ligado**. Se o seu for assim, programe os dois timers **na ordem indicada** e confirme o comportamento no manual do modelo. Essa limitação está documentada na própria página, na seção **03**.

---

## 🛠️ Tecnologias

| Camada | Escolha |
|---|---|
| Marcação | HTML5 semântico (`section`, `article`, `aria-*`) |
| Estilo | CSS3 puro — **sem Tailwind**, **sem framework** |
| Lógica | JavaScript vanilla (ES5-safe, sem dependências) |
| Ícones | SVG inline + emoji |
| Fontes | `Manrope` e `DM Mono`, com fallback de sistema |
| Build | Nenhum. É um único `index.html` |

Sem `node_modules`, sem bundler, sem pipeline. O que está no repositório é o que roda no navegador.

---

## 📁 Estrutura

```
calculadora-de-ar/
├── index.html   # página completa: CSS + JS embutidos
└── README.md    # este arquivo
```

---

## 💻 Rodar localmente

**Opção 1 — abrir direto**

Baixe `index.html` e dê dois cliques. Pronto.

**Opção 2 — servir por HTTP** (recomendado para testar o clipboard e a persistência)

```bash
# Python 3
python3 -m http.server 8080

# ou Node.js
npx serve .
```

Depois acesse `http://localhost:8080`.

---

## 🌐 Publicar no GitHub Pages

1. Envie os arquivos para o repositório:

   ```bash
   git add index.html README.md
   git commit -m "feat: calculadora de timer do ar-condicionado"
   git push origin main
   ```

2. No GitHub, abra **Settings → Pages**.
3. Em **Source**, escolha **Deploy from a branch**.
4. Em **Branch**, selecione **main** e a pasta **/(root)**, e salve.
5. Aguarde alguns minutos e acesse:

   **https://rubenbruno89.github.io/calculadora-de-ar/**

> 📝 **Para atualizar:** basta fazer `git push` na branch `main`. O Pages publica automaticamente em 1 a 3 minutos — use `Ctrl+Shift+R` para ignorar o cache do navegador.

---

## 🗺️ Possíveis melhorias

- [ ] Modo em que o `TIMER OFF` conta a partir do momento do `TIMER ON`.
- [ ] Suporte a controles com timer de **meia hora** (0,5h).
- [ ] Agendamento diário recorrente, com histórico de ciclos.
- [ ] Tradução para inglês e espanhol.
- [ ] Instalação como PWA, com ícone na tela inicial.

Sugestões são bem-vindas — abra uma **issue** ou envie um **pull request**.

---

## 📄 Licença

Distribuído sob a licença [MIT](LICENSE). Use, estude e adapte livremente.

---

<div align="center">

**Feito para acabar com a conta de cabeça na hora de programar o ar-condicionado.** ❄️

[Abrir o site](https://rubenbruno89.github.io/calculadora-de-ar/) · [Reportar um problema](../../issues)

</div>
