import { User } from "../../auth/types/auth.types";
import { IMeetiRepository, meetiRepository } from "./MeetiRepository";
import {
  IMeetiAttendeesRepository,
  meetiAttendeesRepository,
} from "./MeetiAttendeesRepository";
import { MeetiAttendeePolicy } from "../policy/MeetiAttendeesPolicy";
import {
  INotificationService,
  notificationService,
} from "../../notifications/services/NotificationService";

class MeetiAttendeesService {
  constructor(
    private meetiAttendeesRepository: IMeetiAttendeesRepository,
    private meetiRepository: IMeetiRepository,
    private notificationService: INotificationService,
  ) {}
  async toogleAttendance(meetiId: string, user: User) {
    const meeti = await this.meetiRepository.findById(meetiId);
    if (!meeti) throw new Error("Meeti no encontrado");

    const isAttending = await this.meetiAttendeesRepository.isUserAttendees(
      user.id,
      meeti.id,
    );
    if (MeetiAttendeePolicy.canConfirm(user, meeti, isAttending)) {
      await this.meetiAttendeesRepository.insert(user.id, meeti.id);
      await this.notificationService.createAndNotify({
        userId: meeti.createdBy,
        actorName: user.name,
        message: "Confirmo su asistencia al meeti",
        target: meeti.title,
      });
      return {
        success: `Confirmaste tu asistencia al Meeti ${meeti.title}`,
        error: "",
        newPermission: {
          canConfirm: false,
          canCancel: true,
        },
      };
    }
    if (MeetiAttendeePolicy.canCancel(user, meeti, isAttending)) {
      await this.meetiAttendeesRepository.remove(user.id, meeti.id);
      return {
        success: `Cancelaste tu asistencia al Meeti ${meeti.title}`,
        error: "",
        newPermission: {
          canConfirm: true,
          canCancel: false,
        },
      };
    }
  }
}

export const meetiAttendeesService = new MeetiAttendeesService(
  meetiAttendeesRepository,
  meetiRepository,
  notificationService,
);

