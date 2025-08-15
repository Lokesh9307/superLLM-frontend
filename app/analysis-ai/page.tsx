"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Rnd } from "react-rnd";

// Lazy-load chart for Next.js (no SSR)
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// ==================== Types ====================

type SeriesPoint = { label: string; value: number | string };
type Series = { series: string; data: SeriesPoint[] };

type BackendResponse = {
  data: Series[];
  summary?: string;
  reasoning?: string;
  chartType?: string; // forwarded by your backend
};

type CleanPoint = { label: string; value: number };
type CleanSeries = { series: string; data: CleanPoint[] };

type CleanPayload = {
  data: CleanSeries[];
  summary?: string;
  reasoning?: string;
  chartType?: string;
};

type ChartSeries = { name: string; data: number[] };

type WidgetBase = { id: string; x: number; y: number; w: number; h: number; zIndex: number };
type ChartWidget = WidgetBase & { kind: "chart" };
type TextWidget = WidgetBase & { kind: "text"; text: string };
type Widget = ChartWidget | TextWidget;

type HistoryItem = {
  id: string;
  fileName: string;
  timestamp: number;
  payload: CleanPayload;
};

// ==================== Helpers ====================

const newId = () => Math.random().toString(36).slice(2, 10);

// Try to detect month order; otherwise fall back to alpha/order given
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function isMonthLabel(label: string) {
  return MONTHS.includes(label);
}

/** Clean the raw backend response on the frontend (no backend changes). */
function cleanPayload(raw: BackendResponse): CleanPayload {
  const cleanedSeries: CleanSeries[] = (raw.data || []).map((s) => ({
    series: String(s.series ?? "").trim() || "Series",
    data: (s.data || [])
      .map((p) => {
        const label = String(p.label ?? "").trim();
        // Coerce numbers; treat invalid as 0
        const num = typeof p.value === "number" ? p.value : Number(String(p.value ?? "").replace(/[, ]/g, ""));
        return { label, value: Number.isFinite(num) ? num : 0 };
      })
      // keep only points with non-empty label
      .filter((p) => p.label.length > 0),
  }));

  // Build master category list from union of all labels
  const categoriesSet = new Set<string>();
  cleanedSeries.forEach((s) => s.data.forEach((p) => categoriesSet.add(p.label)));
  let categories = Array.from(categoriesSet);

  // Sort by months if detected; else keep as-is alphabetically but stable
  const hasMostlyMonths = categories.filter(isMonthLabel).length >= Math.max(4, Math.floor(categories.length / 2));
  if (hasMostlyMonths) {
    categories.sort((a, b) => MONTHS.indexOf(a) - MONTHS.indexOf(b));
  } else {
    // Stable alphabetical (case-insensitive)
    categories.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  }

  // Align series data to categories order (fill missing with 0)
  const aligned: CleanSeries[] = cleanedSeries.map((s) => {
    const map = new Map(s.data.map((p) => [p.label, p.value]));
    return {
      series: s.series,
      data: categories.map((label) => ({ label, value: map.get(label) ?? 0 })),
    };
  });

  return {
    data: aligned,
    summary: raw.summary,
    reasoning: raw.reasoning,
    chartType: raw.chartType,
  };
}

/** Convert clean payload → ApexCharts categories & series arrays. */
function toApex(
  payload: CleanPayload | null
): { categories: string[]; series: ChartSeries[] } {
  if (!payload || (payload.data || []).length === 0) return { categories: [], series: [] };
  const categories = payload.data[0].data.map((d) => d.label);
  const series: ChartSeries[] = payload.data.map((s) => ({
    name: s.series,
    data: s.data.map((d) => d.value),
  }));
  return { categories, series };
}

/** Map backend chartType → ApexCharts type */
function mapChartType(t?: string): "bar" | "line" | "area" {
  const x = (t || "").toLowerCase();
  if (x.includes("line")) return "line";
  if (x.includes("area")) return "area";
  return "bar";
}

// ==================== Component ====================

