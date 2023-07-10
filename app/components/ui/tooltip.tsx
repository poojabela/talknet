import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { type ReactNode } from "react";

export type TooltipProps = TooltipPrimitive.TooltipContentProps & {
  content: ReactNode;
};

export function Tooltip({
  children,
  content,
  className,
  ...props
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        sideOffset={8}
        className={[
          "bg-black border border-white/5 backdrop-blur rounded px-2 py-1",
          className ?? "",
        ].join(" ")}
        {...props}
      >
        {content}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  );
}
