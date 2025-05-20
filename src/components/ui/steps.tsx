
import * as React from "react";
import { cn } from "@/lib/utils";

export interface StepsProps {
  items: {
    title: string;
    description?: string;
    icon?: React.ReactNode;
  }[];
  activeStep: number;
  className?: string;
  orientation?: "vertical" | "horizontal";
}

export function Steps({
  items,
  activeStep,
  className,
  orientation = "horizontal",
}: StepsProps) {
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
              activeStep >= idx ? "step-active" : ""
            )}
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

export default Steps;
