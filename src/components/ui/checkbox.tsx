import * as React from "react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
  description?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const generatedId = React.useId()
    const checkboxId = id || generatedId

    return (
      <div className="flex items-start gap-3">
        <div className="flex items-center h-5 mt-0.5">
          <input
            id={checkboxId}
            type="checkbox"
            ref={ref}
            className={cn(
              "h-4 w-4 rounded border-gray-300 text-sky-600",
              "focus:ring-2 focus:ring-sky-500 focus:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "cursor-pointer transition-colors",
              className
            )}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={checkboxId}
                className="text-sm font-medium text-gray-700 cursor-pointer select-none"
              >
                {label}
              </label>
            )}
            {description && (
              <span className="text-xs text-gray-500 mt-0.5">{description}</span>
            )}
          </div>
        )}
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
