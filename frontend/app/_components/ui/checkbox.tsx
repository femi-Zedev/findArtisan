"use client";

import * as React from "react";
import { Checkbox as MantineCheckbox, CheckboxProps as MantineCheckboxProps } from "@mantine/core";
import { cn } from "@/app/lib/utils";

// Re-export Mantine's CheckboxProps for compatibility
export type CheckboxProps = MantineCheckboxProps;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, size = "sm", color = "teal", radius = "xs", ...props }, ref) => {
    return (
      <MantineCheckbox
        ref={ref}
        size={size}
        color={color}
        radius={radius}
        classNames={{
          input: cn("rounded-[4px]", className),
        }}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };

