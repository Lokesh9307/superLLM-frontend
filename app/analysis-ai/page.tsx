'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import ChartRenderer from '../components/ChartRender';
import { ChartType } from 'chart.js';
import { FaUpload } from 'react-icons/fa';
import { Spinner } from "@heroui/spinner";
import { IoIosArrowUp } from "react-icons/io";


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
  const [formOpen, setFormOpen] = useState(true); // state for toggling


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
    <div className="p-4 mt-4 max-w-4xl mx-auto space-y-4">

      {/* Toggle Bar */}
      <div
        onClick={() => setFormOpen(!formOpen)}
        className="w-full px-4 py-3 cursor-pointer bg-white/5 border border-white/10 backdrop-blur-lg rounded-lg flex items-center justify-between hover:bg-white/10 transition"
      >
        <h2 className="text-white text-lg font-semibold">AI Chart Analyzer</h2>
        <span className="text-sm text-gray-300">{formOpen ? 'Hide': 'Show'}</span>
      </div>

      {/* Form Area */}
      {formOpen && (
        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-md transition-all duration-300 ease-in-out">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Row 1: Upload Button */}
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                id="excel-upload"
                className="hidden"
              />
              <label
                htmlFor="excel-upload"
                className="flex items-center px-4 py-2 bg-green-700 text-white rounded-lg shadow-sm hover:bg-green-600 transition cursor-pointer text-sm"
              >
                <FaUpload className="mr-2" />
                Upload Excel
              </label>
              {file && (
                <span className="text-sm text-white truncate max-w-[180px]">
                  {file.name}
                </span>
              )}
            </div>

            {/* Row 2: Query + Chart Type */}
            <div className="flex flex-wrap md:flex-nowrap gap-4 items-center w-full">
              <input
                type="text"
                placeholder="Enter your analysis query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-4 py-2 bg-black border border-white/10 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as ChartType)}
                className="w-full md:w-40 px-4 py-2 bg-black border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
                <option value="doughnut">Doughnut</option>
                <option value="polarArea">Polar Area</option>
                <option value="radar">Radar</option>
                <option value="bubble">Bubble</option>
                <option value="scatter">Scatter</option>
              </select>
            </div>

            {/* Row 3: Analyze Button */}
            <div className="flex">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2 rounded-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Analyze
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black/30 z-50 rounded-xl">
          <Spinner
            size="lg"
            label="Analyzing..."
            labelColor="primary"
            variant="spinner"
            className="text-white"
          />
        </div>
      )}

      {/* Chart Output */}
      {chartData && (
        <div className="mt-20">
          <ChartRenderer data={chartData.data} type={chartData.chartType} />
        </div>
      )}
    </div>
  );
}
