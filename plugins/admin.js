/**
 * Kaisha Plugin: admin
 * Category: admin
 * Bot administration: restart, eval, ban, broadcast
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'admin',
        version: '1.0.0',
        category: 'admin',
        description: 'Bot administration: restart, eval, ban, broadcast',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] admin loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] admin unloaded`);
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
                name: 'admin',
                aliases: [],
                category: 'admin',
                description: 'Bot administration: restart, eval, ban, broadcast',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'admin\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
