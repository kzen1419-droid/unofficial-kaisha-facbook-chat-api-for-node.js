/**
 * Kaisha Plugin: utility
 * Category: utility
 * Ping, uptime, info, calc, weather, translate, qr
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'utility',
        version: '1.0.0',
        category: 'utility',
        description: 'Ping, uptime, info, calc, weather, translate, qr',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] utility loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] utility unloaded`);
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
                name: 'utility',
                aliases: [],
                category: 'utility',
                description: 'Ping, uptime, info, calc, weather, translate, qr',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'utility\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
