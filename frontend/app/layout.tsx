import { Roboto } from "next/font/google";
import '@radix-ui/themes/styles.css';
import './global.css';
import { Providers } from "@/components/Providers";
import { getServerSession } from "next-auth";
import Nav from "@/navigation/Nav";

const inter = Roboto({ weight: ['400'], subsets: ['latin'] })

export default async function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  return (
    <html lang="en">
    <body className={ inter.className + ' theme-custom' }>
    <Providers>
      <Nav session={session}/>
      { children }
    </Providers>
    </body>
    </html>
  )
}
