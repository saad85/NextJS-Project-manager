import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import LoginPage from "@/app/login/page";
import DashboardWrapper from "./dashboardWrapper";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Project Manager",
  description: "A NextJS-based project management application",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth-token")?.value;
  const isAuthenticated = !!authToken;

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased min-h-screen`}>
        {isAuthenticated ? (
          <DashboardWrapper>{children}</DashboardWrapper>
        ) : (
          <DashboardWrapper>{children}</DashboardWrapper>
          // <LoginPage />
        )}
      </body>
    </html>
  );
}
