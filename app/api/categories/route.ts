import { communityService } from "@/src/features/comminities/services/CommunityService";
import { categoryService } from "@/src/features/meetis/services/CategoryService";
import { requireAuth } from "@/src/lib/auth-server";

export async function GET() {
  const categories = await categoryService.getAll();

  return new Response(JSON.stringify(categories), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

