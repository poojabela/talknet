import { db } from "~/utils/db.server";
import { type Mail } from "./types.server";
import nodemailer from "nodemailer";

const BREVO_API_KEY = process.env.BREVO_API_KEY;

export async function sendEmail(mail: Mail) {
  const existingUser = await db.user.findFirst({
    where: {
      email: mail.to,
      communities: {
        some: {
          id: mail.communityId,
        },
      },
    },
  });

  if (existingUser) {
    throw new Error("User is already in the community.");
  }
  const isInvite = await db.invitation.findFirst({
    where: { communityId: mail.communityId, email: mail.to },
  });

  if (isInvite) {
    throw new Error("invitation has already been send!");
  }

  const createdInvitation = await db.invitation.create({
    data: {
      email: mail.to,
      community: {
        connect: {
          id: mail.communityId,
        },
      },
    },
  });

  if (createdInvitation) {
    const message = {
      to: mail.to,
      subject: "Join Our Community!",
      html: `<p>Hello,</p>
      <p>You have been invited to join our community ${mail.commName}. Click the link below to join:</p>
      <a href="http://localhost:3000/invitation/${createdInvitation.id}">Join Now</a>
      <p>We look forward to having you as a member!</p>`,
    };

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: "poojabelaramani51@gmail.com",
        pass: BREVO_API_KEY,
      },
    });

    await transporter.sendMail({
      from: mail.from,
      ...message,
    });
  }

  return true;
}
