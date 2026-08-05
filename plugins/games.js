/**
 * Kaisha Plugin: games
 * Category: fun
 * Trivia, hangman, rps, 8ball, dice, coinflip, slots
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'games',
        version: '1.0.0',
        category: 'fun',
        description: 'Trivia, hangman, rps, 8ball, dice, coinflip, slots',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] games loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] games unloaded`);
        },

        /** Event handlers registered automatically */
        events: {
            async message(ctx) {
                // Override in concrete implementations
            }
        },

        /** Chat commands registered automatically */
        commands: [
            {
                name: 'games',
                aliases: [],
                category: 'fun',
                description: 'Trivia, hangman, rps, 8ball, dice, coinflip, slots',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'games\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
