import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, Wallet } from "lucide-react"
import { TransactionItem } from "@/components/transaction-item"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) return null

  const accounts = await prisma.financialAccount.findMany({
    where: { userId }
  })
  
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true, subscription: true, account: true },
    orderBy: { date: 'desc' },
    take: 5
  })

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0)
  
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const monthlyTransactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: new Date(currentYear, currentMonth, 1),
        lt: new Date(currentYear, currentMonth + 1, 1)
      }
    }
  })
  
  const ingresos = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0)
    
  const gastos = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Resumen 📊</h1>
        <p className="text-muted-foreground">Hola <span className="font-semibold text-foreground">{session?.user?.name || "Usuario"}</span> 👋, aquí está tu estado financiero.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary text-primary-foreground border-transparent shadow-lg rounded-2xl overflow-hidden relative">
          <div className="absolute opacity-10 bg-gradient-to-r from-transparent to-white w-full h-full transform skew-x-12" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-white/90">Balance Total</CardTitle>
            <Wallet className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold tracking-tight">${totalBalance.toFixed(2)}</div>
            <p className="text-xs text-white/70 mt-2 font-medium">
              Distribuido en {accounts.length} {accounts.length === 1 ? 'cuenta' : 'cuentas'}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos (Mes)</CardTitle>
            <div className="p-1.5 bg-emerald-500/10 rounded-full">
               <ArrowUpIcon className="h-3 w-3 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${ingresos.toFixed(2)}</div>
            <p className="text-xs text-emerald-500 font-medium mt-1">+ Positivo</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gastos (Mes)</CardTitle>
            <div className="p-1.5 bg-destructive/10 rounded-full">
               <ArrowDownIcon className="h-3 w-3 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${gastos.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">Controla tus gastos</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Últimos Movimientos 📝</h2>
        <Card className="shadow-sm overflow-hidden border-border/50">
          <CardContent className="p-0">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No hay movimientos aún.
              </div>
            ) : (
              <div className="divide-y">
                {transactions.map((t) => (
                  <TransactionItem key={t.id} t={t} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
