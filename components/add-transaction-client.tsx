"use client"

import { useState } from "react"
import { addTransaction, processTransfer } from "@/app/actions"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Account = { id: string; name: string }
type Category = { id: string; name: string }

export function AddTransactionClient({ accounts, categories, subscriptions = [] }: { accounts: Account[], categories: Category[], subscriptions?: any[] }) {
  const [tab, setTab] = useState<'movement' | 'transfer'>('movement')
  
  if (accounts.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">Debes crear al menos una cuenta primero.</div>
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex bg-muted p-1 rounded-xl">
        <button 
          onClick={() => setTab('movement')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${tab === 'movement' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Movimiento Standard
        </button>
        <button 
          onClick={() => setTab('transfer')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${tab === 'transfer' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Transferencia Entrecuentas
        </button>
      </div>

      {tab === 'movement' && (
        <form action={addTransaction} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select name="type" defaultValue="expense">
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Gasto</SelectItem>
                  <SelectItem value="income">Ingreso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Monto</Label>
              <Input id="amount" name="amount" type="number" step="0.01" min="0.01" required placeholder="0.00" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input id="description" name="description" required placeholder="Ej. Compra de supermercado" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountId">Cuenta</Label>
              <Select name="accountId" defaultValue={accounts[0]?.id} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona cuenta" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(a => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoría</Label>
              <Select name="categoryId" defaultValue={categories[0]?.id} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subscriptionId">Suscripción (Opcional)</Label>
              <Select name="subscriptionId" defaultValue="">
                <SelectTrigger>
                  <SelectValue placeholder="Ninguna" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Ninguna</SelectItem>
                  {subscriptions.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full mt-6 h-12 text-md">Guardar Movimiento</Button>
        </form>
      )}

      {tab === 'transfer' && (
        <form action={processTransfer} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          <div className="space-y-2">
            <Label htmlFor="amount">Monto a Transferir</Label>
            <Input id="amount" name="amount" type="number" step="0.01" min="0.01" required placeholder="0.00" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sourceId">Cuenta Origen (Se resta) 📤</Label>
              <Select name="sourceId" defaultValue={accounts[0]?.id} required>
                <SelectTrigger className="bg-rose-500/10 text-rose-600 font-medium">
                  <SelectValue placeholder="Cuenta origen" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(a => (
                    <SelectItem key={a.id} value={a.id} className="text-foreground">{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetId">Cuenta Destino (Se abona) 📥</Label>
              <Select name="targetId" defaultValue={accounts.length > 1 ? accounts[1]?.id : accounts[0]?.id} required>
                <SelectTrigger className="bg-emerald-500/10 text-emerald-600 font-medium">
                  <SelectValue placeholder="Cuenta destino" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(a => (
                    <SelectItem key={a.id} value={a.id} className="text-foreground">{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full mt-6 h-12 text-md">Procesar Transferencia</Button>
        </form>
      )}
    </div>
  )
}
