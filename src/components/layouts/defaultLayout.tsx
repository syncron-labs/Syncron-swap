"use client";
import store from "@/store";
import React from "react";
import { Provider } from "react-redux";
import { Toaster } from "@/src/components/ui/toaster";

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster />
      <Provider store={store}>{children}</Provider>
    </>
  );
};

export default DefaultLayout;
