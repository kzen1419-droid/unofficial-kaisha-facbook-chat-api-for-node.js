/**
 * Kaisha Plugin: commands
 * Category: system
 * Dynamic command registry, enable/disable per thread
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'commands',
        version: '1.0.0',
        category: 'system',
        description: 'Dynamic command registry, enable/disable per thread',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] commands loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] commands unloaded`);
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
                name: 'commands',
                aliases: [],
                category: 'system',
                description: 'Dynamic command registry, enable/disable per thread',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'commands\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
