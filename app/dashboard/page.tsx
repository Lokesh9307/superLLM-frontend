'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { FaTrash, FaTextHeight } from 'react-icons/fa';
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

    return (
        <div ref={dashboardRef} className="relative min-h-screen bg-black font-inter text-white">
            <nav className="flex justify-between items-center p-4 bg-black shadow-lg">
                <h1 className="text-3xl font-bold text-teal-400">Dashboard 📊</h1>
                <div className='flex items-center space-x-4'>
                    <button
                        onClick={addTextBox}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                    >
                        <FaTextHeight className="mr-2" /> Text Box
                    </button>
                    <Link href='/analysis-ai' className="flex items-center px-4 py-2 bg-green-600 text-white rounded-full shadow-md hover:bg-green-400 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">More Chart</Link>
                </div>
            </nav>

            <div className="p-4">
                {dashboardItems.length === 0 && (
                    <div className="text-center text-gray-400 text-xl mt-20">
                        No items added yet. Add charts from the analysis page or create a text box!
                    </div>
                )}

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
                            className="relative bg-black rounded-lg shadow-md overflow-hidden flex flex-col group border border-transparent hover:border-white hover:ring-2 hover:ring-white hover:ring-opacity-40"
                        >
                            <button
                                onClick={(e) => handleDeleteItem(e, item.i)}
                                className="absolute top-1 right-1 z-10 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition duration-200"
                                title="Delete"
                            >
                                <FaTrash size={16} />
                            </button>

                            <div className=" flex-grow flex items-center justify-center overflow-hidden p-2">
                                {item.type === 'chart' ? (
                                    item.image ? (
                                        <div className='bg-white rounded-lg shadow-lg p-2 w-full h-full flex items-center justify-center'>
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-gray-500 text-center p-4">No chart image available</div>
                                    )
                                ) : (
                                    <input
                                        type="text"
                                        value={item.text}
                                        placeholder="Type your text here..."
                                        onChange={(e) => handleTextBoxChange(item.i, e.target.value)}
                                        style={{
                                            fontSize: item.fontSize,
                                            fontFamily: item.fontFamily,
                                        }}
                                        className="w-full h-full p-2 bg-black text-white resize-none focus:outline-none rounded-b-lg overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent"
                                    />


                                )}
                            </div>
                        </div>
                    ))}
                </ReactGridLayout>
            </div>
        </div>
    );
}
