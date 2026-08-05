/**
 * Kaisha Plugin: scheduler
 * Category: automation
 * Schedule messages, reminders, cron announcements
 * Auto-loaded by PluginManager from plugins/ directory
 */
module.exports = function(api) {
    return {
        name: 'scheduler',
        version: '1.0.0',
        category: 'automation',
        description: 'Schedule messages, reminders, cron announcements',
        author: 'Aldwin Padronia',

        /** Lifecycle: called when plugin is loaded */
        async onLoad(api) {
            api.logger?.info?.(`[Plugin] scheduler loaded`);
        },

        /** Lifecycle: called when plugin is unloaded */
        async onUnload(api) {
            api.logger?.info?.(`[Plugin] scheduler unloaded`);
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
                name: 'scheduler',
                aliases: [],
                category: 'automation',
                description: 'Schedule messages, reminders, cron announcements',
                cooldown: 2000,
                permissions: [],
                async run(ctx, api) {
                    return api.messageManager?.sendText?.(ctx.threadId,
                        `✅ Plugin \\'scheduler\\' is active. v1.0.0`);
                }
            }
        ]
    };
};
