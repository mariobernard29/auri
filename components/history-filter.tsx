"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function HistoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPeriod = searchParams.get('period') || 'all'
  const currentDate = searchParams.get('date') || ''

  const handlePeriodChange = (newPeriod: string | null) => {
    if (!newPeriod) return;
    if (newPeriod === 'all') {
      router.push('/dashboard/history')
    } else {
      router.push(`/dashboard/history?period=${newPeriod}`)
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    if (newDate) {
      router.push(`/dashboard/history?date=${newDate}`)
    } else {
      router.push('/dashboard/history')
    }
  }

  const resetFilters = () => {
    router.push('/dashboard/history')
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end mb-6 p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
      
      <div className="flex-1 w-full space-y-2">
        <Label htmlFor="period">Agrupar por</Label>
        <Select 
          disabled={!!currentDate}
          value={currentDate ? 'specific' : currentPeriod}
          onValueChange={handlePeriodChange}
        >
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder="Periodo">
              {(currentDate ? 'specific' : currentPeriod) === 'all' ? 'Todo el tiempo' : (currentDate ? 'specific' : currentPeriod) === 'day' ? 'Hoy' : (currentDate ? 'specific' : currentPeriod) === 'week' ? 'Esta Semana' : (currentDate ? 'specific' : currentPeriod) === 'month' ? 'Este Mes' : (currentDate ? 'specific' : currentPeriod) === 'specific' ? 'Día Específico' : 'Periodo'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todo el tiempo</SelectItem>
            <SelectItem value="day">Hoy</SelectItem>
            <SelectItem value="week">Esta Semana</SelectItem>
            <SelectItem value="month">Este Mes</SelectItem>
            {currentDate && <SelectItem value="specific">Día Específico</SelectItem>}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 w-full space-y-2">
        <Label htmlFor="date">Día Específico (Opcional)</Label>
        <input 
          id="date"
          type="date" 
          value={currentDate}
          onChange={handleDateChange}
          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="w-full sm:w-auto">
        <Button 
          variant="outline" 
          onClick={resetFilters} 
          disabled={currentPeriod === 'all' && !currentDate}
          className="w-full h-10"
        >
          Limpiar
        </Button>
      </div>

    </div>
  )
}
