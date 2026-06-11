# Teaser Jogável — Documento de Design (v0.1, para revisão)

> Codinome do projeto: **"Várzea"** (placeholder até batizarmos o jogo).
> Este documento é o escopo do teaser de 15–20 minutos que valida a tese.
> Status: rascunho do Claude — aguardando revisão do diretor criativo (Fabian).

## A hipótese que o teaser testa

**"Uma narrativa de futebol genuinamente brasileira emociona o suficiente pra
fazer as pessoas terminarem, compartilharem e pedirem o jogo completo."**

Tudo que não serve a essa pergunta fica fora do escopo.

## Formato

- Roda no **navegador** (desktop e celular), sem cadastro, sem download.
- **Português primeiro.** Inglês depois, se viralizar.
- 100% texto + UI leve (sem arte cara): a emoção vem da escrita e do ritmo.
- Duração-alvo: 15–20 min. Rejogável (finais múltiplos).

## Estrutura narrativa

### Ato 0 — A abertura (30 segundos)
Sem menu. Sem tutorial. Texto direto:

> *"Você é o novo treinador do **Esporte Clube Aliança**, lanterna do
> estadual, três meses de salário atrasado. O presidente aperta sua mão:
> 'Escapa do rebaixamento que a gente paga o que deve. Talvez.'"*

### Ato 1 — A descoberta (min 1–5)
Domingo. Torneio de várzea no bairro. O olheiro do clube insistiu pra você ir.
Você vê **o menino**: 16 anos, franzino, e uma ficha que nenhum FM tem:

| Atributo | Valor |
|---|---|
| Ginga | 18 |
| Marra | 16 |
| Frieza | 8 |
| Raça | 14 |

**Decisão 1:** gastar o pouco caixa do clube pra contratá-lo, ou economizar
pro salário do elenco? O jogo lembra da escolha.

### Ato 2 — O loop (min 5–15): 3 rodadas de decisão → partida → consequência

Cada rodada:

1. **Decisão narrativa.** Exemplos do banco de eventos:
   - O menino faltou ao treino: a mãe não tinha o dinheiro da passagem e ele
     tem vergonha de dizer. Paga do bolso? Cobra disciplina? Manda o roupeiro
     buscar de moto?
   - O lateral experiente reclama do menino: "esse moleque se acha". Conversa,
     pune, ou deixa o vestiário resolver?
   - Um repórter local pede entrevista sobre "a joia da várzea". Expor o menino
     cedo demais ou protegê-lo?
2. **Partida com narração de rádio brasileira** (texto pulsando lance a lance):
   > *"Olha ele aí... a ginga do menino, passou por um, passou por DOIS, vai
   > pra dentro, BATEEEEU... NA TRAVE, MINHA NOSSA SENHORA!"*
   - 2–3 intervenções táticas por jogo (intervalo + aos 80').
   - O simulador usa os atributos de verdade (Ginga alta = mais dribles no
     texto; Frieza baixa = chance de falhar no momento decisivo).
3. **Consequência:** manchete do jornal fictício da cidade, ligação do
   presidente, o empresário rondando.

### Ato 3 — O dilema final (min 15–18)
Último jogo: você precisa do menino pra escapar do rebaixamento. O empresário
traz proposta de um clube grande — boa pro clube AGORA, provavelmente ruim pro
garoto (vai pro banco apodrecer). A mãe dele pergunta sua opinião, de pai pra
pai. **Não existe resposta certa.** Você escolhe, joga a última partida, vê o
epílogo: o que aconteceu com o menino, com o clube, com você.

### Tela final — o card compartilhável
Estilo Wordle: resultado da run em imagem pronta pra WhatsApp/X:

> *"Salvei o Aliança do rebaixamento, mas vendi o Craque da Várzea.
> Ele nunca mais foi o mesmo. — Final 7 de 11"*

Finais múltiplos (alvo: 8–12) → comparação social ("você teve QUAL final?!")
→ rejogada → viralização. Embaixo do card:

> **"Isso foi um domingo. O jogo completo é a carreira inteira."**
> [Jogar de novo] [Wishlist na Steam] [Entrar na lista] [Discord]

## Métricas (instrumentação embutida)

| Métrica | O que prova | Meta de validação |
|---|---|---|
| % que completa o teaser | O gancho segura | > 40% dos que iniciam |
| Compartilhamentos do card | Potencial viral | métrica de ouro — observar |
| Cliques wishlist/email | Intenção de compra | > 10% dos que completam |
| Rejogadas | Profundidade percebida | > 15% jogam 2ª vez |

## Fora de escopo (deliberadamente)

Temporada completa, mercado de transferências livre, escalação detalhada,
servidor MCP/IA (segunda onda, funil dev), persistência de save complexa,
arte de personagens. O teaser é **trilho com ramificações**, não sandbox.

## Papel do diretor criativo (Fabian)

- Revisar TODO o texto: a narração tem que soar rádio brasileira de verdade,
  a gíria certa, nomes de clube com cheiro de interior.
- Decidir o tom dos dilemas (até onde vai o peso social).
- Playtest de ritmo: onde arrasta, onde acelera.
