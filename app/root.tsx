import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction, V2_MetaFunction } from "@remix-run/node";
import { Toaster } from "react-hot-toast";

import stylesheet from "~/styles/tailwind.css";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export const links: LinksFunction = () => [
  {
    rel: "icon",
    type: "image/svg",
    href: "/logo.svg",
  },
  { rel: "stylesheet", href: stylesheet },
];

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Talknet | Where Conversations Thrive, Connections Flourish." },
  ];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-black text-white">
        <Toaster />
        <TooltipProvider>
          <Outlet />
        </TooltipProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
