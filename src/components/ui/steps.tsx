
import * as React from "react";
import { cn } from "@/lib/utils";

interface StepsProps {
  value: number;
  onChange?: (value: number) => void;
  children: React.ReactNode;
  className?: string;
}

export const Steps = React.forwardRef<
  HTMLDivElement,
  StepsProps
>(({ value, onChange, children, className }, ref) => {
  // Count the number of Step children
  const steps = React.Children.toArray(children);
  const totalSteps = steps.length;

  // Create a clone of each Step child with the appropriate props
  const stepsWithProps = React.Children.map(children, (step, index) => {
    if (React.isValidElement(step)) {
      return React.cloneElement(step, {
        index,
        isActive: index === value,
        isCompleted: index < value,
        totalSteps,
        onClick: () => {
          if (onChange) {
            onChange(index);
          }
        }
      });
    }
    return step;
  });

  return (
    <div ref={ref} className={cn("flex flex-row items-center", className)}>
      {stepsWithProps}
    </div>
  );
});

Steps.displayName = "Steps";

interface StepProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  index?: number;
  isActive?: boolean;
  isCompleted?: boolean;
  totalSteps?: number;
  onClick?: () => void;
}

export const Step = React.forwardRef<
  HTMLDivElement,
  StepProps
>(({ 
  title, 
  description, 
  icon, 
  index = 0, 
  isActive = false, 
  isCompleted = false, 
  totalSteps = 1, 
  onClick 
}, ref) => {
  const isLast = index === totalSteps - 1;
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-1 flex-col items-center",
        onClick ? "cursor-pointer" : "cursor-default"
      )}
      onClick={onClick}
    >
      {/* Step header with icon/number and connecting line */}
      <div className="flex w-full items-center">
        <div className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all",
          isActive && "border-2 border-primary bg-background text-primary",
          isCompleted && "border-primary bg-primary text-primary-foreground",
          !isActive && !isCompleted && "border-input bg-background text-muted-foreground"
        )}>
          {isCompleted ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.3337 4L6.00033 11.3333L2.66699 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : icon ? (
            icon
          ) : (
            <span className="text-xs">{index + 1}</span>
          )}
        </div>
        {!isLast && (
          <div
            className={cn(
              "h-[2px] flex-1 bg-border transition-all",
              isCompleted && "bg-primary"
            )}
          />
        )}
      </div>
      
      {/* Step title and description */}
      <div className={cn(
        "mt-2 space-y-1 text-center",
        isActive && "text-foreground",
        !isActive && "text-muted-foreground"
      )}>
        <div className="text-sm font-medium">{title}</div>
        {description && (
          <div className="hidden text-xs sm:block">{description}</div>
        )}
      </div>
    </div>
  );
});

Step.displayName = "Step";
