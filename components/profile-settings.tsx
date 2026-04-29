"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, User as UserIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { updateUserProfile } from "@/app/actions"
import Image from "next/image"

export function ProfileSettings({ user }: { user: any }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [preview, setPreview] = useState<string | null>(user?.image || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Basic validation for size (e.g. max 1MB for base64 to avoid overloading DB)
      if (file.size > 1024 * 1024) {
        alert("La imagen es muy grande. Por favor selecciona una imagen menor a 1MB.")
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSaving(true)
    if (preview) {
      formData.set('image', preview)
    }
    await updateUserProfile(formData)
    
    setIsSaving(false)
    router.refresh()
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Perfil de Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="flex flex-col items-center gap-4">
              <div 
                className="relative w-28 h-28 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                {preview ? (
                  <Image src={preview} alt="Profile" fill className="object-cover" />
                ) : (
                  <UserIcon className="w-12 h-12 text-muted-foreground" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                Cambiar foto
              </Button>
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" name="name" defaultValue={user?.name || ''} required placeholder="Tu nombre" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" name="email" type="email" defaultValue={user?.email || ''} required placeholder="tu@email.com" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
