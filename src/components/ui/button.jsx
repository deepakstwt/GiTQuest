import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0",
				outline:
					"border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0",
				ghost: "hover:bg-accent hover:text-accent-foreground transform hover:-translate-y-0.5 active:translate-y-0",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-12 rounded-lg px-8 text-base",
				xl: "h-14 rounded-xl px-10 text-lg font-semibold",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, children, ...props }, ref) => {
	const Comp = asChild ? Slot : "button"
	
	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			ref={ref}
			{...props}
		>
			{/* Content */}
			<span className="flex items-center gap-2">
				{children}
			</span>
		</Comp>
	)
})
Button.displayName = "Button"

export { Button, buttonVariants }
