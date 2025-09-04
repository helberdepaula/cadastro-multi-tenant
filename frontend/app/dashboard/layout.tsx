import type { Metadata } from "next";
import Header from "../component/Layout/Header";
import SideBar from "../component/Layout/SideBar";

export const metadata: Metadata = {
  title: "Desafio dev - Dashboard",
  description: "Desafio dev",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header title="Desafio Dev" />
      <div className="flex pt-16">
        <SideBar />
        <main className="ml-64 w-full p-8">
          {children}
        </main>
      </div>
    </>
  );
}
