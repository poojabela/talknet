import React, { useState } from "react";
import {
  type ActionFunction,
  json,
  type LoaderFunction,
} from "@remix-run/node";

import { useActionData, Link } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { createUser } from "~/services/users.server";
import { useGlobalPendingState } from "remix-utils";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
  return { user };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  const name = form.get("name");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string"
  ) {
    return json({ error: `Invalid Form Data` }, { status: 400 });
  }

  await createUser({ email, password, name });

  return await authenticator.authenticate("form", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/register",
    context: { formData: form },
  });
};

export default function Register() {
  const actionData = useActionData();
  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || "",
    password: actionData?.fields?.password || "",
    name: actionData?.fields?.password || "",
  });
  const isBusy = useGlobalPendingState().includes("pending");

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  return (
    <div className="text-white w-[min(700px,_100%)] mx-auto my-10 p-2">
      <h1 className="text-2xl font-semibold mb-10">Sign Up</h1>
      <form method="POST">
        <div>
          <div>
            <label htmlFor="name" className="block text-xs mb-2 uppercase">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="name"
              required
              className="w-full bg-white/10 border border-white/5 rounded px-3 py-2 focus:border-blue-400 focus:outline-none mb-4"
              onChange={(e) => handleInputChange(e, "name")}
              value={formData.name}
            />
          </div>
          <label htmlFor="email" className="block text-xs mb-2 uppercase">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full bg-white/10 border border-white/5 rounded px-3 py-2 focus:border-blue-400 focus:outline-none mb-4"
            onChange={(e) => handleInputChange(e, "email")}
            value={formData.email}
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
            value={formData.password}
            onChange={(e) => handleInputChange(e, "password")}
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
          Sign up
        </button>

        <p className="text-center text-sm mt-2">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600">
            Sign in{" "}
          </Link>
          instead.
        </p>
      </form>
    </div>
  );
}
