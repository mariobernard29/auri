import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { message: "Por favor completa el correo y la contraseña" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Ya existe un usuario con ese correo" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name: name || email.split("@")[0],
        // The optional password field we added to prisma
        password: hashedPassword,
      },
    })
    
    // Create an initial default account
    await prisma.financialAccount.create({
      data: {
        name: 'Efectivo',
        type: 'cash',
        userId: user.id,
      }
    })

    return NextResponse.json(
      { message: "User registered successfully", user: { id: user.id, email: user.email } },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error Registration:", error)
    return NextResponse.json(
      { message: "Error interno del servidor. Inténtalo más tarde." },
      { status: 500 }
    )
  }
}
