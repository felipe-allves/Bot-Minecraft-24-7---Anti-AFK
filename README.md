# Bot Minecraft 24/7 - Anti-AFK

Bot automatizado para manter servidor Minecraft ativo, evitando que feche por inatividade.

## Descrição

Este bot conecta-se ao servidor Minecraft e permanece online, mantendo o servidor ativo. O bot fica parado (ideal para modo espectador) e reconecta automaticamente em caso de desconexão. Ideal para servidores que desligam automaticamente após período de inatividade (como Aternos).

## Funcionalidades

- Conexão automática ao servidor
- Permanece online mantendo o servidor ativo (ideal para modo espectador)
- Reconexão automática em caso de desconexão
- Sistema de logging profissional com cores e timestamps
- Filtro inteligente de mensagens do chat
- Código limpo e modular (Clean Code)

## Tecnologias

- **Node.js** v18+
- **Mineflayer** - Biblioteca para criar bots do Minecraft

## Configuração

Todas as configurações estão centralizadas no objeto `CONFIG` no arquivo `bot.js`:

```javascript
const CONFIG = {
  server: {
    host: 'seuservidor.aternos.me',  // Endereço do servidor
    port: 12345,                      // Porta do servidor
    version: '1.21.1'                 // Versão do Minecraft
  },
  bot: {
    username: 'afk_bot',              // Nome do bot
    auth: 'offline'                   // offline = servidor cracked
  },
  behavior: {
    reconnectDelay: 5000,             // Delay de reconexão (ms)
    serverOfflineDelay: 30000         // Delay quando servidor offline (ms)
  },
  messages: {
    joinMessage: 'Oi! Sou um bot mantendo o servidor vivo! 🤖',  // Mensagem ao entrar
    enableJoinMessage: true           // Ativar/desativar mensagem
  },
  logging: {
    showHealthMana: false,            // Mostrar HP/Mana no console
    showChatMessages: true            // Mostrar mensagens do chat
  }
};
```

## Instalação Local

### Pré-requisitos
- Node.js v18 ou superior
- npm ou yarn

### Passo a passo

1. Clone o repositório:
```bash
git clone https://github.com/felipe-allves/Bot-Minecraft-24-7---Anti-AFK.git
cd Bot-Minecraft-24-7---Anti-AFK
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o bot editando o arquivo `bot.js` (seção CONFIG)

4. Execute o bot:
```bash
npm start
```

## Deploy no Render

### Passo a passo

1. Faça fork/clone deste repositório
2. Acesse [Render.com](https://render.com) e crie uma conta
3. Clique em "New +" → "Background Worker"
4. Conecte seu repositório do GitHub
5. Configure:
   - **Name**: minecraft-bot (ou qualquer nome)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Clique em "Create Background Worker"

O bot iniciará automaticamente e ficará rodando 24/7!

## Sistema de Logging

O bot possui um sistema de logging colorido com diferentes níveis:

- **Success**: Operações bem-sucedidas
- **Info**: Informações gerais
- **Warning**: Avisos (quedas, reconexões)
- **Error**: Erros críticos
- **Chat**: Mensagens do chat do servidor
- **Debug**: Informações de debug

## Modo Espectador

O bot foi projetado para funcionar no **modo espectador**. Ele permanece parado após conectar, não realizando ações que possam interferir no gameplay. Recomenda-se colocar o bot no modo espectador no servidor para:
- Não ocupar slot de jogador
- Não interferir no gameplay
- Economia de recursos do servidor
- Manter o servidor ativo sem movimentação desnecessária

## Solução de Problemas

### Bot não conecta
- Verifique se o servidor está online
- Confirme se o IP e porta estão corretos
- Verifique se a versão do Minecraft está correta

### Bot desconecta frequentemente
- O bot possui reconexão automática
- Verifique os logs para identificar o motivo das desconexões
- Certifique-se de que a mensagem de entrada (`joinMessage`) não contém caracteres especiais que possam causar expulsão (como códigos de cor `§` ou emojis, dependendo do servidor)

### Spam de mensagens no console
- Ajuste `showHealthMana: false` na configuração
- Adicione mais filtros em `MessageFilter.shouldIgnore()`

## Estrutura do Código

```
minecraft-bot/
├── bot.js              # Código principal
├── package.json        # Dependências do projeto
├── .gitignore         # Arquivos ignorados pelo Git
└── README.md          # Este arquivo
```

### Arquitetura

O código segue princípios de Clean Code com separação de responsabilidades:

- **CONFIG**: Configurações centralizadas
- **Logger**: Sistema de logging
- **BotState**: Gerenciamento de estado
- **MessageFilter**: Filtros de mensagem
- **BotBehavior**: Comportamento do bot
- **ConnectionManager**: Gerenciamento de conexão

## Licença

MIT License - Sinta-se livre para usar e modificar.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Aviso Legal

Este bot é apenas para fins educacionais e para manter servidores pessoais ativos. Use com responsabilidade e respeite os termos de serviço do seu provedor de hospedagem de Minecraft.

## Autor

Desenvolvido para manter o servidor **GalinhaZumbiSMP** sempre ativo.

---

**Status**: Online e funcionando perfeitamente!