"use client";
import AlertWithLink from "@/src/components/alerts/alertWithLink";
import SwapSection from "@/src/section/swap/swap.section";
import * as React from "react";

export default function Swap() {
  return (
    <div className="bg-slate-950 h-screen flex flex-col items-center justify-start">
      <SwapSection />
      {/* <AlertWithLink
        description={"Arbitrum Token Bridge"}
        title={"Arbitrum Token Bridge is live! 🎉 "}
        href={"https://google.com"}
        onClick={() => console.log("clicked")}
        className="w-[450px] mt-4  rounded-xl "
      /> */}
    </div>
  );
}
