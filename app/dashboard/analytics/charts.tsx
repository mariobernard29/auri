"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const EXPENSE_COLORS = ['#5B4BFF', '#22C55E', '#3B82F6', '#EF4444', '#7B8594', '#8B5CF6']
const INCOME_COLORS = ['#22C55E', '#5B4BFF', '#14B8A6', '#8B5CF6', '#3B82F6', '#0F111A']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover/95 backdrop-blur-sm border border-border p-4 rounded-xl shadow-xl">
        {label && <p className="font-semibold text-foreground mb-2 text-sm">{label}</p>}
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color || entry.payload.fill }} 
              />
              <span className="text-sm font-medium text-muted-foreground capitalize">
                {entry.name}:
              </span>
              <span className="text-sm font-bold text-foreground">
                ${Number(entry.value).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export function AnalyticsDashboard({ 
  expensePieData, 
  incomePieData, 
  timelineData 
}: { 
  expensePieData: any[], 
  incomePieData: any[], 
  timelineData: any[] 
}) {
  return (
    <div className="space-y-6">
      
      {/* Timeline Chart */}
      <Card className="shadow-md overflow-hidden">
        <CardHeader>
          <CardTitle>Balance General en el Tiempo</CardTitle>
        </CardHeader>
        <CardContent>
          {timelineData.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-muted-foreground">
              No hay datos para la línea del tiempo.
            </div>
          ) : (
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                    tickFormatter={(value) => `$${value}`}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="ingresos" 
                    name="Ingresos" 
                    stroke="#22C55E" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorIngresos)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="gastos" 
                    name="Gastos" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorGastos)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categorized Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Expenses Pie */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Gastos por Categoría 🎯</CardTitle>
          </CardHeader>
          <CardContent>
            {expensePieData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">Sin gastos registrados.</div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensePieData}
                      cx="50%"
                      cy="45%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {expensePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '14px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Incomes Pie */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Ingresos por Categoría 💰</CardTitle>
          </CardHeader>
          <CardContent>
            {incomePieData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">Sin ingresos registrados.</div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomePieData}
                      cx="50%"
                      cy="45%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {incomePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '14px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
