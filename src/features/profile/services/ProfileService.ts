import { auth } from "@/src/lib/auth";
import { ProfileInput } from "../schema/profileSchema";
import { IProfileRepository, profileRepository } from "./ProfileRepositiry";
import { headers } from "next/headers";
class ProfileService {
  constructor(private profileRepository: IProfileRepository) {}

  async getPofileDetails(profileId: string) {
    return await this.profileRepository.findFullPromiseById(profileId);
  }
  async updateProfile(data: ProfileInput) {
    const { bio, image, name } = data;
    await auth.api.updateUser({
      body: {
        name,
        image,
        bio,
      },
      headers: await headers(),
    });
  }
}

export const profileService = new ProfileService(profileRepository);

