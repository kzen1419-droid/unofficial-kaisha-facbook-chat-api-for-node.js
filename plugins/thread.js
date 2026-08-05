/**
 * Kaisha Plugin: thread
 * Category: admin
 * Thread management: pin, mute, archive, delete, nick
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'thread',
        version: '1.0.0',
        category: 'admin',
        description: 'Thread management: pin, mute, archive, delete, nick',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] thread loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] thread unloaded`);
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
                name: 'thread',
                aliases: [],
                category: 'admin',
                description: 'Thread management: pin, mute, archive, delete, nick',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'thread\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
