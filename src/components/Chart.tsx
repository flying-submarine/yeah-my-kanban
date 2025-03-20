import React from "react";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";

interface ChartProps {
  data: EChartsOption;
}

export const Chart: React.FC<ChartProps> = ({ data }) => {
  return <ReactECharts option={
    {
      ...data,
      "legend": {
        "show": false // 隐藏图例
      },
    }
  } 
  style={{ height: 300, width: "100%",marginTop:30 }} 
  />;
};
