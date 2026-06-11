import { communityTools } from "./communityTools";
import { meetiTools } from "./meetiTools";

export const tools = {
  ...communityTools,
  ...meetiTools,
} as const;

