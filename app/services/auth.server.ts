import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import { db } from "~/utils/db.server";
import { compare } from "bcrypt";
import { type User } from "@prisma/client";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const authenticator = new Authenticator<User>(sessionStorage);

const formStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log("you entered a wrong email");
    throw new AuthorizationError("you entered a wrong email");
  }

  const passwordsMatch = await compare(password, user.password as string);

  if (!passwordsMatch) {
    throw new AuthorizationError("Password dosen't match");
  }

  return user;
});

authenticator.use(formStrategy, "form");

export { authenticator };
