"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef(({ className, value, indicatorClassName, ...props }, ref) => {
  const shift = 100 - (value || 0);
  const rtl = typeof document !== "undefined" && document.documentElement.dir === "rtl";
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      {...props}>
      <ProgressPrimitive.Indicator
        className={cn("h-full w-full flex-1 bg-primary transition-all duration-700 ease-out", indicatorClassName)}
        style={{ transform: `translateX(${rtl ? shift : -shift}%)` }} />
    </ProgressPrimitive.Root>
  );
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }