const mineflayer = require('mineflayer');

// ==================== CONFIGURAÇÕES ====================
const CONFIG = {
  server: {
    host: 'GalinhaZumbiSMP.aternos.me',
    port: 36185,
    version: '1.21.1'
  },
  bot: {
    username: 'afk_bot',
    auth: 'offline'
  },
  behavior: {
    reconnectDelay: 5000, // Delay padrão de reconexão (ms)
    serverOfflineDelay: 30000 // Delay quando servidor está offline (ms)
  },
  messages: {
    joinMessage: 'Oi! Sou um bot mantendo o servidor vivo! 🤖',
    enableJoinMessage: true
  },
  logging: {
    showHealthMana: false, // Mostrar mensagens de HP/Mana
    showChatMessages: true
  }
};

// ==================== SISTEMA DE LOGGING ====================
const Logger = {
  colors: {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
  },

  timestamp() {
    return new Date().toLocaleTimeString('pt-BR');
  },

  success(message) {
    console.log(`${this.colors.green}✓${this.colors.reset} [${this.timestamp()}] ${message}`);
  },

  info(message) {
    console.log(`${this.colors.blue}ℹ${this.colors.reset} [${this.timestamp()}] ${message}`);
  },

  warning(message) {
    console.log(`${this.colors.yellow}⚠${this.colors.reset} [${this.timestamp()}] ${message}`);
  },

  error(message) {
    console.log(`${this.colors.red}✗${this.colors.reset} [${this.timestamp()}] ${message}`);
  },

  chat(message) {
    if (CONFIG.logging.showChatMessages) {
      console.log(`${this.colors.cyan}💬${this.colors.reset} [${this.timestamp()}] ${message}`);
    }
  },

  debug(message) {
    console.log(`${this.colors.dim}🔍 [${this.timestamp()}] ${message}${this.colors.reset}`);
  }
};

// ==================== GERENCIADOR DE ESTADO ====================
const BotState = {
  bot: null,
  isReconnecting: false,

  setBot(newBot) {
    this.bot = newBot;
  },

  setReconnecting(status) {
    this.isReconnecting = status;
  },

  isConnected() {
    return this.bot && this.bot.entity;
  }
};

// ==================== FILTROS DE MENSAGEM ====================
const MessageFilter = {
  shouldIgnore(message) {
    const patterns = [
      /❤/,
      /Mana/,
      /^\d+\/\d+/
    ];

    return patterns.some(pattern => pattern.test(message));
  }
};

// ==================== COMPORTAMENTO DO BOT ====================
const BotBehavior = {
  sendJoinMessage() {
    if (CONFIG.messages.enableJoinMessage) {
      BotState.bot.chat(CONFIG.messages.joinMessage);
    }
  }
};

// ==================== GERENCIADOR DE CONEXÃO ====================
const ConnectionManager = {
  createBot() {
    if (BotState.isReconnecting) {
      Logger.warning('Tentativa de conexão já em andamento');
      return;
    }

    BotState.setReconnecting(true);
    Logger.info(`Conectando em ${CONFIG.server.host}:${CONFIG.server.port}`);

    const bot = mineflayer.createBot({
      host: CONFIG.server.host,
      port: CONFIG.server.port,
      username: CONFIG.bot.username,
      version: CONFIG.server.version,
      auth: CONFIG.bot.auth
    });

    BotState.setBot(bot);
    this.setupEventHandlers(bot);
  },

  setupEventHandlers(bot) {
    bot.on('login', () => this.handleLogin());
    bot.on('spawn', () => this.handleSpawn());
    bot.on('message', (message) => this.handleMessage(message));
    bot.on('death', () => this.handleDeath());
    bot.on('kicked', (reason) => this.handleKick(reason));
    bot.on('error', (error) => this.handleError(error));
    bot.on('end', () => this.handleDisconnect());
  },

  handleLogin() {
    Logger.success(`Bot conectado como: ${CONFIG.bot.username}`);
    BotState.setReconnecting(false);
  },

  handleSpawn() {
    Logger.success('Bot spawnou no mundo - permanecendo parado');
    BotBehavior.sendJoinMessage();
  },

  handleMessage(message) {
    const messageText = message.toString();

    if (CONFIG.logging.showHealthMana || !MessageFilter.shouldIgnore(messageText)) {
      Logger.chat(messageText);
    }
  },

  handleDeath() {
    Logger.warning('Bot morreu - aguardando respawn');
  },

  handleKick(reason) {
    Logger.error(`Bot foi expulso: ${reason}`);
    BotState.setReconnecting(false);

    this.scheduleReconnect(CONFIG.behavior.reconnectDelay);
  },

  handleError(error) {
    Logger.error(`Erro de conexão: ${error.message}`);
    BotState.setReconnecting(false);

    const isServerOffline = error.message.includes('ENOTFOUND') || 
                           error.message.includes('ECONNREFUSED');

    const delay = isServerOffline 
      ? CONFIG.behavior.serverOfflineDelay 
      : CONFIG.behavior.reconnectDelay;

    const reason = isServerOffline 
      ? 'Servidor offline ou inacessível' 
      : 'Erro de conexão';

    Logger.warning(`${reason} - tentando novamente em ${delay / 1000}s`);
    this.scheduleReconnect(delay);
  },

  handleDisconnect() {
    Logger.info('Bot desconectado');
    BotState.setReconnecting(false);

    this.scheduleReconnect(CONFIG.behavior.reconnectDelay);
  },

  scheduleReconnect(delay) {
    setTimeout(() => {
      Logger.info('Tentando reconectar...');
      this.createBot();
    }, delay);
  },

  shutdown() {
    Logger.info('Encerrando bot...');

    if (BotState.bot) {
      BotState.bot.quit();
    }

    process.exit(0);
  }
};

// ==================== INICIALIZAÇÃO ====================
process.on('SIGINT', () => ConnectionManager.shutdown());

Logger.info('Bot Minecraft iniciado');
Logger.info(`Versão: ${CONFIG.server.version}`);
Logger.info('Modo: Permanece parado (ideal para modo espectador)');
ConnectionManager.createBot();