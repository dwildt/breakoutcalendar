# Sistema de Traduções

Este diretório contém os arquivos de tradução para o jogo Breakout Calendar.

## Estrutura

- `pt.json` - Traduções em Português (Brasil)
- `en.json` - Traduções em Inglês  
- `es.json` - Traduções em Espanhol

## Adicionando Novas Traduções

Para adicionar um novo idioma:

1. Crie um novo arquivo JSON nomeado com o código do idioma (ex: `fr.json` para Francês)
2. Copie a estrutura de um arquivo de tradução existente
3. Traduza todos os valores de texto
4. Adicione o código do idioma ao array `supportedLanguages` em `js/i18n.js`

## Chaves de Tradução

### Interface do Jogo
- `title`, `gameTitle` - Título da página e do jogo
- `player`, `score`, `lives` - Rótulos das estatísticas do jogo
- `pause`, `restart`, `resume` - Botões de controle do jogo
- `start`, `playAgain` - Botões de fluxo do jogo

### Conteúdo do Jogo
- `welcome`, `instructions` - Texto da tela inicial
- `legend` - Título da legenda dos blocos
- `lightAppointment`, `mediumAppointment`, `meetingAppointment`, `allHandsAppointment` - Descrições dos tipos de blocos
- `enterName` - Rótulo do campo de nome do jogador
- `records` - Título da seção de recordes
- `gameOver`, `congratulations` - Títulos de fim de jogo
- `finalScore`, `blocksDestroyed` - Estatísticas de fim de jogo

### Dias da Semana
- `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday` - Abreviações dos dias

### Mensagens e Diálogos
- `noRecords` - Mensagem quando não há recordes
- `confirmClearRecords` - Confirmação para limpar recordes
- `confirmImportRecords` - Confirmação para importar recordes
- `recordsImported` - Mensagem de sucesso na importação
- `importError` - Mensagem de erro na importação
- `newRecord` - Celebração de novo recorde
- `touchInstructions` - Instruções para dispositivos móveis

### Rodapé
- `sourceCode`, `sponsor` - Links do rodapé

## Uso no Código

O sistema de traduções é gerenciado pela classe `I18nManager` em `js/i18n.js`. Para obter um texto traduzido:

```javascript
const texto = getText('nomeChave');
```

Para trocar o idioma:

```javascript
changeLanguage('en'); // Muda para Inglês
```

## Sistema de Fallback

O sistema inclui um mecanismo de fallback:
1. Se os arquivos JSON externos falharem ao carregar, traduções incorporadas são usadas
2. Se uma chave de tradução estiver faltando no idioma atual, volta para Português
3. Se a chave estiver faltando no Português também, a própria chave é retornada

Isso garante que a aplicação sempre exiba algum texto, mesmo se as traduções estiverem incompletas.

## Referência no README Principal

Este sistema de traduções está documentado no [README principal](../README.md) do projeto na seção de Internacionalização.