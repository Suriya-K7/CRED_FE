"use Client";
import User from "@/components/User";

export default function Home() {
  return (
    <div className="lg:max-w-6xl bg-white pl-4 pr-10 py-12 flex mx-auto shadow-md flex-col gap-3 min-h-[calc(100vh-160px)]">
      <User />
    </div>
  );
}
