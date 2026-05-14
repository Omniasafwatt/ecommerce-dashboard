import * as React from "react"
import { cn } from "@/lib/utils"

type TooltipPosition = "top" | "bottom" | "left" | "right"

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  position?: TooltipPosition
  className?: string
  delay?: number
}

const positionStyles: Record<TooltipPosition, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
}

const arrowStyles: Record<TooltipPosition, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800",
  left: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800",
  right: "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800",
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  className,
  delay = 0,
}) => {
  const [visible, setVisible] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    if (delay > 0) {
      timerRef.current = setTimeout(() => setVisible(true), delay)
    } else {
      setVisible(true)
    }
  }

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisible(false)
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && content && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 pointer-events-none",
            positionStyles[position]
          )}
        >
          <div
            className={cn(
              "max-w-xs px-2.5 py-1.5 text-xs font-medium text-white bg-gray-800 rounded-md shadow-lg whitespace-nowrap",
              className
            )}
          >
            {content}
          </div>
          <div
            className={cn(
              "absolute border-4",
              arrowStyles[position]
            )}
          />
        </div>
      )}
    </div>
  )
}

Tooltip.displayName = "Tooltip"

export { Tooltip }
export type { TooltipPosition }
