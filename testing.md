# Testes - Breakout Calendar

Este documento descreve como executar e entender os testes do projeto Breakout Calendar.

## 📋 Visão Geral

O projeto utiliza **Jest** como framework de testes, com **jsdom** para simular o ambiente do navegador. Os testes estão organizados por domínio para manter a modularidade e facilitar a manutenção.

## 🗂 Estrutura dos Testes

```
tests/
├── setup.js           # Configurações globais dos testes
├── i18n.test.js       # Testes de internacionalização
├── records.test.js    # Testes do sistema de recordes
└── game.test.js       # Testes da lógica principal do jogo
```

## 🧪 Tipos de Teste

### 1. Testes de Internacionalização (`i18n.test.js`)

Testam as funcionalidades relacionadas aos idiomas:
- Carregamento de idioma padrão
- Alteração de idioma
- Persistência de preferências
- Atualização de textos na interface
- Validação de traduções

### 2. Testes de Recordes (`records.test.js`)

Testam o sistema de recordes e persistência:
- Adição de novos recordes
- Ordenação por pontuação
- Limitação aos 10 melhores
- Persistência no localStorage
- Exportação/importação de dados
- Limpeza de recordes

### 3. Testes do Jogo (`game.test.js`)

Testam a mecânica principal do jogo:
- Inicialização do jogo
- Movimentação da raquete
- Física da bola
- Detecção de colisões
- Sistema de blocos
- Estados do jogo (pausado, rodando, fim)
- Pontuação e vidas

## ⚙️ Configuração de Teste

O arquivo `setup.js` configura:
- Mocks do localStorage
- Mocks de funções do navegador
- Canvas mock para testes gráficos
- Variáveis globais necessárias

## 🚀 Executando os Testes

### Comandos Disponíveis

```bash
# Instalar dependências (primeira vez)
npm install

# Executar todos os testes uma vez
npm test

# Executar testes em modo watch (reexecuta ao salvar arquivos)
npm test:watch

# Executar testes com relatório de cobertura
npm test:coverage
```

### Executar Testes Específicos

```bash
# Apenas testes de internacionalização
npx jest i18n.test.js

# Apenas testes de recordes
npx jest records.test.js

# Apenas testes do jogo
npx jest game.test.js

# Executar teste específico por nome
npx jest --testNamePattern="should initialize with correct default values"
```

## 📊 Cobertura de Código

O projeto está configurado para gerar relatórios de cobertura:

```bash
npm test:coverage
```

Os relatórios são salvos na pasta `coverage/` e incluem:
- Linhas cobertas/descobertas
- Funções testadas
- Branches de código testados
- Relatório HTML navegável

### Metas de Cobertura

- **Linhas**: > 85%
- **Funções**: > 80%  
- **Branches**: > 75%
- **Statements**: > 85%

## 🔍 Detalhes dos Testes

### Mocks Utilizados

- **localStorage**: Para testes de persistência
- **Canvas API**: Para testes gráficos
- **requestAnimationFrame**: Para testes de animação
- **alert/confirm**: Para testes de interação

### Cenários Testados

#### Internacionalização
- ✅ Carregamento de idioma padrão
- ✅ Mudança de idioma com persistência
- ✅ Atualização de elementos DOM
- ✅ Tratamento de idiomas inválidos

#### Sistema de Recordes
- ✅ Adição e ordenação de recordes
- ✅ Limitação aos top 10
- ✅ Persistência no localStorage
- ✅ Detecção de novos recordes
- ✅ Exportação/importação

#### Lógica do Jogo
- ✅ Inicialização correta
- ✅ Controles de movimento
- ✅ Física da bola e colisões
- ✅ Destruição de blocos
- ✅ Estados do jogo
- ✅ Sistema de pontuação

## 🐛 Troubleshooting

### Problemas Comuns

**Jest não encontrado**
```bash
npm install --save-dev jest
```

**Erros de Canvas**
```bash
# Já configurado no setup.js, mas se persistir:
npm install --save-dev canvas
```

**Testes falhando por timeout**
```bash
# Aumentar timeout no jest.config.js
"testTimeout": 10000
```

### Debug dos Testes

```bash
# Executar testes com logs detalhados
npm test -- --verbose

# Executar apenas testes que falharam
npm test -- --onlyFailures

# Executar com breakpoints (Node.js debugging)
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 📝 Boas Práticas

### Escrevendo Novos Testes

1. **Organize por domínio**: Coloque testes relacionados no mesmo arquivo
2. **Use describe/test**: Agrupe testes logicamente
3. **Mock dependências**: Isole o código sendo testado
4. **Teste casos extremos**: Valores inválidos, limites, etc.
5. **Mantenha testes simples**: Um teste, uma responsabilidade

### Exemplo de Estrutura

```javascript
describe('Feature Name', () => {
    beforeEach(() => {
        // Setup comum
    });

    test('should do something specific', () => {
        // Arrange
        const input = setupInput();
        
        // Act
        const result = functionUnderTest(input);
        
        // Assert
        expect(result).toBe(expectedValue);
    });
});
```

## 🔄 Integração Contínua

Os testes são executados automaticamente:
- A cada push para o repositório
- A cada pull request
- Antes de builds de produção

Para configurar localmente:
```bash
# Hook de pre-commit (opcional)
npm test && npm run lint
```

---

Para mais informações sobre Jest, consulte a [documentação oficial](https://jestjs.io/docs/getting-started).