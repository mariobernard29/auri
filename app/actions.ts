"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addTransaction(formData: FormData) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("No autenticado")
  }

  const type = formData.get("type") as string
  const amount = parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string
  const date = new Date(formData.get("date") as string)
  const accountId = formData.get("accountId") as string
  let categoryId = formData.get("categoryId") as string
  const subscriptionId = formData.get("subscriptionId") as string | null

  if (!categoryId) {
    const existingCategories = await prisma.category.findMany({ where: { userId } })
    if (existingCategories.length === 0) {
      const defaultCategories = [
        { name: "Comida", type: "expense", userId },
        { name: "Transporte", type: "expense", userId },
        { name: "Entretenimiento", type: "expense", userId },
        { name: "Servicios", type: "expense", userId },
        { name: "Salario", type: "income", userId },
      ]
      await prisma.category.createMany({ data: defaultCategories })
      const newCats = await prisma.category.findMany({ where: { userId, type } })
      categoryId = newCats[0]?.id
    } else {
      categoryId = existingCategories[0].id
    }
  }

  await prisma.transaction.create({
    data: {
      type,
      amount,
      description,
      date,
      accountId,
      categoryId,
      subscriptionId: subscriptionId || null,
      userId
    }
  })

  const account = await prisma.financialAccount.findUnique({ where: { id: accountId } })
  if (account) {
    const newBalance = type === 'income' 
      ? account.balance + amount 
      : account.balance - amount
      
    await prisma.financialAccount.update({
      where: { id: accountId },
      data: { balance: newBalance }
    })
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function createAccount(formData: FormData) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) throw new Error("No autenticado")

  const name = formData.get("name") as string
  const type = formData.get("type") as string
  const balance = parseFloat(formData.get("balance") as string || "0")

  await prisma.financialAccount.create({
    data: { name, type, balance, userId }
  })
  
  revalidatePath("/dashboard/accounts")
  revalidatePath("/dashboard/add")
  redirect("/dashboard/accounts")
}

export async function createCategory(formData: FormData) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) throw new Error("No autenticado")

  const name = formData.get("name") as string
  const type = formData.get("type") as string

  await prisma.category.create({
    data: { name, type, userId }
  })
  
  revalidatePath("/dashboard/settings")
  revalidatePath("/dashboard/add")
  redirect("/dashboard/settings")
}

export async function updateCategory(formData: FormData) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) throw new Error("No autenticado")

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  
  await prisma.category.update({
    where: { id, userId },
    data: { name }
  })
  
  revalidatePath("/dashboard/settings")
  revalidatePath("/dashboard/add")
  redirect("/dashboard/settings")
}

export async function deleteCategory(formData: FormData) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) throw new Error("No autenticado")

  const id = formData.get("id") as string
  
  await prisma.category.delete({
    where: { id, userId }
  })
  
  revalidatePath("/dashboard/settings")
  revalidatePath("/dashboard/add")
  redirect("/dashboard/settings")
}

export async function updateAccount(formData: FormData) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) throw new Error("No autenticado")

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const type = formData.get("type") as string
  const balanceStr = formData.get("balance")
  
  const data: any = { name, type }
  if (balanceStr) {
    data.balance = parseFloat(balanceStr as string)
  }

  await prisma.financialAccount.update({
    where: { id, userId },
    data
  })
  
  revalidatePath("/dashboard/accounts")
  revalidatePath("/dashboard")
}

export async function deleteAccount(formData: FormData) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) throw new Error("No autenticado")

  const id = formData.get("id") as string

  // We delete related records using a transaction to maintain integrity
  await prisma.$transaction([
    prisma.transaction.deleteMany({ where: { accountId: id } }),
    prisma.subscription.deleteMany({ where: { accountId: id } }),
    prisma.financialAccount.delete({ where: { id, userId } })
  ])

  revalidatePath("/dashboard/accounts")
  revalidatePath("/dashboard")
}

export async function deleteTransaction(formData: FormData) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) throw new Error("No autenticado")

  const id = formData.get("id") as string
  
  const transaction = await prisma.transaction.findUnique({
    where: { id, userId },
    include: { account: true }
  })
  
  if (!transaction) throw new Error("No encontrado")

  // Reverse balance
  const account = transaction.account
  const newBalance = transaction.type === 'expense' 
    ? account.balance + transaction.amount 
    : account.balance - transaction.amount

  await prisma.financialAccount.update({
    where: { id: account.id },
    data: { balance: newBalance }
  })

  await prisma.transaction.delete({ where: { id } })
  revalidatePath("/dashboard")
}

