import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
  hover?: boolean
  glass?: boolean
}

export function Card({ className, children, hover, glass }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-100 bg-white shadow-sm',
        hover && 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
        glass && 'bg-white/80 backdrop-blur-sm',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('px-6 py-4 border-b border-slate-100', className)}>
      {children}
    </div>
  )
}

export function CardBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  )
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  color = 'violet',
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ReactNode
  color?: 'violet' | 'emerald' | 'blue' | 'amber' | 'rose'
}) {
  const colors = {
    violet: 'from-violet-500 to-indigo-500',
    emerald: 'from-emerald-500 to-teal-500',
    blue: 'from-blue-500 to-cyan-500',
    amber: 'from-amber-500 to-orange-500',
    rose: 'from-rose-500 to-pink-500',
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn('w-12 h-12 rounded-xl bg-linear-to-br flex items-center justify-center text-white shadow-md', colors[color])}>
            {icon}
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-sm font-medium text-slate-600 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
      </div>
    </Card>
  )
}
