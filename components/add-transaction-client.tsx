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
  
  const [type, setType] = useState('expense')
  const [accountId, setAccountId] = useState<string>(accounts[0]?.id || '')
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || '')
  const [subscriptionId, setSubscriptionId] = useState<string>('none')
  
  const [sourceId, setSourceId] = useState<string>(accounts[0]?.id || '')
  const [targetId, setTargetId] = useState<string>(accounts.length > 1 ? accounts[1]?.id : accounts[0]?.id || '')
  
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
              <Select name="type" value={type} onValueChange={(value) => value && setType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo">
                    {type === 'income' ? 'Ingreso' : 'Gasto'}
                  </SelectValue>
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
              <Select name="accountId" value={accountId} onValueChange={(value) => value && setAccountId(value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona cuenta">
                    {accounts.find(a => a.id === accountId)?.name || "Selecciona cuenta"}
                  </SelectValue>
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
              <Select name="categoryId" value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona categoría">
                    {categories.find(c => c.id === categoryId)?.name || "Selecciona categoría"}
                  </SelectValue>
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
              <Select name="subscriptionId" value={subscriptionId} onValueChange={setSubscriptionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Ninguna">
                    {subscriptionId === 'none' || !subscriptionId ? 'Ninguna' : subscriptions?.find(s => s.id === subscriptionId)?.name || "Ninguna"}
                  </SelectValue>
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
              <Select name="sourceId" value={sourceId} onValueChange={setSourceId} required>
                <SelectTrigger className="bg-rose-500/10 text-rose-600 font-medium">
                  <SelectValue placeholder="Cuenta origen">
                    {accounts.find(a => a.id === sourceId)?.name || "Cuenta origen"}
                  </SelectValue>
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
              <Select name="targetId" value={targetId} onValueChange={setTargetId} required>
                <SelectTrigger className="bg-emerald-500/10 text-emerald-600 font-medium">
                  <SelectValue placeholder="Cuenta destino">
                    {accounts.find(a => a.id === targetId)?.name || "Cuenta destino"}
                  </SelectValue>
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
