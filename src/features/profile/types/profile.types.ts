import { User } from "../../auth/types/auth.types";
import { SelectCommunity } from "../../comminities/types/community.types";
import { SelectMeeti } from "../../meetis/types/meeti.type";

export type FullProfile = User & {
  communities: SelectCommunity[];
  meeties: SelectMeeti[];
};

