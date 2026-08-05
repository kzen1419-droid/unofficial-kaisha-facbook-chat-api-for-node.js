/**
 * Kaisha Plugin: economy
 * Category: economy
 * Virtual currency, bank, shop, daily rewards, gamble
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'economy',
        version: '1.0.0',
        category: 'economy',
        description: 'Virtual currency, bank, shop, daily rewards, gamble',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] economy loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] economy unloaded`);
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
                name: 'economy',
                aliases: [],
                category: 'economy',
                description: 'Virtual currency, bank, shop, daily rewards, gamble',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'economy\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
