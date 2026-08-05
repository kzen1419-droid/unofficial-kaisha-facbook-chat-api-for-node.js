/**
 * Kaisha Plugin: group
 * Category: admin
 * Group settings: prefix, language, welcome, permissions
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'group',
        version: '1.0.0',
        category: 'admin',
        description: 'Group settings: prefix, language, welcome, permissions',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] group loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] group unloaded`);
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
                name: 'group',
                aliases: [],
                category: 'admin',
                description: 'Group settings: prefix, language, welcome, permissions',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'group\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
