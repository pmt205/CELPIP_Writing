interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
}

export default function StatsCard({ title, value, subtitle, icon }: StatsCardProps) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-celpip-accent hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        <div className="text-3xl" role="img" aria-label={title}>
          {icon}
        </div>
      </div>
    </article>
  );
}
