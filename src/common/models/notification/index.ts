import { TypeNotification } from "../../enums/TypeNotification";

export interface NotificationDto {
    senderId: string;
    recipientId: string;
    content: string;
    timestamp: Date;
    contentType: string;
    notificationType: TypeNotification;
}