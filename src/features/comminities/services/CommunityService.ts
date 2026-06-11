import { User } from "better-auth";
import { CommunityInput } from "../schema/communitySchema";
import {
  communityRepository,
  ICommunityRepository,
} from "./CommunityRepository";
import { CommunityPolicy } from "../policies/CommunityPolicy";
import { MembershipPolicy } from "../policies/MembershipPolicy";
import { notFound } from "next/navigation";
import { checkPassword } from "@/src/shared/utils/auth";
import { deleteUTPFiles } from "@/src/lib/uploadthing-server";
import {
  IMembershipRepository,
  membershipRepository,
} from "./MembershipRepository";
import {
  IMeetiRepository,
  meetiRepository,
} from "../../meetis/services/MeetiRepository";
import {
  IProfileRepository,
  profileRepository,
} from "../../profile/services/ProfileRepositiry";

class CommunityService {
  constructor(
    private communityRepository: ICommunityRepository,
    private membershipRepository: IMembershipRepository,
    private meetiRepository: IMeetiRepository,
    private profileRepository: IProfileRepository,
  ) {}

  async createCommunity(data: CommunityInput, userId: string) {
    const community = await this.communityRepository.create({
      ...data,
      createdBy: userId,
    });
    return community;
  }
  async getUserCommunities(user: User) {
    const communities = await this.communityRepository.findByUser(user.id);

    const enriched = await Promise.all(
      communities.map(async (community) => {
        const isMember = true;
        const isAdmin = CommunityPolicy.isAdmin(user, community);
        const memberCount = await this.membershipRepository.getMemberCount(
          community.id,
        );
        return {
          data: community,
          memberCount,
          context: { isMember, isAdmin },
          permissions: {
            canEdit: CommunityPolicy.canEdit(user, community),
            canDelete: CommunityPolicy.canDelete(user, community),
            canJoin: MembershipPolicy.canJoin(user, community, isMember),
            canLeave: MembershipPolicy.canLeave(user, community, isMember),
            canViewMembers: CommunityPolicy.canViewMembers(user, community),
          },
        };
      }),
    );
    return enriched;
  }

  async getCommunityId(communityId: string) {
    const community = await this.communityRepository.findById(communityId);
    if (!community) notFound();
    return community;
  }

  async getCommunitiesForAPI(userId: string) {
    const community = await this.communityRepository.findByUser(userId);
    return community.map((community) => ({
      id: community.id,
      name: community.name,
    }));
  }

  async getCommunityDetails(communityId: string, user?: User) {
    const community = await this.getCommunityId(communityId);
    const memberCount = await this.membershipRepository.getMemberCount(
      community.id,
    );
    const admin = await this.profileRepository.findById(community.createdBy);
    if (!user) {
      return {
        data: { ...community, admin },
        memberCount,
        context: null,
        permissions: null,
      };
    }

    const isMember = await this.membershipRepository.isMember(
      community.id,
      user.id,
    );

    const isAdmin = CommunityPolicy.isAdmin(user, community);
    return {
      data: { ...community, admin },
      memberCount,
      context: { isMember, isAdmin },
      permissions: {
        canEdit: CommunityPolicy.canEdit(user, community),
        canDelete: CommunityPolicy.canDelete(user, community),
        canJoin: MembershipPolicy.canJoin(user, community, isMember),
        canLeave: MembershipPolicy.canLeave(user, community, isMember),
        canViewMembers: CommunityPolicy.canViewMembers(user, community),
      },
    };
  }

  async updateCommunity(data: CommunityInput, communityId: string, user: User) {
    const community = await this.getCommunityId(communityId);
    if (!CommunityPolicy.canEdit(user, community)) {
      throw new Error("No tienes permiso para actualizar esta comunidad");
    }

    await this.communityRepository.upadate(data, community.id);
  }

  async deleteCommunity(communityId: string, password: string, user: User) {
    // Obtener comunidad
    const community = await this.getCommunityId(communityId);

    // Revisar permisos
    if (!CommunityPolicy.canDelete(user, community)) {
      throw new Error("No tienes permisos para eliminar esta comunidad");
    }

    // verificar password
    const isValidPassword = await checkPassword(password);
    if (!isValidPassword) {
      return {
        error: "El Password es incorrecto",
        success: "",
      };
    }

    // eliminar la comunidad
    await this.communityRepository.delete(communityId);
    await deleteUTPFiles(community.image);
    return {
      error: "",
      success: "Comunidad eliminada correctamente",
    };
  }

  async getUpcomminMeetisByCommunity(communityId: string) {
    return await this.meetiRepository.findUpcomimgByCommunity(communityId);
  }
  async getFeaturedCommunities() {
    return await this.communityRepository.findFeatured();
  }

  async searchCommunityByTopic(query: string) {
    const community = await this.communityRepository.search(query);

    return community;
  }
}

export const communityService = new CommunityService(
  communityRepository,
  membershipRepository,
  meetiRepository,
  profileRepository,
);

