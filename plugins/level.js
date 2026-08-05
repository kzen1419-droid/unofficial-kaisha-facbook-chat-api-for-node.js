/**
 * Kaisha Plugin: level
 * Category: economy
 * XP / level system with ranks and leaderboards
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'level',
        version: '1.0.0',
        category: 'economy',
        description: 'XP / level system with ranks and leaderboards',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] level loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] level unloaded`);
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
                name: 'level',
                aliases: [],
                category: 'economy',
                description: 'XP / level system with ranks and leaderboards',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'level\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
