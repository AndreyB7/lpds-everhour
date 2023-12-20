import { Theme } from "@radix-ui/themes";
import { Inter } from "next/font/google";
import '@radix-ui/themes/styles.css';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <body className={ inter.className }>
    <Theme
      //appearance="dark"
      radius="small">
      { children }
    </Theme>
    </body>
    </html>
  )
}
