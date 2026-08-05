/**
 * Kaisha Plugin: media
 * Category: media
 * Sticker maker, meme generator, image filters, ocr
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'media',
        version: '1.0.0',
        category: 'media',
        description: 'Sticker maker, meme generator, image filters, ocr',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] media loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] media unloaded`);
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
                name: 'media',
                aliases: [],
                category: 'media',
                description: 'Sticker maker, meme generator, image filters, ocr',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'media\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
