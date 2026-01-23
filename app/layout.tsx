import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/components/providers/query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { TopNav } from '@/components/layout/top-nav';
import { Sidebar } from '@/components/layout/sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Blockchain Monitoring Dashboard',
  description: 'Real-time monitoring for Hyperledger Fabric and Stellar networks',
  openGraph: {
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={inter.className}>
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="system"
//           enableSystem
//           disableTransitionOnChange
//         >
//           <QueryProvider>
//             <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//               <TopNav />
//               <div className="flex">
//                 <Sidebar />
//                 <main className="flex-1">
//                   {children}
//                 </main>
//               </div>
//             </div>
//           </QueryProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {/* ROOT */}
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
              
              {/* HEADER */}
              <TopNav />

              {/* CONTENT AREA (this was missing height) */}
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                  {children}
                </main>
              </div>

            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
