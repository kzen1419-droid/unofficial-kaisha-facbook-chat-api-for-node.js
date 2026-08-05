/**
 * Kaisha Plugin: welcome
 * Category: social
 * Auto-welcome message when users join groups
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'welcome',
        version: '1.0.0',
        category: 'social',
        description: 'Auto-welcome message when users join groups',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] welcome loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] welcome unloaded`);
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
                name: 'welcome',
                aliases: [],
                category: 'social',
                description: 'Auto-welcome message when users join groups',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'welcome\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
