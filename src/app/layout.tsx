import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  title: "Breadit",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

const inter = Inter({ subsets: ["latin"] });

// https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#convention
// layout 組件可以接收到通過 props.authModal 拿到 @authModal slot
export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // https://tailwindcss.com/docs/font-smoothing
      className={cn(
        "bg-white text-slate-900 antialiased light my-2",
        inter.className
      )}
    >
      <body className="min-h-screen pt-12 bg-slate-50 antialiased">
        <Providers>
          {/* @ts-expect-error Server Component */}
          <Navbar />

          {authModal}

          <div className="container max-w-7xl mx-auto h-full pt-12">
            {children}
          </div>

          {/* https://ui.shadcn.com/docs/components/toast */}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
