/**
 * Kaisha Plugin: moderation
 * Category: moderation
 * Kick, ban, warn, mute, word filter, anti-raid
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'moderation',
        version: '1.0.0',
        category: 'moderation',
        description: 'Kick, ban, warn, mute, word filter, anti-raid',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] moderation loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] moderation unloaded`);
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
                name: 'moderation',
                aliases: [],
                category: 'moderation',
                description: 'Kick, ban, warn, mute, word filter, anti-raid',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'moderation\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
