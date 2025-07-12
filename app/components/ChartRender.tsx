'use client';

import { useRef, useEffect } from 'react';
import { Chart, ChartType, ChartItem } from 'chart.js/auto';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IoAddCircle } from 'react-icons/io5';
import { FaDownload } from 'react-icons/fa'; // <-- Add this import

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

  const saveImageLocally = async () => {
    if (!canvasRef.current) return;
    try {
      const canvas = await html2canvas(canvasRef.current);
      const dataUrl = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'analysis-chart.png';
      link.click();
    } catch (error) {
      console.error('Failed to save chart image:', error);
    }
  };

  return (
    <div className="relative h-[500px] w-full bg-white rounded-md p-2 shadow-lg mt-5">
      <canvas ref={canvasRef} className="w-full h-full p-2 mt-20" />

      <div className='flex justify-between items-center absolute top-0.5 left-1 right-3'>
        {/* Go to Dashboard */}
        <Link
          href='/dashboard'
          className='md:mt-4 mt-2 md:px-4 px-2 md:py-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 absolute md:top-[-60px] top-[-38px] right-1 md:text-xs text-[0.8rem] ring-white/60 hover:ring-white ring-2'
        >
          Go to Dashboard
        </Link>

        {/* Add to Dashboard */}
        <button
          onClick={addToDashboard}
          className="md:mt-4 mt-2 md:px-4 px-2 md:py-2 py-1 bg-black text-white ring-2 ring-white/60 hover:ring-white duration-300 transform-fill ease-in-out rounded-md absolute md:top-[-60px] top-[-38px] right-[140px] md:text-xs text-[0.8rem] cursor-pointer flex items-center gap-1"
        >
          <IoAddCircle className='text-lg' />
          Add to Dashboard
        </button>
      </div>

      {/* Save Image Button */}
      <button
        onClick={saveImageLocally}
        className="md:mt-4 mt-2 md:px-4 px-2 md:py-2 py-1 bg-green-600/20 text-black ring-2 ring-green-800/60 hover:ring-green-900 duration-300 transform-fill ease-in-out rounded-md absolute md:top-[-10px] md:right-[10px] right-1 top-0.5 md:text-xs text-[0.8rem] cursor-pointer flex items-center gap-1"
        title="Save Image "
      >
        <FaDownload className="text-sm" />
      </button>
    </div>
  );
}
