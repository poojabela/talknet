import { db } from "~/utils/db.server";
import { type Register } from "./types.server";
import { hash } from "bcrypt";

export const createUser = async (user: Register) => {
  try {
    const passwordHash = await hash(user.password, 10);

    const alreadyExist = await db.user.findUnique({
      where: { email: user.email },
    });

    if (alreadyExist) {
      throw new Error("email alreay exist");
    }

    const newUser = await db.user.create({
      data: {
        email: user.email,
        password: passwordHash,
        name: user.name,
      },
    });
    return { id: newUser.id, email: user.email, name: user.name };
  } catch (error) {
    return error;
  }
};
