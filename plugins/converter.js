/**
 * Kaisha Plugin: converter
 * Category: utility
 * Unit, currency, base64, JSON, image format conversion
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'converter',
        version: '1.0.0',
        category: 'utility',
        description: 'Unit, currency, base64, JSON, image format conversion',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] converter loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] converter unloaded`);
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
                name: 'converter',
                aliases: [],
                category: 'utility',
                description: 'Unit, currency, base64, JSON, image format conversion',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'converter\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
