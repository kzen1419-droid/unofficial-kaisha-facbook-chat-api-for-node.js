/**
 * Kaisha Plugin: system
 * Category: dev
 * Runtime stats, gc, reload plugins, config hot-reload
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'system',
        version: '1.0.0',
        category: 'dev',
        description: 'Runtime stats, gc, reload plugins, config hot-reload',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] system loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] system unloaded`);
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
                name: 'system',
                aliases: [],
                category: 'dev',
                description: 'Runtime stats, gc, reload plugins, config hot-reload',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'system\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
