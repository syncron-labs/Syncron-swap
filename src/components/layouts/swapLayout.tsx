import React from "react";
import Navbar from "../navbar";

const SwapLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default SwapLayout;
