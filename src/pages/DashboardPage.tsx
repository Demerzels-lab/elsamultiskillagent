import { useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import * as echarts from 'echarts'
import { useSkills } from '../hooks/useSkills'
import { LoadingSpinner } from '../components/Loading'
import { BarChart3, PieChart, TrendingUp } from 'lucide-react'

function EChart({ option, height = 400 }: { option: any; height?: number }) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    chartInstance.current = echarts.init(chartRef.current)
    chartInstance.current.setOption(option)

    const handleResize = () => {
      chartInstance.current?.resize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chartInstance.current?.dispose()
    }
  }, [option])

  return <div ref={chartRef} style={{ height }} />
}

export function DashboardPage() {
  const { skills, categories, loading } = useSkills()

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => b.count - a.count),
    [categories]
  )

  const top10Categories = sortedCategories.slice(0, 10)

  // Bar Chart Option
  const barChartOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#121212',
        borderColor: '#262626',
        textStyle: { color: '#fff' },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: top10Categories.map(c => c.name.length > 15 ? c.name.slice(0, 15) + '...' : c.name),
        axisLabel: {
          color: '#a0a0a0',
          rotate: 45,
          fontSize: 10,
        },
        axisLine: { lineStyle: { color: '#262626' } },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#a0a0a0' },
        axisLine: { lineStyle: { color: '#262626' } },
        splitLine: { lineStyle: { color: '#262626' } },
      },
      series: [
        {
          data: top10Categories.map((c, i) => ({
            value: c.count,
            itemStyle: {
              color: i === 0 ? '#39ff14' : i < 3 ? '#22c55e' : '#15803d',
            },
          })),
          type: 'bar',
          barWidth: '60%',
        },
      ],
    }),
    [top10Categories]
  )

  // Treemap Option
  const treemapOption = useMemo(
    () => ({
      tooltip: {
        formatter: (params: any) => `${params.name}: ${params.value} skills`,
        backgroundColor: '#121212',
        borderColor: '#262626',
        textStyle: { color: '#fff' },
      },
      series: [
        {
          type: 'treemap',
          data: sortedCategories.map((c, i) => ({
            name: c.name,
            value: c.count,
            itemStyle: {
              color: i === 0 ? '#39ff14' : i < 5 ? '#22c55e' : i < 10 ? '#15803d' : '#166534',
            },
          })),
          label: {
            show: true,
            formatter: '{b}',
            fontSize: 11,
            color: '#fff',
          },
          breadcrumb: { show: false },
          levels: [
            {
              itemStyle: {
                borderColor: '#0a0a0a',
                borderWidth: 2,
                gapWidth: 2,
              },
            },
          ],
        },
      ],
    }),
    [sortedCategories]
  )

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Ecosystem Overview</h1>
          <p className="text-text-secondary">
            Visual breakdown of {skills.length.toLocaleString()} skills across{' '}
            {categories.length} categories
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-brand" />
              </div>
              <div>
                <p className="text-2xl font-bold">{skills.length.toLocaleString()}</p>
                <p className="text-text-secondary text-sm">Total Skills</p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center">
                <PieChart className="w-6 h-6 text-brand" />
              </div>
              <div>
                <p className="text-2xl font-bold">{categories.length}</p>
                <p className="text-text-secondary text-sm">Categories</p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-brand" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(skills.length / categories.length)}
                </p>
                <p className="text-text-secondary text-sm">Avg Skills/Category</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Bar Chart */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Top 10 Categories</h3>
            <EChart option={barChartOption} height={400} />
          </div>

          {/* Treemap */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
            <EChart option={treemapOption} height={400} />
          </div>
        </div>

        {/* All Categories List */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-6">All Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sortedCategories.map((category, index) => (
              <Link
                key={category.slug}
                to={`/browse?category=${encodeURIComponent(category.name)}`}
                className="flex items-center justify-between p-3 bg-surface-hover rounded-lg hover:bg-brand/10 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                      index < 3
                        ? 'bg-brand text-black'
                        : 'bg-border-subtle text-text-secondary'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm group-hover:text-brand transition-colors truncate">
                    {category.name}
                  </span>
                </div>
                <span className="text-text-tertiary text-sm">{category.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
