import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillTrendUp } from '@fortawesome/free-solid-svg-icons';

const IncomeChart = ({ data }) => {
  // Mapping data: kita ambil tanggal dalam format readable, dan nominal
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString(), // format tanggal lokal
    nominal: item.nominal,
  }));

  // Kalau data punya banyak entry pada tanggal yang sama, nanti bisa digroup dulu.
  return (
    <div className="mb-8 bg-slate-800 p-4 rounded shadow text-white">
      <h2 className="text-xl font-semibold mb-4 text-center">Grafik Pendapatan
      <FontAwesomeIcon icon={faMoneyBillTrendUp} className="ml-2" />
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="nominal" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeChart;
