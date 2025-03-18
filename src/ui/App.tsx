import { useEffect, useMemo, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { useStatistics } from "./useStatistics";
import { Chart } from "./Chart";

function App() {
  const [count, setCount] = useState(0);
  const statistics = useStatistics(10);
  const [view, setView] = useState<View>("CPU");

  useEffect(() => {
    const unsubscribe = window.electron.subscribeViewChange((view) => {
      setView(view);
    });
    return () => unsubscribe();
  }, []);

  const cpuUsage = useMemo(
    () => statistics.map((stat) => stat.cpuUsage),
    [statistics]
  );
  const ramUsage = useMemo(
    () => statistics.map((stat) => stat.ramUsage),
    [statistics]
  );
  const storageUsage = useMemo(
    () => statistics.map((stat) => stat.storageUsage),
    [statistics]
  );

  const data = useMemo(() => {
    switch (view) {
      case "CPU":
        return cpuUsage;
      case "RAM":
        return ramUsage;
      case "STORAGE":
        return storageUsage;
    }
  }, [view, cpuUsage, ramUsage, storageUsage]);

  return (
    <div className="App">
      <div style={{ height: 120 }}>
        <Chart data={data} maxDataPoints={10} />
      </div>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
