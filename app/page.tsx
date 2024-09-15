"use client";

import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex-grow flex items-center justify-center bg-gradient-to-b from-blue-200 to-blue-400">
      {pathname === "/game1"}
      {pathname === "/game2"}
      {pathname !== "/game1" && pathname !== "/game2" && (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8 text-blue-800">
            Welcome to MiniGamesAI!
          </h1>
          <p className="text-xl mb-8">
            Choose a game from the navigation menu to start playing.
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => router.push("/game1")} className="text-lg">
              Play Bubble Math
            </Button>
            <Button onClick={() => router.push("/game2")} className="text-lg">
              Play Growing Bubble Math
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
