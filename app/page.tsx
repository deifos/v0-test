"use client";

import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex-grow flex items-center justify-center bg-gradient-to-b from-blue-200 to-blue-400 p-4">
      {pathname === "/game1"}
      {pathname === "/game2"}
      {pathname !== "/game1" && pathname !== "/game2" && (
        <div className="text-center w-full max-w-md mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-blue-800">
            Welcome to MiniGamesAI!
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 md:mb-8">
            What do you want to play
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={() => router.push("/game1")}
              className="text-base sm:text-lg w-full sm:w-auto"
            >
              Play Bubble Math
            </Button>
            <Button
              onClick={() => router.push("/game2")}
              className="text-base sm:text-lg w-full sm:w-auto"
            >
              Play Growing Bubble Math
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
