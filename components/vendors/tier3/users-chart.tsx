"use client"

import { useEffect, useState } from "react"
import { format, subDays } from "date-fns"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartData,
  ChartOptions,
  TimeScale,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  TimeScale
)

interface DataPoint {
  date: string;
  users: number;
}

export function UsersChart() {
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    datasets: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [realtimeUsers, setRealtimeUsers] = useState<number | null>(null)

  // Fetch realtime users every minute
  useEffect(() => {
    const fetchRealtimeUsers = async () => {
      try {
        const response = await fetch('/api/analytics/active-users-realtime')
        if (!response.ok) {
          throw new Error('Failed to fetch realtime users')
        }
        const data = await response.json()
        setRealtimeUsers(data.activeUsers)
        console.log(data.activeUsers)
      } catch (error) {
        console.error('Error fetching realtime users:', error)
      }
    }

    // Initial fetch
    fetchRealtimeUsers()

    // Set up interval for periodic updates
    const interval = setInterval(fetchRealtimeUsers, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = subDays(new Date(), 120)
        const endDate = subDays(new Date(), 2)
        
        const response = await fetch(
          `/api/analytics/active-users?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        
        const data = await response.json()
        
        // Transform daily data
        const dailyData = data.map((item: { date: string; count: number }) => {
          const year = item.date.substring(0, 4)
          const month = item.date.substring(4, 6)
          const day = item.date.substring(6, 8)
          return {
            date: `${year}-${month}-${day}`,
            users: item.count
          }
        }).sort((a: DataPoint, b: DataPoint) => new Date(a.date).getTime() - new Date(b.date).getTime())

        // Calculate 7-day moving average
        const movingAverage = dailyData.map((point: DataPoint, index: number, array: DataPoint[]) => {
          const start = Math.max(0, index - 6)
          const count = Math.min(7, index - start + 1)
          const sum = array.slice(start, index + 1).reduce((sum: number, p: DataPoint) => sum + p.users, 0)
          return {
            date: point.date,
            users: Math.round(sum / count)
          }
        })

        setChartData({
          datasets: [
            {
              label: 'Daily Active Users',
              data: dailyData.map((d: DataPoint) => ({
                x: d.date,
                y: d.users
              })),
              borderColor: 'rgba(99, 102, 241, 0.3)',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              borderWidth: 1,
              pointRadius: 2,
              tension: 0.1,
              fill: false
            },
            {
              label: '7-Day Average',
              data: movingAverage.map((d: DataPoint) => ({
                x: d.date,
                y: d.users
              })),
              borderColor: 'rgb(99, 102, 241)',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.4,
              fill: true
            }
          ]
        })
      } catch (error) {
        console.error('Error fetching GA4 data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          pointStyleWidth: 10,
          pointStyle: "rect",
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgb(255, 255, 255)',
        titleColor: 'rgb(0, 0, 0)',
        bodyColor: 'rgb(0, 0, 0)',
        borderColor: 'rgb(229, 231, 235)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          title: (tooltipItems) => {
            return format(new Date(tooltipItems[0].parsed.x), 'MMM dd, yyyy')
          },
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y} users`
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
          displayFormats: {
            month: 'MMM yyyy'
          }
        },
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 4,
          font: {
            size: 12
          }
        }
      },
      y: {
        // beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Users</CardTitle>
        {realtimeUsers !== null && (
          <p className="text-sm font-medium text-primary mt-1 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            {realtimeUsers} users in the last 30 minutes
          </p>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            Loading...
          </div>
        ) : (
          <div className="h-[300px]">
            <Line data={chartData} options={options} />
          </div>
        )}
      </CardContent>

    </Card>
  )
}
