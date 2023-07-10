import { type ActionArgs, type LoaderFunction } from "@remix-run/node";
import { Link, Form, useActionData } from "@remix-run/react";
import { AuthorizationError } from "remix-auth";
import { authenticator } from "~/services/auth.server";
import { useGlobalPendingState } from "remix-utils";
import toast from "react-hot-toast";
import { useEffect } from "react";

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });

  return null;
};

export const action = async ({ request }: ActionArgs) => {
  try {
    return await authenticator.authenticate("form", request, {
      successRedirect: "/dashboard",
      throwOnError: true,
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    if (error instanceof AuthorizationError) {
      return {
        error: error.message,
      };
    }

    return {
      error: "Unexpected error!",
    };
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();

  const isBusy = useGlobalPendingState().includes("pending");

  useEffect(() => {
    if (actionData && "error" in actionData) {
      console.log(actionData.error);
      toast.error(actionData.error);
    }
  }, [actionData]);

  return (
    <div className="text-white w-[min(700px,_100%)] mx-auto my-10 p-2">
      <h1 className="text-2xl font-semibold mb-10">Login</h1>
      <Form method="POST">
        <div>
          <label htmlFor="email" className="block text-xs mb-2 uppercase">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full bg-white/10 border border-white/5 rounded px-3 py-2 focus:border-blue-400 focus:outline-none mb-4"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs mb-2 uppercase">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full bg-white/10 border border-white/5 rounded px-3 py-2 focus:border-blue-400 focus:outline-none mb-4"
          />
        </div>
        <button
          type="submit"
          className={`bg-blue-600 mt-5 px-3 py-2 border border-blue-600 rounded w-full  ${
            !isBusy
              ? "hover:bg-transparent hover:text-blue-600 duration-300"
              : "disabled:cursor-not-allowed disabled:opacity-50"
          }`}
          disabled={isBusy}
        >
          Sign In
        </button>

        <p className="text-center text-sm mt-2">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-blue-600">
            Sign up
          </Link>
        </p>
      </Form>
    </div>
  );
}
