import * as React from "react";
import { cn } from "../../lib/utils";

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    { className, pressed, onPressedChange, children, onClick, ...props },
    ref
  ) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPressedChange?.(!pressed);
      onClick?.(event);
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
          "h-9 px-3",
          pressed && "bg-accent text-accent-foreground",
          className
        )}
        onClick={handleClick}
        data-state={pressed ? "on" : "off"}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Toggle.displayName = "Toggle";

export { Toggle };
