/**
 * Kaisha Plugin: events
 * Category: dev
 * Debug event stream, emit test events, inspect payloads
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'events',
        version: '1.0.0',
        category: 'dev',
        description: 'Debug event stream, emit test events, inspect payloads',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] events loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] events unloaded`);
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
                name: 'events',
                aliases: [],
                category: 'dev',
                description: 'Debug event stream, emit test events, inspect payloads',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'events\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
