"use client";
import { CredLogo } from "@/public/assets/Icon";

export default function Header() {
  return (
    <div
      className={`bg-custom-banner h-32 bg-cover bg-center bg-no-repeat flex items-center justify-between px-8 md:px-44 gap-6`}
    >
      <CredLogo />
      <div className="text-white text-xl md:text-3xl">
        SME HealthCheck - Get Started
      </div>
    </div>
  );
}
