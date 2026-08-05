/**
 * Kaisha Plugin: profile
 * Category: social
 * View/edit user profile, bio, avatar, preferences
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'profile',
        version: '1.0.0',
        category: 'social',
        description: 'View/edit user profile, bio, avatar, preferences',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] profile loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] profile unloaded`);
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
                name: 'profile',
                aliases: [],
                category: 'social',
                description: 'View/edit user profile, bio, avatar, preferences',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'profile\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
