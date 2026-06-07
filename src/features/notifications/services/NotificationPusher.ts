import { pusher } from "@/src/lib/pusher";
import { SelectNotification } from "../types/notification.type";

export interface INotificationPublisher {
  notify(notifications: SelectNotification): Promise<void>;
}

class NotificationPusher implements INotificationPublisher {
  async notify(notifications: SelectNotification): Promise<void> {
    await pusher.trigger(
      `notifications-channel-${notifications.userId}`,
      "new-notification",
      notifications,
    );
  }
}

export const notificationPusher = new NotificationPusher();

