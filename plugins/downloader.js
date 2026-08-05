/**
 * Kaisha Plugin: downloader
 * Category: media
 * Download from YouTube, TikTok, FB, IG, Twitter
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'downloader',
        version: '1.0.0',
        category: 'media',
        description: 'Download from YouTube, TikTok, FB, IG, Twitter',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] downloader loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] downloader unloaded`);
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
                name: 'downloader',
                aliases: [],
                category: 'media',
                description: 'Download from YouTube, TikTok, FB, IG, Twitter',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'downloader\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
