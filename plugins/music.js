/**
 * Kaisha Plugin: music
 * Category: media
 * Music search, streaming info, lyrics lookup
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'music',
        version: '1.0.0',
        category: 'media',
        description: 'Music search, streaming info, lyrics lookup',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] music loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] music unloaded`);
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
                name: 'music',
                aliases: [],
                category: 'media',
                description: 'Music search, streaming info, lyrics lookup',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'music\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
