"use client";
import store from "@/store";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { Toaster } from "@/src/components/ui/toaster";
import PWAInstallPrompt from "../PWAInstallPrompt";

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <>
      <Toaster />
      <Provider store={store}>
        {children}
        <PWAInstallPrompt />
      </Provider>
    </>
  );
};

export default DefaultLayout;
