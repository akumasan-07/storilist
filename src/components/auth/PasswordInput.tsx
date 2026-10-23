"use client";

import { useState, forwardRef, ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";

export type PasswordInputProps = Omit<ComponentProps<"input">, "type">;

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <input
          {...props}
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={`w-full rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 pr-11 text-sm text-foreground placeholder:text-subtle-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${className}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
