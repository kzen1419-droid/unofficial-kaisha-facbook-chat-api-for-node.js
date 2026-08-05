/**
 * Kaisha Plugin: backup
 * Category: system
 * Trigger manual/auto backups of config and database
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'backup',
        version: '1.0.0',
        category: 'system',
        description: 'Trigger manual/auto backups of config and database',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] backup loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] backup unloaded`);
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
                name: 'backup',
                aliases: [],
                category: 'system',
                description: 'Trigger manual/auto backups of config and database',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'backup\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
