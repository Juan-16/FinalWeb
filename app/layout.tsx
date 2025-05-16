import './globals.css'
import { SideBar } from "./components/SideBar";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export const metadata = {
  title: 'FinalWeb',
  description: 'Frontend para NestJS – Lucha por tu libertad',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
     <body className="bg-neutral-900 text-gray-200 min-h-screen flex flex-col">
        {/* Header fijo arriba */}
        <Header />

        {/* Contenedor principal: Sidebar + contenido */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar (oculto en móviles) */}
          <div className="hidden md:block">
            <SideBar />
          </div>

          {/* Main scrollable */}
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>

        {/* Footer fijo abajo */}
        <Footer />
      </body>
    </html>
  )
}