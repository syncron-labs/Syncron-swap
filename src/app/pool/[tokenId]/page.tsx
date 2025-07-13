"use client";
import PoolDetailsSection from "@/src/section/pool/poolDetails.section";
import React from "react";

const page = () => {
  return (
    <div className="bg-slate-950 min-h-screen w-full pb-12 flex flex-col items-center justify-start">
      <PoolDetailsSection />
    </div>
  );
};

export default page;
