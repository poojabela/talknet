import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="px-6">
      <div className="w-40 h-40 bg-blue-600 blur-[100px] absolute top-60 right-0 mx-auto"></div>
      <div className="py-4 flex justify-between">
        <h1 className="text-2xl font-semibold">TalkNet</h1>
        <Link
          to="/login"
          className="bg-blue-600 border border-blue-600 rounded px-2 py-1 hover:bg-transparent hover:text-blue-600 duration-300 "
        >
          Get started
        </Link>
      </div>
      <div className="h-[70vh] flex flex-col gap-4 justify-center items-center">
        <h1 className="text-4xl font-bold text-center">
          Where Conversations Thrive, Connections Flourish.
        </h1>
        <p className="text-lg text-white/20 text-center">
          Empowering seamless connections and collaborative conversations for a
          thriving online community.
        </p>
        <Link
          to="/login"
          className="bg-blue-600 border border-blue-600 rounded px-7 py-2 hover:bg-transparent hover:text-blue-600 duration-300 "
        >
          Get started
        </Link>
      </div>
    </div>
  );
}
