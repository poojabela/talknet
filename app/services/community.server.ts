import { db } from "~/utils/db.server";
import type { Community } from "./types.server";

export const createCommunity = async (community: Community) => {
  try {
    const newCommunity = await db.community.create({
      data: {
        name: community.name,
        profileImage: community.profileImage,
        users: {
          connect: { id: community.userId },
        },
      },
    });

    return { id: newCommunity.id };
  } catch (error) {
    return error;
  }
};
