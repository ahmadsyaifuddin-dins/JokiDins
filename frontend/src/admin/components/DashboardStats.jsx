import React from "react";
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Hourglass, 
  FileText,
  TrendingUp,
  TrendingDown
} from "lucide-react";

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: "Total Order",
      value: stats.total,
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50 text-blue-600 border-blue-200",
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Menunggu",
      value: stats.pending,
      icon: <Clock className="w-6 h-6 text-yellow-600" />,
      color: "bg-yellow-50 text-yellow-600 border-yellow-200",
      change: "+5%",
      changeType: "positive"
    },
    {
      title: "Dikerjakan",
      value: stats.processing,
      icon: <Hourglass className="w-6 h-6 text-indigo-600" />,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
      change: "+8%",
      changeType: "positive"
    },
    {
      title: "Selesai",
      value: stats.completed,
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      color: "bg-green-50 text-green-600 border-green-200",
      change: "+15%",
      changeType: "positive"
    },
    {
      title: "Bermasalah",
      value: stats.cancelled,
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
      color: "bg-red-50 text-red-600 border-red-200",
      change: "-3%",
      changeType: "negative"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div 
          key={index} 
          className={`relative overflow-hidden rounded-xl shadow-sm border p-6 ${stat.color.includes("bg-") ? stat.color : "bg-white border-gray-200"}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${stat.color.split(" ")[0].replace("bg-", "bg-opacity-30")}`}>
              {stat.icon}
            </div>
            <div className={`flex items-center text-xs font-medium ${
              stat.changeType === "positive" ? "text-green-600" : "text-red-600"
            }`}>
              {stat.changeType === "positive" ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {stat.change}
            </div>
          </div>
          <h3 className="text-3xl font-bold">{stat.value}</h3>
          <p className="text-sm mt-1 text-gray-600">{stat.title}</p>
          
          {/* Decorative element */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10 bg-current"></div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;