/**
 * Kaisha Plugin: monitor
 * Category: system
 * Monitor bot health, memory, lag, queue size, alerts
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'monitor',
        version: '1.0.0',
        category: 'system',
        description: 'Monitor bot health, memory, lag, queue size, alerts',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] monitor loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] monitor unloaded`);
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
                name: 'monitor',
                aliases: [],
                category: 'system',
                description: 'Monitor bot health, memory, lag, queue size, alerts',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'monitor\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