export async function updateTransaction(formData: FormData) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) throw new Error("No autenticado")

  const id = formData.get("id") as string
  const description = formData.get("description") as string
  const newAmount = parseFloat(formData.get("amount") as string)
  
  const oldTx = await prisma.transaction.findUnique({
    where: { id, userId },
    include: { account: true }
  })

  if (!oldTx) throw new Error("No encontrado")

  const diff = newAmount - oldTx.amount

  // If amount changed, update account balance
  if (diff !== 0) {
    const isExpense = oldTx.type === 'expense'
    // If it was an expense and amount grew (+diff), we need to subtract from balance (-diff)
    // If it was an income and amount grew (+diff), we need to add to balance (+diff)
    const factor = isExpense ? -1 : 1
    const newBalance = oldTx.account.balance + (diff * factor)

    await prisma.financialAccount.update({
      where: { id: oldTx.accountId },
      data: { balance: newBalance }
    })
  }

  await prisma.transaction.update({
    where: { id },
    data: { description, amount: newAmount }
  })

  revalidatePath("/dashboard")
}

export async function processTransfer(formData: FormData) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) throw new Error("No autenticado")

  const sourceId = formData.get("sourceId") as string
  const targetId = formData.get("targetId") as string
  const amount = parseFloat(formData.get("amount") as string)
  
  if (sourceId === targetId) throw new Error("Cuentas deben ser distintas")

  const source = await prisma.financialAccount.findUnique({ where: { id: sourceId, userId } })
  const target = await prisma.financialAccount.findUnique({ where: { id: targetId, userId } })

  if (!source || !target) throw new Error("Cuentas no encontradas")

  // Update Balances
  await prisma.financialAccount.update({
    where: { id: sourceId },
    data: { balance: source.balance - amount }
  })
  
  await prisma.financialAccount.update({
    where: { id: targetId },
    data: { balance: target.balance + amount }
  })

  // Find or create "Transferencia" category for this user
  let transferCategory = await prisma.category.findFirst({
    where: { userId, name: "Transferencias" }
  })
  
  if (!transferCategory) {
    transferCategory = await prisma.category.create({
      data: { name: "Transferencias", type: "expense", userId }
    })
  }

  // Create logging transactions
  await prisma.transaction.create({
    data: {
      type: "expense",
      amount,
      description: `Transferencia hacia ${target.name}`,
      date: new Date(),
      accountId: sourceId,
      categoryId: transferCategory.id,
      userId
    }
  })

  await prisma.transaction.create({
    data: {
      type: "income",
      amount,
      description: `Transferencia desde ${source.name}`,
      date: new Date(),
      accountId: targetId,
      categoryId: transferCategory.id,
      userId
    }
  })

  revalidatePath("/dashboard")
  redirect("/dashboard/accounts")
}

export async function createSubscription(formData: FormData) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) throw new Error("No autenticado")

  const name = formData.get("name") as string
  const price = parseFloat(formData.get("price") as string)
  const category = formData.get("category") as string
  const avatar = formData.get("avatar") as string
  const accountId = formData.get("accountId") as string
  const billingDay = parseInt(formData.get("billingDay") as string, 10)

  // 1. Encontrar o crear la categoría para la suscripción
  let subCategory = await prisma.category.findFirst({
    where: { userId, name: category }
  })
  
  if (!subCategory) {
    subCategory = await prisma.category.create({
      data: { name: category, type: "expense", userId }
    })
  }

  // 2. Crear la Suscripción en BD
  const sub = await prisma.subscription.create({
    data: { name, price, category, avatar, accountId, billingDay, userId }
  })

  // 3. Procesar el pago inicial si el día ya pasó o es hoy (Lógica de Auto-Cobro inicial)
  const today = new Date()
  const currentDay = today.getDate()
  
  if (currentDay >= billingDay) {
    const paymentDate = new Date(today.getFullYear(), today.getMonth(), billingDay)
    
    await prisma.transaction.create({
      data: {
        type: "expense",
        amount: price,
        description: `Pago de Suscripción: ${name}`,
        date: paymentDate,
        accountId: accountId,
        categoryId: subCategory.id,
        subscriptionId: sub.id,
        userId
      }
    })

    const account = await prisma.financialAccount.findUnique({ where: { id: accountId } })
    if (account) {
      await prisma.financialAccount.update({
        where: { id: accountId },
        data: { balance: account.balance - price }
      })
    }
  }
  
  revalidatePath("/dashboard/subscriptions")
  revalidatePath("/dashboard/add")
  redirect("/dashboard/subscriptions")
}

export async function deleteSubscription(formData: FormData) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) throw new Error("No autenticado")

  const id = formData.get("id") as string

  await prisma.subscription.delete({
    where: { id, userId }
  })
  
  revalidatePath("/dashboard/subscriptions")
  revalidatePath("/dashboard/add")
  redirect("/dashboard/subscriptions")
}

