import React from "react";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";

interface BarChartProps {
  data: {
    xAxis: { type: "category"; data: string[] };
    yAxis: { type: "value" };
    series: { type: "bar"; data: number[] }[];
  };
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  console.log(data,'BarChart')
  const options: EChartsOption = {
    xAxis: {
      type: "category",
      data: data.xAxis.data,
    },
    yAxis: {
      type: "value",
    },
    series: data.series.map((s) => ({
      type: "bar",
      data: s.data,
    })),
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "10%",
      right: "10%",
      bottom: "10%",
      containLabel: true,
    },
  };

  return <ReactECharts option={options} style={{ height: 300, width: "100%" }} />;
};
