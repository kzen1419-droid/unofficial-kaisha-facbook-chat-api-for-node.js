/**
 * Kaisha Plugin: tools
 * Category: utility
 * Shorten URL, expand, whois, dns, port check, headers
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'tools',
        version: '1.0.0',
        category: 'utility',
        description: 'Shorten URL, expand, whois, dns, port check, headers',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] tools loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] tools unloaded`);
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
                name: 'tools',
                aliases: [],
                category: 'utility',
                description: 'Shorten URL, expand, whois, dns, port check, headers',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'tools\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
