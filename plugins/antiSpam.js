/**
 * Kaisha Plugin: antiSpam
 * Category: moderation
 * Detect spam, flood, caps, duplicates, rate limit
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'antiSpam',
        version: '1.0.0',
        category: 'moderation',
        description: 'Detect spam, flood, caps, duplicates, rate limit',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] antiSpam loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] antiSpam unloaded`);
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
                name: 'antiSpam',
                aliases: [],
                category: 'moderation',
                description: 'Detect spam, flood, caps, duplicates, rate limit',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'antiSpam\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
