"use client"

import { useState } from "react"
import { updateTransaction, deleteTransaction } from "@/app/actions"
import { ArrowDownIcon, ArrowUpIcon, Edit2, Trash2, X, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function TransactionItem({ t }: { t: any }) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 p-4 bg-muted/30 border-b last:border-0 border-border/50 animate-in fade-in duration-200">
        <form 
          action={(formData) => {
            updateTransaction(formData)
            setIsEditing(false)
          }} 
          className="flex flex-col gap-3"
        >
          <input type="hidden" name="id" value={t.id} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input name="description" defaultValue={t.description} placeholder="Descripción" required className="h-9" />
            <Input name="amount" type="number" step="0.01" min="0.01" defaultValue={t.amount} required className="h-9" />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              <X className="w-4 h-4 mr-1" /> Cancelar
            </Button>
            <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Check className="w-4 h-4 mr-1" /> Guardar
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="group flex items-center justify-between p-4 transition-colors hover:bg-muted/50 border-b last:border-0 border-border/50">
      <div className="flex items-center gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full overflow-hidden ${!t.subscription ? (t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500') : 'bg-muted border border-border/50 text-xl'}`}>
          {t.subscription ? (
            t.subscription.avatar.includes('/') ? (
              <Image src={t.subscription.avatar} alt="logo" width={40} height={40} className="object-cover" />
            ) : (
              t.subscription.avatar
            )
          ) : (
            t.type === 'income' ? <ArrowUpIcon className="h-5 w-5" /> : <ArrowDownIcon className="h-5 w-5" />
          )}
        </div>
        <div>
          <p className="font-medium leading-none text-foreground">{t.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium tracking-wide">
              {t.category?.name || 'Sin categoría'}
            </span>
            <p className="text-[11px] text-muted-foreground font-medium">{new Date(t.date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className={`font-medium ${t.type === 'income' ? 'text-emerald-500' : 'text-foreground'}`}>
            {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
          </div>
          <p className="text-[10px] text-muted-foreground capitalize mt-0.5">{t.account?.name}</p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <form action={deleteTransaction}>
            <input type="hidden" name="id" value={t.id} />
            <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50">
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
