"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "@/components/AuthProvider";
import { ConfirmationProvider } from "@/components/ConfirmationDialog";


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthProvider>
        <ConfirmationProvider>
          {children}
          <ToastContainer />
        </ConfirmationProvider>
      </AuthProvider>
    </>
  );
}
