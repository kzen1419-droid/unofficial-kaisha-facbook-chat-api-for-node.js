/**
 * Kaisha Plugin: notifications
 * Category: system
 * Push notifications via webhook / email / TG
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'notifications',
        version: '1.0.0',
        category: 'system',
        description: 'Push notifications via webhook / email / TG',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] notifications loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] notifications unloaded`);
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
                name: 'notifications',
                aliases: [],
                category: 'system',
                description: 'Push notifications via webhook / email / TG',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'notifications\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
