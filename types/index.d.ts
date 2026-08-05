// Kaisha Type Definitions
export interface AppStateCookie { key: string; value: string; }
export interface MessageContext { threadId: string; senderId: string; text: string; }
export interface CommandDefinition { name: string; run(ctx: any, api: any): Promise<any>; }
