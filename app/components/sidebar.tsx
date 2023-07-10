import { Form, Link, useParams } from "@remix-run/react";
import { Tooltip } from "./ui/tooltip";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { useEffect, useRef, useState } from "react";
import { useGlobalPendingState } from "remix-utils";

const Sidebar = ({ data }: any) => {
  const params = useParams();
  const isBusy = useGlobalPendingState().includes("pending");
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedImage(file ? URL.createObjectURL(file) : null);
  };

  useEffect(() => {
    if (!isBusy) {
      //@ts-ignore
      formRef.current?.reset();
    }
  }, [isBusy]);

  return (
    <div
      className={`h-screen p-2 md:p-4 flex-col justify-between items-start border-white/5 bg-black border-r-2 flex`}
    >
      <div className="flex-1 overflow-auto flex flex-col gap-2 no-scrollbar">
        {data.map((d: any) => (
          <Tooltip
            key={d.id}
            content={d.name}
            side="right"
            className="relative z-10"
          >
            <div>
              <Link to={`chat/${d.id}`}>
                {!d.profileImage ? (
                  <div
                    className={`relative h-10 w-10 rounded-full ${
                      params.id === d.id ? "bg-teal-600" : "bg-teal-600/20"
                    } flex items-center justify-center hover:bg-teal-600 duration-300 ease-in-out`}
                  >
                    {d.name.split(" ").map((word: string) => word.charAt(0))}
                  </div>
                ) : (
                  <img
                    src={d.profileImage}
                    alt="img"
                    className="h-10 w-10 rounded-full"
                  />
                )}
              </Link>
            </div>
          </Tooltip>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <Dialog>
          <DialogTrigger>
            <Tooltip content={"create"} side="right">
              <button className="h-10 w-10 rounded-full bg-blue-600/20 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white delay-150 duration-300 ease-in-out">
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
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </Tooltip>
          </DialogTrigger>
          <DialogContent>
            <h1 className="font-bold text-lg">Create Your Community</h1>
            <p className="text-white/50 text-md font-light mb-5">
              Add Name and icon to your server
            </p>

            {/* @ts-ignore */}
            <Form
              method="POST"
              action="/dashboard"
              ref={formRef}
              encType="multipart/form-data"
            >
              <label>
                {!selectedImage ? (
                  <div className="rounded-full h-14 w-14 bg-white/20 mx-auto flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                      />
                    </svg>
                  </div>
                ) : (
                  <img
                    src={selectedImage}
                    alt="profilePic"
                    className="overflow-hidden rounded-full h-14 w-14 mx-auto mb-4"
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  name="profileImage"
                  onChange={handleImageChange}
                />
              </label>

              <label htmlFor="name" className="block text-xs uppercase mb-2">
                Community Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                placeholder="Name of community"
                className="w-full bg-white/10 border border-white/5 rounded px-3 py-2 focus:border-blue-400 focus:outline-none mb-4"
              />

              <button
                type="submit"
                className={`bg-blue-600 mt-5 px-3 py-2 border border-blue-600 rounded w-full  ${
                  !isBusy
                    ? "hover:bg-transparent hover:text-blue-600 duration-300"
                    : "disabled:cursor-not-allowed disabled:opacity-50"
                }`}
                disabled={isBusy}
              >
                Create
              </button>
            </Form>
          </DialogContent>
        </Dialog>
        <Tooltip content={"logout"} side="right" className="relative z-10">
          <Form method="post" action="/logout">
            <button
              type="submit"
              className="h-10 w-10 rounded-full bg-red-600/20 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white  delay-150 duration-300 ease-in-out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
            </button>
          </Form>
        </Tooltip>
      </div>
    </div>
  );
};

export default Sidebar;
