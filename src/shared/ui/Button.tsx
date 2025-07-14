import React from "react";
import { Button as HeroButton } from "@heroui/react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "solid" | "bordered" | "light" | "flat";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  isLoading?: boolean;
}

export function Button({
  children,
  onClick,
  variant = "solid",
  color = "primary",
  size = "md",
  disabled = false,
  className = "",
  startContent,
  endContent,
  isLoading = false,
}: ButtonProps) {
  return (
    <HeroButton
      onPress={onClick}
      variant={variant}
      color={color}
      size={size}
      isDisabled={disabled}
      className={className}
      startContent={startContent}
      endContent={endContent}
      isLoading={isLoading}
    >
      {children}
    </HeroButton>
  );
}
