'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import ChartRenderer from '../components/ChartRender';
import { ChartType } from 'chart.js';
import { FaUpload } from 'react-icons/fa';
import {Spinner} from "@heroui/spinner";

interface ChartData {
  data: { label: string; value: number }[];
  chartType: ChartType;
}

export default function AnalysisAI() {
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState('');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);

  // Restore all state from sessionStorage
  useEffect(() => {
    const storedQuery = sessionStorage.getItem('query');
    const storedChartType = sessionStorage.getItem('chartType');
    const storedChartData = sessionStorage.getItem('chartData');
    const storedFileData = sessionStorage.getItem('fileData');
    const storedFileName = sessionStorage.getItem('fileName');

    if (storedQuery) setQuery(storedQuery);
    if (storedChartType) setChartType(storedChartType as ChartType);
    if (storedChartData) setChartData(JSON.parse(storedChartData));
    if (storedFileData && storedFileName) {
      const byteString = atob(storedFileData.split(',')[1]);
      const mimeString = storedFileData.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const restoredFile = new File([ab], storedFileName, { type: mimeString });
      setFile(restoredFile);
    }
  }, []);

  // Persist query and chartType
  useEffect(() => {
    sessionStorage.setItem('query', query);
  }, [query]);

  useEffect(() => {
    sessionStorage.setItem('chartType', chartType);
  }, [chartType]);

  useEffect(() => {
    if (chartData) {
      sessionStorage.setItem('chartData', JSON.stringify(chartData));
    }
  }, [chartData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setLoading(true);
      const form = new FormData();
      form.append('file', file);
      form.append('query', query);
      form.append('chartType', chartType);

      const res = await fetch(`${process.env.NEXT_PUBLIC_ANALYSIS_API_URL}/api/analyze`, {
        method: 'POST',
        body: form,
      });

      const json = await res.json();
      setChartData(json);
      sessionStorage.setItem('chartData', JSON.stringify(json));
    } catch (err) {
      console.error('Error analyzing file:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        sessionStorage.setItem('fileData', reader.result.toString());
        sessionStorage.setItem('fileName', selectedFile.name);
        setFile(selectedFile);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="p-4 relative">
      <form onSubmit={handleSubmit} className="space-y-4 space-x-3">
        <div className="relative flex items-center">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            id="excel-upload"
            className="hidden"
          />
          <label
            htmlFor="excel-upload"
            className="flex items-center justify-center w-auto px-2 py-2 h-auto rounded-md bg-green-800 ring-2 ring-white text-white cursor-pointer hover:bg-green-700 transition text-sm"
            title="Upload Excel"
          >
            <FaUpload size={20} />
            <span className='ml-2 text-sm'>Upload Excel file</span>
          </label>
        </div>
        <input
          type="text"
          placeholder="Enter analysis query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border px-2 py-1 rounded-md md:w-auto w-full"
        />
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value as ChartType)}
          className="border px-2 py-1 bg-black text-white rounded-md"
        >
          <option value="bar" className=''>Bar Chart</option>
          <option value="line" className=''>Line Chart</option>
          <option value="pie" className=''>Pie Chart</option>
          <option value="doughnut" className=''>Doughnut Chart</option>
          <option value="polarArea" className=''>Polar Area Chart</option>
          <option value="radar" className=''>Radar Chart</option>
          <option value="bubble" className=''>Bubble Chart</option>
          <option value="scatter" className=''>Scatter Chart</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white md:px-4 px-2 py-2 rounded hover:bg-blue-700 md:text-md text-sm transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Analyze
        </button>
      </form>

      {loading && <div className="mt-4 absolute top-[50%] right-[50%] z-[999] text-black p-10">
        <Spinner size='lg' labelColor='primary' label='Analyzing...' variant='spinner' className='absolute top-[50%] right-[50%] z-[999]'/>
      </div>}

      {chartData && (
        <div className="mt-6">
          <ChartRenderer data={chartData.data} type={chartData.chartType} />
        </div>
      )}
    </div>
  );
}
