import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "./queryClient";
import { ColorModeProvider } from "@shared/styles";
import { AuthProvider } from "@/shared/components/Layout/Header";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeProvider>
        <BrowserRouter>
          <AuthProvider>
            {children}
          </AuthProvider>
        </BrowserRouter>
      </ColorModeProvider>
    </QueryClientProvider>
  );
}
