import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import { SubscriptionsClient } from "@/components/subscriptions-client"

export default async function SubscriptionsPage() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) return null

  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { account: true }
  })

  const accounts = await prisma.financialAccount.findMany({
    where: { userId }
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SubscriptionsClient subscriptions={subscriptions} accounts={accounts} />
    </div>
  )
}
