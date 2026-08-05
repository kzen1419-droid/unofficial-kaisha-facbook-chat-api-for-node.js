/**
 * Kaisha Plugin: logger
 * Category: logging
 * Log group events: join, leave, rename, admin changes
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'logger',
        version: '1.0.0',
        category: 'logging',
        description: 'Log group events: join, leave, rename, admin changes',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] logger loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] logger unloaded`);
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
                name: 'logger',
                aliases: [],
                category: 'logging',
                description: 'Log group events: join, leave, rename, admin changes',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'logger\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
