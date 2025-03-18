type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storageUsage: number;
};

type StaticData = {
  totalStorage: number;
  cpuModel: string;
  totalMemoryGB: number;
};

type View = "CPU" | "RAM" | "STORAGE";

type FrameWindowAction = "CLOSE" | "MINIMIZE" | "MAXIMIZE";

type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: StaticData;
  changeView: View;
  sendFrameWindowAction: FrameWindowAction;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    subscribeStaticData: (
      callback: (statistics: Statistics) => void
    ) => UnsubscribeFunction;
    subscribeViewChange: (
      callback: (view: View) => void
    ) => UnsubscribeFunction;

    getStaticData: () => Promise<StaticData>;
    sendFrameWindowAction: (action: FrameWindowAction) => void;
  };
}
