import {
  type ActionArgs,
  json,
  type LoaderArgs,
  unstable_parseMultipartFormData,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
} from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { db } from "~/utils/db.server";
import Sidebar from "~/components/sidebar";
import { Outlet, useLoaderData } from "@remix-run/react";
import { createCommunity } from "~/services/community.server";
import { uploadImageToCloudinary } from "~/services/cloudinary.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const userCommunity = await db.community.findMany({
    where: {
      users: { some: { id: user?.id } },
    },
  });

  if (!userCommunity) {
    return json({ error: "Not found!" });
  }

  return {
    userCommunity,
  };
};

export const action = async ({ request }: ActionArgs) => {
  const uploadHandler = unstable_composeUploadHandlers(
    // our custom upload handler
    async ({ name, contentType, data, filename }) => {
      if (name !== "profileImage" || !filename) {
        return undefined;
      }
      const uploadedImage = await uploadImageToCloudinary(data);
      return uploadedImage.secure_url;
    },
    // fallback to memory for everything else
    unstable_createMemoryUploadHandler()
  );

  const form = await unstable_parseMultipartFormData(request, uploadHandler);
  const name = form.get("name");
  let profileImage = form.get("profileImage") as any;

  if (typeof name !== "string") {
    return json({ error: `Invalid Form Data` }, { status: 400 });
  }
  if (typeof profileImage !== "string") {
    profileImage = undefined;
  }

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  if (!user) {
    return json({ error: `User not logged in!` }, { status: 400 });
  }

  return await createCommunity({ name, userId: user.id, profileImage });
};

const DashboardLayout = () => {
  const loaderData = useLoaderData();

  return (
    <div className="flex">
      <Sidebar data={loaderData.userCommunity} />
      <div className="flex-1 h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
