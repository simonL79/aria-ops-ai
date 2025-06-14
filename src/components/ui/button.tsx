
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 transform hover:scale-105 transition-all duration-200",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 transform hover:scale-105 transition-all duration-200",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground transform hover:scale-105 transition-all duration-200",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 transform hover:scale-105 transition-all duration-200",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-gradient-to-br from-premium-darkGray via-premium-gray to-premium-black text-white hover:shadow-md transform hover:scale-105 transition-all duration-200",
        action: "bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg",
        scan: "bg-emerald-600 text-white hover:bg-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg font-bold",
        generate: "bg-purple-600 text-white hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg font-bold",
        escalate: "bg-amber-600 text-white hover:bg-amber-500 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg",
        dismiss: "bg-gray-500 text-white hover:bg-gray-600 transform hover:scale-105 transition-all duration-200",
        deliver: "bg-indigo-600 text-white hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg font-bold"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
