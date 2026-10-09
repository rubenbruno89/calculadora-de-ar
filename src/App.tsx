/**
 * Este projeto agora é um ARQUIVO ÚNICO: `index.html`.
 *
 * Todo o estilo (CSS) e toda a lógica (JavaScript) estão embutidos nesse
 * arquivo, sem framework e sem etapa de build. Basta abrir `index.html` no
 * navegador — inclusive offline — ou salvá-lo no celular.
 *
 * Este módulo existe apenas para manter o `tsconfig.json` (include: ["src"])
 * apontando para pelo menos um arquivo durante checagens de tipo.
 */
export const SINGLE_FILE_ENTRY = "index.html";

export const FEATURES = [
  "relógio ao vivo no horário local",
  "horários de ligar e desligar com virada de dia",
  "arredondamento para horas inteiras (mais perto, depois ou antes)",
  "aviso quando os dois timers caem na mesma hora",
  "cópia do plano e persistência das escolhas",
] as const;
