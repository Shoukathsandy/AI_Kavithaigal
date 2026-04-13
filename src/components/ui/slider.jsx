import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[#1a1e2a]">
      <SliderPrimitive.Range className="absolute h-full rounded-full" style={{ background: "var(--accent-color, #8b7aff)" }} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-[#8b7aff] bg-[#050710] shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b7aff] disabled:pointer-events-none disabled:opacity-50 cursor-pointer hover:scale-110"
      style={{ borderColor: "var(--accent-color, #8b7aff)" }}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
