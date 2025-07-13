"use client";
import React from "react";
import Navbar from "../navbar";
import Footer from "../footer";

const LayoutWithHeaderAndFooter = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default LayoutWithHeaderAndFooter;
