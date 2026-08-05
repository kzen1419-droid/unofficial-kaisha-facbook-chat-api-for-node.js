/**
 * Kaisha Plugin: goodbye
 * Category: social
 * Auto-goodbye when users leave groups
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'goodbye',
        version: '1.0.0',
        category: 'social',
        description: 'Auto-goodbye when users leave groups',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] goodbye loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] goodbye unloaded`);
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
                name: 'goodbye',
                aliases: [],
                category: 'social',
                description: 'Auto-goodbye when users leave groups',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'goodbye\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
