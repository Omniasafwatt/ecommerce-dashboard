import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsContextValue {
  activeTab: string
  setActiveTab: (tab: string) => void
  variant: "underline" | "pills" | "boxed"
}

const TabsContext = React.createContext<TabsContextValue>({
  activeTab: "",
  setActiveTab: () => {},
  variant: "underline",
})

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
  variant?: "underline" | "pills" | "boxed"
}

const Tabs: React.FC<TabsProps> = ({
  defaultValue = "",
  value,
  onValueChange,
  children,
  className,
  variant = "underline",
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const activeTab = value !== undefined ? value : internalValue

  const setActiveTab = (tab: string) => {
    if (value === undefined) setInternalValue(tab)
    onValueChange?.(tab)
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { variant } = React.useContext(TabsContext)
    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          "flex",
          variant === "underline" && "border-b border-gray-200 gap-0",
          variant === "pills" && "gap-2 p-1 bg-gray-100 rounded-xl w-fit",
          variant === "boxed" && "border border-gray-200 rounded-lg p-1 gap-1 bg-gray-50 w-fit",
          className
        )}
        {...props}
      />
    )
  }
)
TabsList.displayName = "TabsList"

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, children, ...props }, ref) => {
    const { activeTab, setActiveTab, variant } = React.useContext(TabsContext)
    const isActive = activeTab === value

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        onClick={() => setActiveTab(value)}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap font-medium text-sm transition-all",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
          "disabled:pointer-events-none disabled:opacity-50",
          variant === "underline" && [
            "px-4 py-3 -mb-px border-b-2",
            isActive
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
          ],
          variant === "pills" && [
            "px-4 py-2 rounded-lg",
            isActive
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900",
          ],
          variant === "boxed" && [
            "px-3 py-1.5 rounded-md",
            isActive
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900",
          ],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const { activeTab } = React.useContext(TabsContext)
    if (activeTab !== value) return null

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn("mt-4 focus:outline-none", className)}
        {...props}
      />
    )
  }
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
