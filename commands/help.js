'use strict';

const utils = require('../utils');

module.exports = {
  name: 'help',
  aliases: ['h', 'commands', 'cmds'],
  category: 'general',
  description: 'List all available commands or show help for a specific one',
  cooldown: 1500,
  permissions: [],
  async run(ctx, api) {
    const commands = api.commandManager?.list?.() || [];
    const groups = commands.reduce((acc, command) => {
      const category = command.category || 'general';
      (acc[category] ||= []).push(command);
      return acc;
    }, {});

    let output = '📖 Kaisha Command Help\n\n';
    for (const [category, items] of Object.entries(groups)) {
      output += `${utils.capitalize(category)} (${items.length})\n`;
      for (const command of items) {
        output += `  /${command.name} — ${command.description || 'No description'}\n`;
      }
      output += '\n';
    }

    output += `Total: ${commands.length} commands | Prefix: ${api.options?.prefix || '/'}`;
    return api.messageManager?.sendText?.(ctx.threadId, output);
  }
};
