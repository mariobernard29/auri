"use client"

import { useState } from "react"
import { updateAccount, deleteAccount } from "@/app/actions"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet, CreditCard, Building, Edit2, X } from "lucide-react"

type Account = {
  id: string
  name: string
  type: string
  balance: number
}

const getIcon = (type: string) => {
  if (type === 'cash') return <Wallet className="h-6 w-6" />
  if (type === 'credit') return <CreditCard className="h-6 w-6" />
  return <Building className="h-6 w-6" />
}

export function EditAccountCard({ account }: { account: Account }) {
  const [isEditing, setIsEditing] = useState(false)
  const [type, setType] = useState(account.type)

  if (isEditing) {
    return (
      <Card className="shadow-md border-primary transition-all">
        <form action={(formData) => {
          updateAccount(formData)
          setIsEditing(false)
        }}>
          <input type="hidden" name="id" value={account.id} />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Editar Cuenta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`name-${account.id}`}>Nombre</Label>
              <Input id={`name-${account.id}`} name="name" defaultValue={account.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`type-${account.id}`}>Tipo</Label>
              <Select name="type" value={type} onValueChange={setType} required>
                <SelectTrigger className="w-full bg-background">
                   <SelectValue placeholder="Tipo de cuenta">
                     {type === 'cash' ? 'Efectivo' : type === 'bank' ? 'Banco' : type === 'credit' ? 'Crédito' : 'Tipo de cuenta'}
                   </SelectValue>
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="cash">Efectivo</SelectItem>
                   <SelectItem value="bank">Banco</SelectItem>
                   <SelectItem value="credit">Crédito</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`balance-${account.id}`}>Saldo Atual ($)</Label>
              <Input id={`balance-${account.id}`} name="balance" type="number" step="0.01" defaultValue={account.balance} required />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-2" /> Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:opacity-90">Guardar</Button>
            </div>
          </CardContent>
        </form>
        <form action={deleteAccount} className="px-6 pb-6 pt-0 mt-[-10px]">
           <input type="hidden" name="id" value={account.id} />
           <Button 
             type="submit" 
             variant="ghost" 
             className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
             onClick={(e) => {
               if(!confirm("¿Estás seguro de eliminar esta cuenta? Se borrarán todos los movimientos asociados.")) e.preventDefault();
             }}
           >
             <Trash2 className="w-4 h-4 mr-2" /> Eliminar Cuenta
           </Button>
        </form>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow group relative">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsEditing(true)}
        className="absolute top-2 right-12 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium pr-10 truncate">{account.name}</CardTitle>
        <div className="p-2 bg-primary/10 text-primary rounded-full shrink-0">
          {getIcon(account.type)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(account.balance)}</div>
        <p className="text-sm text-muted-foreground mt-1 capitalize">
          {account.type === 'cash' ? 'Efectivo' : account.type === 'credit' ? 'Crédito' : 'Banco'}
        </p>
      </CardContent>
    </Card>
  )
}
