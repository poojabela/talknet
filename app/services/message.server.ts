import { type Message } from "./types.server";
import { db } from "~/utils/db.server";

export const createMessage = async (message: Message) => {
  try {
    const newMessage = await db.message.create({
      data: {
        content: message.content,
        user: { connect: { id: message.userId } },
        Community: { connect: { id: message.communityId } },
      },
    });

    return newMessage;
  } catch (error) {
    return error;
  }
};
