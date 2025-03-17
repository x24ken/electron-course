import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  Area,
  XAxis,
  YAxis,
} from "recharts";
import { memo } from "react";

type BaseChartProps = {
  data: { value: number | undefined }[];
  fill: string;
  stroke: string;
};

export const BaseChart = memo(function BaseChart(props: BaseChartProps) {
  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <AreaChart data={props.data}>
        <CartesianGrid stroke="#333" strokeDasharray="5 5" fill="#1C1C1C" />
        <Area
          fillOpacity={0.3}
          fill={props.fill}
          stroke={props.stroke}
          strokeWidth={3}
          type="monotone"
          dataKey="value"
          isAnimationActive={false}
        />
        <XAxis
          stroke="transparent"
          height={0}
          allowDataOverflow={true}
          scale="auto"
          type="category"
          padding={{ left: 0, right: 0 }}
        />
        <YAxis
          domain={[0, 100]}
          stroke="transparent"
          width={0}
          allowDataOverflow={true}
          scale="linear"
          type="number"
          padding={{ top: 0, bottom: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
});
