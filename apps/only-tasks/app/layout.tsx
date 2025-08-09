import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'Task Tracker',
  description: 'Minimal task tracker prototype'
}

// Using 'any' to avoid cross-package ReactNode type incompatibilities in monorepo
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script id="theme-init" strategy="beforeInteractive">{`
          (function() {
            try {
              var ls = localStorage.getItem('theme');
              var dark = ls ? ls === 'dark' : true; // default to dark
              var cl = document.documentElement.classList;
              if (dark) cl.add('dark'); else cl.remove('dark');
            } catch (e) {}
          })();
        `}</Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
