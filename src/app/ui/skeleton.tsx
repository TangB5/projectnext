import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils"; // Assurez-vous d'avoir une fonction cn pour combiner les classes

const skeletonVariants = cva(
  "animate-pulse bg-gray-100 dark:bg-gray-800 rounded-md",
  {
    variants: {
      variant: {
        default: "",
        text: "h-4",
        circle: "rounded-full",
        rect: "rounded-none",
        card: "rounded-xl",
      },
      effect: {
        none: "",
        shimmer:
          "relative overflow-hidden after:absolute after:inset-0 after:-translate-x-full after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent after:animate-shimmer",
        pulse: "animate-pulse",
        wave:
          "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-wave",
      },
    },
    defaultVariants: {
      variant: "default",
      effect: "pulse",
    },
  }
);

interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  isLoaded?: boolean;
  children?: React.ReactNode;
}

export const Skeleton = ({
  className,
  variant,
  effect,
  isLoaded = false,
  children,
  ...props
}: SkeletonProps) => {
  if (isLoaded) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(skeletonVariants({ variant, effect }), className)}
      {...props}
    >
      {/* Contenu invisible pour maintenir la taille */}
      <span className="opacity-0">{children}</span>
    </div>
  );
};

export const SkeletonGroup = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("space-y-2", className)}>{children}</div>;
};

