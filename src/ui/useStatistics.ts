import { useEffect, useState } from "react";

export function useStatistics(dataPointCount: number): Statistics[] {
  const [value, setValue] = useState<Statistics[]>([]);

  useEffect(() => {
    const unsubscribe = window.electron.subscribeStaticData((statistics) => {
      setValue((prev) => {
        const newData = [...prev, statistics];
        if (newData.length > dataPointCount) {
          newData.shift();
        }
        console.log(newData);
        return newData;
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return value;
}
