import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Container({
  children,
  className = "",
  ...props
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
