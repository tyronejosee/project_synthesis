import React from "react";
import { Card as HeroCard, CardBody, CardHeader } from "@heroui/react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
}

export function Card({ children, className = "", header }: CardProps) {
  return (
    <HeroCard shadow="sm" className={`${className}`}>
      {header && (
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          {header}
        </CardHeader>
      )}
      <CardBody className="overflow-visible py-2">{children}</CardBody>
    </HeroCard>
  );
}
