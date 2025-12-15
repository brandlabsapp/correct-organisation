import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class PushService implements OnModuleDestroy {
  private readonly logger = new Logger(PushService.name);
  private readonly fcm: admin.messaging.Messaging;
  private static firebaseInitialized = false;

  constructor() {
    try {
      if (!PushService.firebaseInitialized) {
        this.logger.log('Initializing Firebase Admin SDK');

        const serviceAccountPayload = {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        };

        if (
          !process.env.FIREBASE_PROJECT_ID ||
          !process.env.FIREBASE_CLIENT_EMAIL ||
          !process.env.FIREBASE_PRIVATE_KEY
        ) {
          throw new Error(
            'FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY environment variables are not defined',
          );
        }

        // Check if Firebase is already initialized
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccountPayload),
          });
          PushService.firebaseInitialized = true;
          this.logger.log('Firebase Admin SDK initialized successfully');
        }
      }

      this.fcm = admin.messaging();
    } catch (error) {
      this.logger.error(
        'Failed to initialize Firebase Admin SDK',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  onModuleDestroy() {
    if (PushService.firebaseInitialized && admin.apps.length) {
      this.logger.log('Cleaning up Firebase Admin SDK resources');

      Promise.all(admin.apps.map((app) => app?.delete()))
        .then(() => {
          PushService.firebaseInitialized = false;
          this.logger.log('Firebase Admin SDK resources cleaned up');
        })
        .catch((err) => {
          this.logger.error(
            'Error cleaning up Firebase Admin SDK',
            err instanceof Error ? err.stack : String(err),
          );
        });
    }
  }

  async sendPushNotificationToDeviceToken(
    deviceToken: string,
    title: string,
    message: string,
    options?: Partial<Notification.PushNotificationOptions>,
  ): Promise<admin.messaging.BatchResponse> {
    try {
      const notification: Notification.PushNotificationOptions = {
        title,
        body: message,
        sound: options?.sound ?? 'default',
        tag: options?.tag ?? 'default',
        imageUrl: options?.imageUrl,
        collapseKey: options?.collapseKey ?? 'default',
        priority: options?.priority ?? 'high',
        ttl: options?.ttl ?? 24 * 60 * 60 * 1000,
      };

      if (!deviceToken || deviceToken.trim() === '') {
        this.logger.warn(
          'Attempted to send notification to empty device token',
        );
        throw new Error('Device token is required');
      }

      const response = await this.fcm.sendEachForMulticast({
        tokens: [deviceToken],
        android: {
          collapseKey: notification.collapseKey,
          priority: notification.priority,
          ttl: notification.ttl,
          notification: {
            title: notification.title,
            body: notification.body,
            sound: notification.sound,
            tag: notification.tag,
            imageUrl: notification.imageUrl,
          },
        },
      });

      if (response.failureCount > 0) {
        this.logger.warn(
          `Failed to send notification to some devices: ${JSON.stringify(response.responses)}`,
        );
      } else {
        this.logger.debug(
          `Successfully sent notification to device token: ${deviceToken.substring(0, 6)}...`,
        );
      }

      return response;
    } catch (error) {
      this.logger.error(
        'Error sending push notification',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
