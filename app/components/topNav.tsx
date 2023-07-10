import { Form, useParams } from "@remix-run/react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useGlobalPendingState } from "remix-utils";
import { useEffect, useRef } from "react";

interface topNavProps {
  commName: string;
}

const TopNav = ({ commName }: topNavProps) => {
  const params = useParams();
  const isBusy = useGlobalPendingState().includes("pending");
  const formRef = useRef();

  useEffect(() => {
    if (!isBusy) {
      //@ts-ignore
      formRef.current?.reset();
    }
  }, [isBusy]);

  return (
    <div className="sticky top-0">
      <div className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-sm">
        <h1>{commName}</h1>
        <Dialog>
          <DialogTrigger>
            <button className="bg-blue-600 px-3 py-1 border border-blue-600 rounded hover:bg-transparent hover:text-blue-600 duration-300 disabled:cursor-not-allowed disabled:opacity-50">
              Send Invite
            </button>
          </DialogTrigger>
          <DialogContent>
            <h1 className="font-bold text-lg">Send Invite</h1>
            <h4 className="text-white/50 text-md font-light mb-5">
              Send an email to invite a member in {commName}
            </h4>
            <Form
              method="post"
              action={`/dashboard/chat/${params.id}`}
              //@ts-ignore
              ref={formRef}
            >
              <div className="flex flex-col flex- gap-2">
                <label htmlFor="invite" className="block text-xs uppercase">
                  Enter Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="invite-email"
                  required
                  placeholder="enter email"
                  className="w-full bg-white/10 border border-white/5 rounded px-3 py-2 focus:border-blue-400 focus:outline-none mb-4"
                />
              </div>
              <button
                name="action"
                value={"send_mail"}
                type="submit"
                className={`bg-blue-600 mt-5 px-3 py-2 border border-blue-600 rounded w-full  ${
                  !isBusy
                    ? "hover:bg-transparent hover:text-blue-600 duration-300"
                    : "disabled:cursor-not-allowed disabled:opacity-50"
                }`}
                disabled={isBusy}
              >
                Send
              </button>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TopNav;
