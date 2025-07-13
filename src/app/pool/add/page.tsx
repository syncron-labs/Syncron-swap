"use client";
import AddLiquiditySection from "@/src/section/pool/addLiquidity.section";
import React from "react";

const page = () => {
  return (
    <div className="bg-slate-950 h-auto min-h-screen pb-12 flex flex-col items-center justify-start">
      <AddLiquiditySection />
    </div>
  );
};

export default page;
