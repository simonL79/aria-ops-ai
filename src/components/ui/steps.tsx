
import * as React from "react";
import { cn } from "@/lib/utils";

export interface StepsProps {
  items?: {
    title: string;
    description?: string;
    icon?: React.ReactNode;
  }[];
  activeStep?: number;
  className?: string;
  orientation?: "vertical" | "horizontal";
  children?: React.ReactNode;
  value?: number;
  onChange?: (value: number) => void;
}

export function Steps({
  items,
  activeStep,
  className,
  orientation = "horizontal",
  children,
  value,
  onChange,
}: StepsProps) {
  // If children are provided, use controlled value/onChange pattern
  const currentStep = value !== undefined ? value : activeStep;

  // If using the items API
  if (items && !children) {
    return (
      <div
        className={cn(
          "steps-container",
          orientation === "vertical" ? "flex flex-col gap-4" : "space-y-8",
          className
        )}
      >
        <ol
          className={cn(
            "steps",
            orientation === "vertical"
              ? "relative border-l border-gray-200 dark:border-gray-700"
              : "flex items-center justify-center space-x-4"
          )}
        >
          {items.map((step, idx) => (
            <li
              key={idx}
              className={cn(
                "step",
                orientation === "vertical" ? "ml-6" : "",
                currentStep !== undefined && currentStep >= idx ? "step-active" : ""
              )}
              onClick={() => onChange?.(idx)}
            >
              <div className="step-circle">
                <span className="step-circle-content">
                  {step.icon || idx + 1}
                </span>
              </div>
              <div className="step-info">
                <h3 className="step-title">{step.title}</h3>
                {step.description && (
                  <p className="step-description">{step.description}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  // If using children API
  return (
    <div
      className={cn(
        "steps-container",
        orientation === "vertical" ? "flex flex-col gap-4" : "space-y-8",
        className
      )}
    >
      {children}
    </div>
  );
}

export interface StepProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  index?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Step({ 
  title, 
  description, 
  icon, 
  index = 0,
  active = false,
  onClick,
  className 
}: StepProps) {
  return (
    <li
      className={cn(
        "step",
        active ? "step-active" : "",
        className,
        onClick ? "cursor-pointer" : ""
      )}
      onClick={onClick}
    >
      <div className="step-circle">
        <span className="step-circle-content">
          {icon || index + 1}
        </span>
      </div>
      <div className="step-info">
        <h3 className="step-title">{title}</h3>
        {description && (
          <p className="step-description">{description}</p>
        )}
      </div>
    </li>
  );
}

export default Steps;
