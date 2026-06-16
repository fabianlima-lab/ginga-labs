# Estilo de escrita — a casa Ginga Labs (método McKinsey)

Como toda peça é escrita. Destilado de um artigo real da McKinsey (*State of AI
trust in 2026*) — princípio da pirâmide aplicado a futebol. **Idioma padrão:
português.**

> Os exemplos abaixo usam **Brasil 1–2 Bélgica (Copa 2018)** — dados reais,
> minerados do StatsBomb open (`mining/passmap.py`), cada número re-derivável.
> Por contrato (`foundation.md`), exemplo de estilo também não inventa números.

## Os sete movimentos (em ordem)

1. **Título = o movimento, não o tema.** Nomeia a virada/tese com âncora.
   *"A noite em que o controle não bastou"* — não *"Análise de Brasil 1–2
   Bélgica"*.

2. **Resposta primeiro (lede answer-first).** O primeiro parágrafo é a
   conclusão de governo, antes de qualquer número. O leitor sabe o veredito na
   primeira linha. Depois vem o *por que importa*.

3. **O handle — uma frase-gancho que comprime a tese.** Um contraste curto e
   grudento que carrega o artigo. Ref. McKinsey: *"saying the wrong thing" vs
   "doing the wrong thing".* Nosso: *"o Brasil controlou tudo, menos o placar."*
   Toda peça precisa de um.

4. **Estrutura MECE, sinalizada.** Diga quantos blocos e que eles não se
   sobrepõem ("três blocos, um a um"). Pilares mutuamente exclusivos,
   coletivamente exaustivos.

5. **Todo header é uma frase-conclusão.** Ler só os títulos = ter o argumento
   inteiro. *"O controle comprou chances, não gols."* — nunca só *"Posse de
   bola"*.

6. **Todo parágrafo termina em significado, não no número.** Padrão fixo:
   **dado → mecanismo (o "como") → implicação (o "e daí?").** O número é a
   evidência, nunca o ponto final. Em cada pilar, feche com o que o time
   deveria fazer diferente.

7. **Reframe contrário ao senso comum.** Vire a suposição padrão de cabeça pra
   baixo, com prova. McKinsey: *"não é um imposto, é um habilitador".* Nosso:
   *"posse não é controle do jogo; é só controle da bola."*

## Disciplinas que sustentam o estilo

- **Número sempre com a régua colada** (regra de escopo de referência, ver
  `insight-method.md`): "baixo *para um favorito neste torneio*", nunca "baixo"
  solto. Cada stat aparece contra o adversário, a forma recente ou o coorte.
- **Firewall de atribuição**: os números são nossos ("os dados dizem…"); os
  eventos e falas vêm do registro ("a narração marcou…").
- **Honestidade no fim**: uma seção "o que os dados não respondem". O xG mede
  qualidade média de chance, não mérito absoluto — diga o que a métrica *não*
  prova.

## Anti-padrões (o que "alto demais" significava)

- Adjetivo sem mecanismo ("a Bélgica foi melhor na transição") sem o *como*
  (um contra-ataque do De Bruyne, Courtois defendendo tudo).
- Stat sem régua ("2,61 de xG") sem o contraste (vs 0,41 da Bélgica — e o
  Brasil perdeu).
- Parágrafo que termina no número em vez do "e daí".
- Elogio ao controle sem o alerta que ele esconde.
