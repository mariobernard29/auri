"use client"

import { useState } from "react"
import { createSubscription, deleteSubscription } from "@/app/actions"
import { PlusCircle, Trash2, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

const PREDEFINED = [
  { name: 'Adobe', logo: '/logos_subs/adobe.png', cat: 'Productividad' },
  { name: 'Amazon Prime', logo: '/logos_subs/amazon-prime.png', cat: 'Entretenimiento' },
  { name: 'Apple Music', logo: '/logos_subs/apple-music.png', cat: 'Música' },
  { name: 'Canva', logo: '/logos_subs/canva.png', cat: 'Productividad' },
  { name: 'Claude', logo: '/logos_subs/claude.png', cat: 'Productividad' },
  { name: 'Disney+', logo: '/logos_subs/disney.png', cat: 'Entretenimiento' },
  { name: 'Dropbox', logo: '/logos_subs/dropbox.png', cat: 'Productividad' },
  { name: 'Google One', logo: '/logos_subs/google-one.png', cat: 'Productividad' },
  { name: 'HBO Max', logo: '/logos_subs/hbomax.png', cat: 'Entretenimiento' },
  { name: 'iCloud', logo: '/logos_subs/icloud.png', cat: 'Productividad' },
  { name: 'Microsoft 365', logo: '/logos_subs/microsoft365.png', cat: 'Productividad' },
  { name: 'Netflix', logo: '/logos_subs/netflix.png', cat: 'Entretenimiento' },
  { name: 'OpenAI (ChatGPT)', logo: '/logos_subs/openai.png', cat: 'Productividad' },
  { name: 'Spotify', logo: '/logos_subs/spotify.png', cat: 'Música' },
  { name: 'YouTube Premium', logo: '/logos_subs/youtube_premium.png', cat: 'Entretenimiento' }
]

const EMOJI_CATEGORIES = [
  { name: 'Comida/Delivery', emoji: '🍔' },
  { name: 'Tecnología', emoji: '💻' },
  { name: 'Música', emoji: '🎵' },
  { name: 'Películas/TV', emoji: '🍿' },
  { name: 'Gimnasio/Salud', emoji: '🏋️' },
  { name: 'Educación', emoji: '📚' },
  { name: 'Videojuegos', emoji: '🎮' },
  { name: 'Hogar/Servicios', emoji: '🏠' },
]

export function SubscriptionsClient({ subscriptions, accounts }: { subscriptions: any[], accounts: any[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const [tab, setTab] = useState<'predef' | 'custom'>('predef')
  const [selectedSub, setSelectedSub] = useState<any>(null)
  
  const [customEmoji, setCustomEmoji] = useState('🍿')
  const [customName, setCustomName] = useState('')
  const [customCategory, setCustomCategory] = useState('Películas/TV')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Suscripciones 🔄</h1>
        <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? "outline" : "default"}>
          {isAdding ? "Cancelar" : <><PlusCircle className="mr-2 h-4 w-4" /> Agregar</>}
        </Button>
      </div>

      {isAdding && (
        <Card className="border-primary/50 shadow-md animate-in slide-in-from-top-4 fade-in duration-300">
          <CardHeader>
            <CardTitle>Nueva Suscripción</CardTitle>
            <div className="flex bg-muted p-1 rounded-xl mt-4 max-w-sm">
              <button onClick={() => setTab('predef')} className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${tab === 'predef' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Predefinidas</button>
              <button onClick={() => setTab('custom')} className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${tab === 'custom' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Personalizada</button>
            </div>
          </CardHeader>

          <CardContent>
            {tab === 'predef' ? (
              <form action={createSubscription} className="space-y-6">
                <input type="hidden" name="avatar" value={selectedSub?.logo || ''} />
                <input type="hidden" name="name" value={selectedSub?.name || ''} />
                <input type="hidden" name="category" value={selectedSub?.cat || ''} />
                
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto p-1">
                  {PREDEFINED.map(sub => (
                    <div 
                      key={sub.name} 
                      onClick={() => setSelectedSub(sub)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedSub?.name === sub.name ? 'border-primary bg-primary/5 shadow-sm' : 'border-transparent hover:bg-muted'}`}
                    >
                      <Image src={sub.logo} alt={sub.name} width={40} height={40} className="rounded-xl object-cover mb-2" />
                      <span className="text-[10px] text-center font-medium leading-tight">{sub.name}</span>
                    </div>
                  ))}
                </div>

                {selectedSub && (
                  <div className="flex flex-col gap-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Costo Mensual ($)</Label>
                        <Input name="price" type="number" step="0.01" min="0.01" required placeholder="Ej. 139.00" autoFocus />
                      </div>
                      <div className="space-y-2">
                        <Label>Día de cobro</Label>
                        <Select name="billingDay" defaultValue="1" required>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Día" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => (
                              <SelectItem key={i+1} value={(i+1).toString()}>{i+1}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Cuenta a debitar</Label>
                        <Select name="accountId" defaultValue={accounts[0]?.id} required>
                          <SelectTrigger className="bg-background">
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
                    <Button type="submit" className="w-full sm:w-auto self-end">Guardar Suscripción</Button>
                  </div>
                )}
              </form>
            ) : (
              <form action={createSubscription} className="space-y-4">
                <input type="hidden" name="avatar" value={customEmoji} />
                <input type="hidden" name="category" value={customCategory} />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categoría / Icono</Label>
                    <Select 
                      onValueChange={(val) => {
                        const sel = EMOJI_CATEGORIES.find(c => c.name === val)
                        if (sel) { setCustomEmoji(sel.emoji); setCustomCategory(sel.name) }
                      }}
                    >
                      <SelectTrigger>
                         <SelectValue placeholder="Selecciona categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {EMOJI_CATEGORIES.map(c => (
                          <SelectItem key={c.name} value={c.name}>{c.emoji} {c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Nombre de la Suscripción</Label>
                    <Input name="name" required placeholder="Ej. Club de Lectura" value={customName} onChange={(e) => setCustomName(e.target.value)} />
                  </div>
                  <div className="space-y-2 w-full sm:col-span-2">
                    <Label>Costo Mensual ($)</Label>
                    <Input name="price" type="number" step="0.01" min="0.01" required placeholder="Ej. 500.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Día de cobro</Label>
                    <Select name="billingDay" defaultValue="1" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Día" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => (
                          <SelectItem key={i+1} value={(i+1).toString()}>{i+1}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Cuenta a debitar</Label>
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
                <Button type="submit" className="w-full mt-2">Guardar Personalizada</Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions.length === 0 && !isAdding && (
          <div className="md:col-span-2 lg:col-span-3 text-center py-10 opacity-70">
            Aún no tienes suscripciones activas.
          </div>
        )}
        
        {subscriptions.map(sub => (
          <Card key={sub.id} className="relative group overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <form action={deleteSubscription}>
                <input type="hidden" name="id" value={sub.id} />
                <Button variant="ghost" size="icon" type="submit" className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </form>
            </div>
            
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-14 w-14 shrink-0 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center text-3xl bg-muted/50 border border-border/50">
                {sub.avatar.includes('/') ? (
                  <Image src={sub.avatar} alt="logo" width={56} height={56} className="object-cover" />
                ) : (
                  sub.avatar
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg leading-tight">{sub.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 capitalize flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {sub.category}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">${sub.price.toFixed(2)}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">/ mes</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
