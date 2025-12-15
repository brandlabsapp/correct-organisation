declare namespace Notification {
  export interface NotificationObject {
    title: string;
    message: string;
    entityId?: string;
    entityType?: string;
    userId: number;
    status?: string;
    priority?: string;
    frequency?: string;
    persistent?: boolean;
    conditions?: JSON;
    lastSent?: Date;
    nextSend?: Date;
  }

  export interface PushNotificationOptions {
    title: string;
    body: string;
    imageUrl?: string;
    sound?: string;
    tag?: string;
    collapseKey?: string;
    priority?: 'high' | 'normal';
    ttl?: number;
  }

  export interface NotificationChange {
    userId: number;
    notificationObjectId: number;
  }

  export interface Notification {
    notificationObjectId: number;
    notifierId: number[];
  }
}
