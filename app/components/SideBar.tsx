// components/ui/SideBar.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import Link from "next/link";

const navItems = [
  { name: "Inicio", href: "/" },
  { name: "Esclavos", href: "/slaves" },
  { name: "Dictadores", href: "/dictators" },
  { name: "Transacciones", href: "/transactions" },
  { name: "Login", href: "/login" },
];

export const SideBar = () => {
  return (
    <div className="flex h-full text-gray-200">
      {/* Botón para móvil */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden text-gray-300 hover:text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-neutral-900 text-gray-100">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold tracking-wide">Lucha Web</h2>
          </div>
          <nav className="mt-4 flex flex-col gap-2 px-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Sidebar escritorio */}
      <aside className="hidden md:flex md:flex-col w-64 bg-neutral-900 text-gray-100 border-r border-gray-800">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold tracking-wide">Lucha Web</h2>
        </div>
        <nav className="flex-1 mt-6 flex flex-col px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
            >
              <span className="ml-2 font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
};
