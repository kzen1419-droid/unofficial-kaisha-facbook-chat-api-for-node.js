/**
 * Kaisha Plugin: ai
 * Category: general
 * AI chat completion with multi-provider support
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'ai',
        version: '1.0.0',
        category: 'general',
        description: 'AI chat completion with multi-provider support',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] ai loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] ai unloaded`);
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
                name: 'ai',
                aliases: [],
                category: 'general',
                description: 'AI chat completion with multi-provider support',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'ai\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
