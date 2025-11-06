# Breakout Calendar

Um jogo no estilo Breakout/Arkanoid com tema de agenda de compromissos, desenvolvido em JavaScript Vanilla.

## 🎮 Sobre o Jogo

Quebre os compromissos da sua agenda virtual usando uma raquete e uma bola! Cada tipo de compromisso tem uma resistência diferente, criando níveis variados de dificuldade.

### 💡 Motivação

A motivação para fazer este mini jogo vem de [memes de Instagram](https://www.instagram.com/p/DNgjJOxyRy6/).

### Tipos de Blocos

Os blocos agora apresentam visual inspirado no Google Calendar, com cantos arredondados, borda de destaque à esquerda e exibição de nomes e horários dos compromissos:

#### Segunda a Sexta
- **Compromissos Leves** (Verde) - 1 hit - 10 pontos
  - Focus Mode, Study Time, Daily Sync
- **Compromissos Médios** (Laranja) - 2 hits - 20 pontos
  - 1:1 Meeting, Team Meeting, Team Planning, Team Retro
- **Compromissos Difíceis** (Vermelho) - 3 hits - 30 pontos
  - Team Building, Perf. Review
- **Indestrutível** (Gradiente Wildtech) - Indestrutível - 0 pontos
  - All Hands, EoY Party (apenas 1 por jogo)

#### Sábado e Domingo (Fim de Semana)
- **Compromissos Leves** (Verde) - 1 hit - 10 pontos
  - Groceries, Park, Basketball, Soccer
- **Compromissos Médios** (Laranja) - 2 hits - 20 pontos
  - House Cleaning, Garage Sale
- **Compromissos Difíceis** (Vermelho) - 3 hits - 30 pontos
  - Gardening, Family Lunch
- **Indestrutível** (Gradiente Wildtech) - Indestrutível - 0 pontos
  - All Hands, EoY Party (apenas 1 por jogo)

### Layout do Jogo

O jogo possui 7 colunas representando os dias da semana (Segunda a Domingo) e 6 fileiras de compromissos, totalizando 42 blocos por partida.

## 🎯 Como Jogar

1. Digite seu nome (máximo 3 letras)
2. Use as setas do teclado (←/→) ou A/D para mover a raquete
3. Use o mouse ou touch para controle mais preciso
4. Pressione ESPAÇO para pausar/retomar
5. Pressione ESC para voltar ao menu principal
6. Quebre todos os blocos destrutíveis para vencer!

## 🌐 Acesso Online

Jogue online em: [https://dwildt.github.io/breakoutcalendar](https://dwildt.github.io/breakoutcalendar)

## 🛠 Tecnologias

- **JavaScript Vanilla** - Lógica do jogo
- **HTML5 Canvas** - Renderização gráfica
- **CSS3** - Estilização e responsividade
- **Jest** - Testes unitários
- **ESLint** - Qualidade e padronização de código
- **LocalStorage** - Persistência de dados

## 🎨 Design

- **Cores**: Paleta Wildtech (Laranja #ff7b00, Marrom #8b4513)
- **Layout**: Responsivo para desktop, tablet e mobile
- **Internacionalização**: Português, Inglês e Espanhol

## 🧪 Executando os Testes

```bash
# Instalar dependências
npm install

# Executar testes
npm test

# Executar testes em modo watch
npm test:watch

# Executar testes com coverage
npm test:coverage
```

Para mais detalhes sobre testes, consulte o arquivo [testing.md](testing.md).

## 🔍 Qualidade de Código (Linting)

O projeto utiliza ESLint para garantir qualidade e consistência do código.

```bash
# Verificar problemas de código
npm run lint

# Corrigir problemas automaticamente
npm run lint:fix
```

**Padrão de código:**
- Indentação: 4 espaços
- Aspas: Simples ('...')
- Ponto-e-vírgula: Obrigatório
- Ambiente: Browser + ES2021

## 🌍 Internacionalização

O jogo suporta três idiomas:
- **Português (pt)** - Idioma padrão
- **Inglês (en)**  
- **Espanhol (es)**

Para mais informações sobre tradução, consulte o arquivo [i18n.md](i18n.md).

## 🏆 Sistema de Recordes

- Armazena os 10 melhores recordes localmente
- Ordenação por pontuação e blocos destruídos
- Exportação/importação de recordes
- Suporte a múltiplos jogadores

## 🚀 Executando Localmente

1. Clone o repositório
2. Abra o arquivo `index.html` em um navegador moderno
3. Ou use um servidor local:

```bash
npm run serve
```

## 🤝 Contribuindo

Para reportar bugs ou sugerir melhorias, abra uma [issue no GitHub](https://github.com/dwildt/breakoutcalendar/issues).

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 💖 Apoio

Gostou do projeto? Considere [apoiar o desenvolvimento](https://github.com/sponsors/dwildt)!