export default function AnalysisAIDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState<string>("");
  const [chartType, setChartType] = useState<string>("bar");
  const [payload, setPayload] = useState<CleanPayload | null>(null);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("analysis-ai-history");
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);
  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem("analysis-ai-history", JSON.stringify(history));
    } catch {}
  }, [history]);

  // Build chart input
  const { categories, series } = useMemo(() => toApex(payload), [payload]);

  // Create a chart widget when new payload comes in (if none)
  useEffect(() => {
    if (!payload) return;
    if (!widgets.some((w) => w.kind === "chart")) {
      const id = newId();
      setWidgets((prev) => [
        ...prev,
        { id, kind: "chart", x: 260, y: 120, w: 720, h: 420, zIndex: prev.length + 1 },
      ]);
    }
  }, [payload, widgets]);

  // UI actions
  const addChart = () => {
    const id = newId();
    setWidgets((prev) => [
      ...prev,
      { id, kind: "chart", x: 260, y: 120, w: 720, h: 420, zIndex: prev.length + 1 },
    ]);
  };
  const addText = () => {
    const id = newId();
    setWidgets((prev) => [
      ...prev,
      { id, kind: "text", text: "Type your notes here…", x: 300, y: 560, w: 360, h: 180, zIndex: prev.length + 1 },
    ]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please select an Excel file (.xlsx or .xls).");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("query", query);
      form.append("chartType", chartType);

      // Your backend endpoint on Render:
      const res = await fetch("https://analysis-api-yihi.onrender.com/api/analyze", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw: BackendResponse = await res.json();

      const cleaned = cleanPayload(raw);
      console.log("Cleaned payload:", cleaned);
      setPayload(cleaned);

      const item: HistoryItem = {
        id: newId(),
        fileName: file.name,
        timestamp: Date.now(),
        payload: cleaned,
      };
      // newest first
      setHistory((prev) => [item, ...prev]);
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Chart options (dark theme, smooth)
  const apexType = mapChartType(payload?.chartType || chartType);
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      background: "transparent",
      foreColor: "#E5E7EB",
      toolbar: { show: false },
      animations: { enabled: true, speed: 400 },
    },
    theme: { mode: "dark" },
    grid: { borderColor: "#30363d" },
    xaxis: {
      categories,
      axisBorder: { color: "#4b5563" },
      axisTicks: { color: "#4b5563" },
      labels: { rotateAlways: false, trim: true, style: { colors: "#CBD5E1" } },
    },
    yaxis: {
      labels: { style: { colors: "#CBD5E1" } },
    },
    legend: {
      labels: { colors: "#E5E7EB" },
    },
    stroke: { width: apexType === "line" ? 3 : 2, curve: "smooth" },
    dataLabels: { enabled: false },
    tooltip: {
      theme: "dark",
    },
  };

  return (
    <div className="flex h-screen w-full bg-[#0B0E13] text-gray-200">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0F141B] border-r border-[#1F2530] flex flex-col">
        <div className="p-4 border-b border-[#1F2530]">
          <div className="text-lg font-semibold">🧠 Analysis AI</div>
          <div className="text-xs text-gray-400">Excel → LLM → Charts</div>
        </div>

        <div className="p-4 border-b border-[#1F2530] space-y-2">
          <label className="flex items-center gap-2">
            <span className="text-sm">Excel file</span>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
            />
          </label>

          <div className="text-sm">
            <div className="mb-1">Query</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Compare budget vs expenses by month"
              className="w-full rounded-md bg-[#111827] border border-[#1F2530] px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="text-sm">
            <div className="mb-1">Chart type</div>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="w-full rounded-md bg-[#111827] border border-[#1F2530] px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="area">Area</option>
            </select>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !file}
            className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 transition px-3 py-2 text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Analyzing…" : "Analyze & Render"}
          </button>
        </div>

        <div className="px-4 py-3 text-sm text-gray-400 border-b border-[#1F2530]">
          Upload History
        </div>
        <div className="flex-1 overflow-y-auto">
          {history.length === 0 && (
            <div className="p-4 text-sm text-gray-500">No analyses yet.</div>
          )}
          {history.map((h) => (
            <button
              key={h.id}
              onClick={() => setPayload(h.payload)}
              className="w-full text-left px-4 py-3 border-b border-[#111827] hover:bg-[#121826] transition"
            >
              <div className="text-sm font-medium truncate">{h.fileName}</div>
              <div className="text-xs text-gray-500">
                {new Date(h.timestamp).toLocaleString()}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0F141B] border-b border-[#1F2530]">
          <button
            onClick={addChart}
            className="rounded-xl border border-[#263042] bg-[#111827] px-3 py-1.5 text-sm hover:bg-[#151b25] transition"
          >
            + Chart
          </button>
          <button
            onClick={addText}
            className="rounded-xl border border-[#263042] bg-[#111827] px-3 py-1.5 text-sm hover:bg-[#151b25] transition"
          >
            + Text Box
          </button>
          {payload?.summary && (
            <div className="ml-auto text-xs text-gray-400">
              {payload.summary.length > 120
                ? payload.summary.slice(0, 120) + "…"
                : payload.summary}
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="relative flex-1 overflow-auto bg-[radial-gradient(circle_at_25%_10%,rgba(88,94,255,0.07),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(0,212,255,0.06),transparent_35%)]">
          {widgets.map((w) => (
            <Rnd
              key={w.id}
              default={{ x: w.x, y: w.y, width: w.w, height: w.h }}
              bounds="parent"
              onDragStop={(_, d) =>
                setWidgets((prev) =>
                  prev.map((it) =>
                    it.id === w.id ? { ...it, x: d.x, y: d.y } : it
                  )
                )
              }
              onResizeStop={(_, __, ref, ___, pos) =>
                setWidgets((prev) =>
                  prev.map((it) =>
                    it.id === w.id
                      ? {
                          ...it,
                          w: ref.offsetWidth,
                          h: ref.offsetHeight,
                          x: pos.x,
                          y: pos.y,
                        }
                      : it
                  )
                )
              }
              className="absolute rounded-2xl border border-[#273043] bg-[#0F141B] shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden"
            >
              {w.kind === "chart" && (
                <div className="h-full w-full p-2">
                  {series.length > 0 ? (
                    <ApexChart
                      options={chartOptions}
                      series={series}
                      type={apexType}
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    <div className="h-full grid place-items-center text-sm text-gray-500">
                      Upload and analyze to see chart data
                    </div>
                  )}
                </div>
              )}

              {w.kind === "text" && (
                <div
                  className="h-full w-full p-3 text-sm leading-relaxed focus:outline-none"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) =>
                    setWidgets((prev) =>
                      prev.map((it) =>
                        it.id === w.id && it.kind === "text"
                          ? {
                              ...it,
                              text: (e.target as HTMLElement).innerText,
                            }
                          : it
                      )
                    )
                  }
                >
                  {w.text}
                </div>
              )}
            </Rnd>
          ))}
        </div>
      </main>
    </div>
  );
}
