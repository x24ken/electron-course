import { useMemo } from "react";
import { BaseChart } from "./BaseChart";

type ChartProps = {
  data: number[];
  maxDataPoints: number;
};

export function Chart(props: ChartProps) {
  const preparedData = useMemo(() => {
    const points = props.data.map((point) => ({ value: point }));

    return [
      ...points,
      ...Array(props.maxDataPoints - points.length).fill({ value: undefined }),
    ];
  }, [props.data]);

  return <BaseChart data={preparedData} fill={"#000"} stroke={"#000"} />;
}
