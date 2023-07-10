import { type LoaderArgs, type ActionArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useGlobalPendingState } from "remix-utils";
import { authenticator } from "~/services/auth.server";
import { db } from "~/utils/db.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const invitation = await db.invitation.findUnique({
    where: { id: params.id },
    include: { community: true },
  });

  const commName = invitation?.community.name;

  if (!invitation || (user && user.email !== invitation.email)) {
    return redirect("/dashboard");
  }

  return {
    user,
    commName,
  };
};

export const action = async ({ request, params }: ActionArgs) => {
  const form = await request.formData();
  const action = form.get("action");

  if (action === "accept") {
    const invitation = await db.invitation.findUnique({
      where: { id: params.id },
    });

    const user = await db.user.findUnique({
      where: { email: invitation?.email },
    });

    if (user && invitation) {
      await db.community.update({
        where: {
          id: invitation.communityId,
        },
        data: {
          users: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      await db.invitation.delete({
        where: {
          id: params.id,
        },
      });
    }

    return redirect("/dashboard");
  }

  if (action === "reject") {
    await db.invitation.delete({
      where: {
        id: params.id,
      },
    });
    return redirect("/dashboard");
  }

  return null;
};

export default function Invitation() {
  const loaderData = useLoaderData();
  const isBusy = useGlobalPendingState().includes("pending");

  return (
    <div className="flex flex-col gap-8 justify-center items-center h-screen">
      <h1 className="font-semibold text-2xl text-center">
        You have beem Invited to join {loaderData.commName}
      </h1>
      <Form method="post" className="flex flex-col gap-4">
        <button
          className="bg-purple-600 px-3 py-1 border border-purple-600 rounded hover:bg-transparent hover:text-purple-600 duration-300 disabled:cursor-not-allowed disabled:opacity-50"
          name="action"
          value="accept"
          type="submit"
          disabled={isBusy}
        >
          Accept
        </button>
        <div className="flex flex-row justify-start gap-4 w-full items-center">
          <hr className=" border-white/20 flex-1 w-20" />
          <h5>Or</h5>
          <hr className=" border-white/20 flex-1" />
        </div>
        <button
          className="bg-purple-600 px-3 py-1 border border-purple-600 rounded hover:bg-transparent hover:text-purple-600 duration-300 disabled:cursor-not-allowed disabled:opacity-50"
          name="action"
          value="reject"
          type="submit"
          disabled={isBusy}
        >
          Reject
        </button>
      </Form>
    </div>
  );
}
