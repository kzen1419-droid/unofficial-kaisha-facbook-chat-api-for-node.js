/**
 * Kaisha Plugin: autoReply
 * Category: automation
 * Keyword-based auto-response with regex matching
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'autoReply',
        version: '1.0.0',
        category: 'automation',
        description: 'Keyword-based auto-response with regex matching',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] autoReply loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] autoReply unloaded`);
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
                name: 'autoReply',
                aliases: [],
                category: 'automation',
                description: 'Keyword-based auto-response with regex matching',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'autoReply\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
