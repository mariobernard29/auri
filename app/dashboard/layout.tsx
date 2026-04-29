import { Navigation } from "@/components/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { prisma } from "@/lib/prisma"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, image: true }
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation user={user} />
      <main className="md:pl-64 pb-20 md:pb-0 min-h-screen">
        <div className="mx-auto max-w-5xl p-4 md:p-8">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </main>
    </div>
  )
}
