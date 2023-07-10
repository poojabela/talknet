import { type LoaderArgs, type ActionArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { createMessage } from "~/services/message.server";
import { db } from "~/utils/db.server";
import TopNav from "~/components/topNav";
import { sendEmail } from "~/services/sendEmail.server";
import { useGlobalPendingState } from "remix-utils";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

export const loader = async ({ params, request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const community = await db.community.findUnique({
    where: {
      id: params.id,
    },
    include: {
      messages: true,
      users: true,
    },
  });

  const isUser = community?.users.find((u) => u.id === user.id);

  if (!community || !isUser) {
    return redirect("/dashboard");
  }

  const message = await db.message.findMany({
    where: {
      communityId: params.id as string,
    },
    include: {
      user: true,
    },
  });

  return { message, community, user };
};

export const action = async ({ request, params }: ActionArgs) => {
  const form = await request.formData();
  const message = form.get("message") as string;
  const email = form.get("email") as string;
  const action = form.get("action");
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const community = await db.community.findUnique({
    where: {
      id: params.id,
    },
  });

  if (action === "send_msg") {
    await createMessage({
      content: message,
      userId: user.id as string,
      communityId: params.id as string,
    });
  }
  if (email && action === "send_mail") {
    try {
      await sendEmail({
        to: email,
        from: user.email,
        communityId: params.id as string,
        commName: community?.name as string,
      });
    } catch (error: any) {
      return {
        error: error.message as string,
      };
    }
  }

  return null;
};

const Chat = () => {
  const loaderData = useLoaderData();
  const messages = loaderData.message;
  const actionData = useActionData<typeof action>();

  const isBusy = useGlobalPendingState().includes("pending");
  const formRef = useRef();

  useEffect(() => {
    if (!isBusy) {
      //@ts-ignore
      formRef.current?.reset();
    }
  }, [isBusy]);

  useEffect(() => {
    if (actionData && "error" in actionData) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  return (
    <div className="flex flex-col h-screen">
      <TopNav commName={loaderData.community.name} />
      <div className="px-4 py-5 flex flex-col gap-2 flex-1 overflow-auto">
        {messages.map((message: any) => (
          <div className="self-start" key={message.id}>
            <div className="bg-white/20 py-1 px-4 rounded-md max-w-lg">
              <p className={"text-teal-600 font-semibold"}>
                {message.user.id === loaderData.user.id
                  ? "Me"
                  : message.user.name}
              </p>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="">
        <Form
          // @ts-ignore
          ref={formRef}
          method="POST"
          className="flex items-center gap-2 w-full bg-white/10 p-4 backdrop-blur-sm"
        >
          <input
            id="message"
            name="message"
            type="text"
            placeholder="Chat here..."
            className="mt-1 flex-1 bg-white/20 placeholder:text-white/50 p-2 rounded-md focus:outline-none"
          />
          <button
            type="submit"
            className="bg-purple-600 rounded-md p-2"
            name="action"
            value={"send_msg"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </Form>
      </div>
    </div>
  );
};

export default Chat;
