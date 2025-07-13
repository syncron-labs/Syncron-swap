import LayoutWithHeader from "@/src/components/layouts/layoutWithHeader";
import React from "react";

export default function SwapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <LayoutWithHeader>{children}</LayoutWithHeader>
    </div>
  );
}
