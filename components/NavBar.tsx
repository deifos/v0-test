"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

const games = [
  { name: "Game 1: Bubble Math", href: "/game1" },
  { name: "Game 2: Growing Bubble", href: "/game2" },
];

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground shadow-lg z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => router.push("/")} className="flex-shrink-0">
              <span className="text-2xl font-bold">MiniGamesAI</span>
            </button>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {games.map((game) => (
                <button
                  key={game.name}
                  onClick={() => router.push(game.href)}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium",
                    pathname === game.href
                      ? "bg-primary-foreground text-primary"
                      : "hover:bg-primary-foreground/10"
                  )}
                >
                  {game.name}
                </button>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {games.map((game) => (
                  <DropdownMenuItem
                    key={game.name}
                    onSelect={() => router.push(game.href)}
                  >
                    {game.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
