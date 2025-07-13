import PoolListSection from "@/src/section/pool/poolList.section";
import React from "react";

const page: React.FC = () => {
  return (
    <div className="bg-slate-950 pb-20 h-auto min-h-screen flex flex-col items-center justify-start">
      <PoolListSection />
    </div>
  );
};

export default page;
