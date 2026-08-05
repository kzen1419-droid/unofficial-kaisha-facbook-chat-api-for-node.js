/**
 * Kaisha Plugin: config
 * Category: admin
 * View/edit bot configuration via chat commands
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'config',
        version: '1.0.0',
        category: 'admin',
        description: 'View/edit bot configuration via chat commands',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] config loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] config unloaded`);
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
                name: 'config',
                aliases: [],
                category: 'admin',
                description: 'View/edit bot configuration via chat commands',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'config\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
