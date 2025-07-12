'use client';

import { useRef, useEffect } from 'react';
import { Chart, ChartType, ChartItem } from 'chart.js/auto';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/navigation';

interface ChartData {
  label: string;
  value: number;
}

interface ChartRendererProps {
  data: ChartData[];
  type: ChartType;
}

export default function ChartRenderer({ data, type }: ChartRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;
    const labels = data.map((r) => r.label);
    const values = data.map((r) => r.value);

    const aquaBackground = 'rgba(0, 255, 255, 0.4)';
    const aquaBorder = 'rgba(0, 255, 255, 0.9)';

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const newChart = new Chart(ctx as unknown as ChartItem, {
      type,
      data: {
        labels,
        datasets: [
          {
            label: 'Analysis',
            data: values,
            backgroundColor: aquaBackground,
            borderColor: aquaBorder,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
        },
      },
    });

    chartRef.current = newChart;

    return () => {
      newChart.destroy();
    };
  }, [data, type]);

  const addToDashboard = async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = await html2canvas(canvasRef.current);
      const dataUrl = canvas.toDataURL('image/png');

      const dashboardItems = JSON.parse(localStorage.getItem('dashboardItems') || '[]');

      const newChartItem = {
        i: `chart-${Date.now()}`,
        x: (dashboardItems.length * 4) % 50,
        y: Infinity,
        w: 15,
        h: 20,
        type: 'chart',
        image: dataUrl,
        title: 'Generated Analysis Chart',
        chartType: type,
        timestamp: Date.now(),
      };

      dashboardItems.push(newChartItem);
      localStorage.setItem('dashboardItems', JSON.stringify(dashboardItems));

      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to save chart to dashboard:', error);
    }
  };

  return (
    <div className="relative h-[500px] w-full bg-white rounded-md p-2 shadow-lg">
      <canvas ref={canvasRef} className="w-full h-full p-2" />
      <button
        onClick={addToDashboard}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 absolute top-[-60px] right-1"
      >
        Add to Dashboard
      </button>
    </div>
  );
}
