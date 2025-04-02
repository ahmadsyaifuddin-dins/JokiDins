import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const IncomeBarChart = ({ data }) => {
  // Group data berdasarkan bulan
  const monthlyData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Mapping nama bulan
    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    // Group data by bulan
    const grouped = data.reduce((acc, curr) => {
      const date = new Date(curr.date);
      const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = {
          monthYear,
          monthIndex: date.getMonth(),
          yearMonth: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
          total: 0
        };
      }
      acc[monthYear].total += curr.nominal;
      return acc;
    }, {});

    // Convert to array dan sort berdasarkan tahun dan bulan
    return Object.values(grouped)
      .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth))
      .map(item => ({
        ...item,
        // Format angka untuk tooltip
        formattedTotal: new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(item.total)
      }));
  }, [data]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-slate-800 border border-slate-700 rounded shadow text-sm">
          <p className="font-medium text-slate-300">{label}</p>
          <p className="text-blue-400 font-bold">{payload[0].payload.formattedTotal}</p>
        </div>
      );
    }
    return null;
  };

  // Jika tidak ada data
  if (monthlyData.length === 0) {
    return (
      <div className="bg-slate-700/30 rounded-lg p-8 text-center h-64 flex items-center justify-center">
        <p className="text-slate-400">Data tidak cukup untuk menampilkan grafik</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={monthlyData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis 
            dataKey="monthYear" 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: '#475569' }}
            tickLine={{ stroke: '#475569' }}
          />
          <YAxis 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: '#475569' }}
            tickLine={{ stroke: '#475569' }}
            tickFormatter={(value) => new Intl.NumberFormat('id-ID', {
              notation: 'compact',
              compactDisplay: 'short'
            }).format(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="total" 
            name="Total Pendapatan" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
            barSize={30}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeBarChart;