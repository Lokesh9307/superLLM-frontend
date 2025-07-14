'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { FaTrash, FaTextHeight, FaDownload } from 'react-icons/fa';
import Link from 'next/link';

const ReactGridLayout = dynamic(() => import('react-grid-layout'), { ssr: false });

type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'polarArea' | 'radar' | 'bubble' | 'scatter';

interface DashboardChart {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'chart';
  image: string;
  title: string;
  chartType: ChartType;
  timestamp: number;
}

interface DashboardTextBox {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'textBox';
  text: string;
  fontSize: string;
  fontFamily: string;
  timestamp: number;
}

type DashboardItem = DashboardChart | DashboardTextBox;

export default function Dashboard() {
  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([]);
  const [containerWidth, setContainerWidth] = useState(1200);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedItems = localStorage.getItem('dashboardItems');
    const savedCharts = localStorage.getItem('dashboardCharts');
    let items: DashboardItem[] = [];

    if (savedItems) {
      try {
        items = JSON.parse(savedItems);
      } catch (e) {
        console.error('Failed to parse dashboardItems:', e);
        localStorage.removeItem('dashboardItems');
      }
    }

    if (savedCharts) {
      try {
        const charts = JSON.parse(savedCharts);
        const chartItems: DashboardChart[] = charts.map((chart: any, index: number) => ({
          i: `chart-${chart.timestamp || Date.now()}-${index}`,
          x: (index * 4) % 50,
          y: Infinity,
          w: 15,
          h: 20,
          type: 'chart',
          image: chart.image,
          title: chart.title || 'Chart',
          chartType: chart.type || 'bar',
          timestamp: chart.timestamp || Date.now(),
        }));
        items = [...items, ...chartItems];
        localStorage.removeItem('dashboardCharts');
      } catch (e) {
        console.error('Failed to parse dashboardCharts:', e);
        localStorage.removeItem('dashboardCharts');
      }
    }

    setDashboardItems(items);
  }, []);

  useEffect(() => {
    if (!dashboardRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(dashboardRef.current);
    return () => {
      if (dashboardRef.current) observer.unobserve(dashboardRef.current);
    };
  }, []);

  const onLayoutChange = useCallback((layout: any[]) => {
    const updatedItems = dashboardItems.map(item => {
      const layoutItem = layout.find(l => l.i === item.i);
      return layoutItem ? { ...item, ...layoutItem } : item;
    });
    setDashboardItems(updatedItems);
    localStorage.setItem('dashboardItems', JSON.stringify(updatedItems));
  }, [dashboardItems]);

  const handleDeleteItem = (e: React.MouseEvent, itemIdToDelete: string) => {
    e.stopPropagation();
    const updated = dashboardItems.filter(item => item.i !== itemIdToDelete);
    setDashboardItems(updated);
    localStorage.setItem('dashboardItems', JSON.stringify(updated));
  };

  const addTextBox = () => {
    const newTextBox: DashboardTextBox = {
      i: `textbox-${Date.now()}`,
      x: (dashboardItems.length * 4) % 50,
      y: Infinity,
      w: 15,
      h: 5,
      type: 'textBox',
      text: '',
      fontSize: '1rem',
      fontFamily: 'Inter, sans-serif',
      timestamp: Date.now(),
    };
    const updatedItems = [...dashboardItems, newTextBox];
    setDashboardItems(updatedItems);
    localStorage.setItem('dashboardItems', JSON.stringify(updatedItems));
  };

  const handleTextBoxChange = (itemId: string, newText: string) => {
    setDashboardItems(prevItems => {
      const updated = prevItems.map(item =>
        item.i === itemId && item.type === 'textBox' ? { ...item, text: newText } : item
      );
      localStorage.setItem('dashboardItems', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSaveImage = (imageUrl: string, title: string) => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title || 'chart'}.png`;
    link.click();
  };

  return (
    <div ref={dashboardRef} className="relative min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] font-inter text-white">
      <nav className="flex md:flex-row flex-col justify-between items-center px-6 py-4 bg-[#121212] border-b border-white/10 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-bold text-cyan-400">AI Dashboard 📊</h1>
        <div className="flex items-center gap-3 mt-2 md:mt-0">
          <button
            onClick={addTextBox}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-700 hover:bg-blue-500 text-white rounded-xl shadow-md transition-all duration-300"
          >
            <FaTextHeight /> Add Text
          </button>
          <Link
            href='/analysis-ai'
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-700 hover:bg-emerald-500 text-white rounded-xl shadow-md transition-all duration-300"
          >
            More Charts
          </Link>
        </div>
      </nav>

      <main className="p-6">
        {dashboardItems.length === 0 ? (
          <div className="text-center text-gray-500 text-xl mt-16">No items yet. Add charts or text to get started!</div>
        ) : (
          <ReactGridLayout
            className="layout"
            layout={dashboardItems.map(({ i, x, y, w, h }) => ({ i, x, y, w, h }))}
            cols={50}
            rowHeight={10}
            autoSize={true}
            width={containerWidth}
            onLayoutChange={onLayoutChange}
            isDroppable={false}
            compactType="vertical"
            preventCollision={false}
          >
            {dashboardItems.map((item) => (
              <div
                key={item.i}
                className="relative bg-[#1e1e1e] rounded-2xl shadow-xl overflow-hidden group border border-white/10 hover:border-cyan-400 transition-all"
              >
                <button
                  onClick={(e) => handleDeleteItem(e, item.i)}
                  className="absolute top-2 right-2 p-1 bg-red-600 rounded-full shadow-md text-white opacity-0 group-hover:opacity-100 transition"
                >
                  <FaTrash size={14} />
                </button>

                {item.type === 'chart' && item.image && (
                  <button
                    onClick={() => handleSaveImage(item.image, item.title)}
                    className="absolute top-12 right-2 p-1 bg-green-600 rounded-full shadow-md text-white opacity-0 group-hover:opacity-100 transition"
                  >
                    <FaDownload size={14} />
                  </button>
                )}

                <div className="flex-grow flex items-center justify-center p-4">
                  {item.type === 'chart' ? (
                    item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="max-w-full max-h-full rounded-md object-contain"
                      />
                    ) : (
                      <div className="text-gray-400">No chart image available</div>
                    )
                  ) : (
                    <input
                      type="text"
                      value={item.text}
                      placeholder="Type your note..."
                      onChange={(e) => handleTextBoxChange(item.i, e.target.value)}
                      style={{ fontSize: item.fontSize, fontFamily: item.fontFamily }}
                      className="w-full h-full px-3 py-2 bg-[#1e1e1e] text-white placeholder-gray-500 rounded-md focus:outline-none"
                    />
                  )}
                </div>
              </div>
            ))}
          </ReactGridLayout>
        )}
      </main>
    </div>
  );
}
