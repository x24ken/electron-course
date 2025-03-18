import { useMemo } from "react";
import { BaseChart } from "./BaseChart";

type ChartProps = {
  data: number[];
  maxDataPoints: number;
  selectedView: "CPU" | "RAM" | "STORAGE";
};

export const COLOR_MAP = {
  CPU: {
    stroke: "#5DD4EE",
    fill: "#0A4D5C",
  },
  RAM: {
    stroke: "#E99311",
    fill: "#5F3C07",
  },
  STORAGE: {
    stroke: "#1ACF4D",
    fill: "#0B5B22",
  },
};

export function Chart(props: ChartProps) {
  const preparedData = useMemo(() => {
    const points = props.data.map((point) => ({ value: point }));

    return [
      ...points,
      ...Array(props.maxDataPoints - points.length).fill({ value: undefined }),
    ];
  }, [props.data]);

  return (
    <BaseChart
      data={preparedData}
      fill={COLOR_MAP[props.selectedView].fill}
      stroke={COLOR_MAP[props.selectedView].stroke}
    />
  );
}
