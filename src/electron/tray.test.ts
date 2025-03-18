import { expect, Mock, test, vi } from "vitest";
import createTray from "./tray.js";
import { BrowserWindow, Menu } from "electron";

vi.mock("electron", () => {
  return {
    Tray: vi.fn().mockReturnValue({
      setContextMenu: vi.fn(),
    }),
    app: {
      getAppPath: vi.fn().mockReturnValue("/"),
      dock: {
        show: vi.fn(),
      },
      quit: vi.fn(),
    },
    Menu: {
      buildFromTemplate: vi.fn(),
    },
  };
});

const mainWindow = {
  show: vi.fn(),
} satisfies Partial<BrowserWindow> as any as BrowserWindow;

test("tray", () => {
  createTray(mainWindow);
  const calls = (Menu.buildFromTemplate as any as Mock).mock.calls;
  const args = calls[0] as Parameters<typeof Menu.buildFromTemplate>;
  const template = args[0];
  expect(template).toHaveLength(2);

  const quitItem = template[0];
  expect(quitItem.label).toBe("Quit");
  expect(quitItem.click).toBeInstanceOf(Function);

  const showItem = template[1];
  expect(showItem.label).toBe("Show");
  expect(showItem.click).toBeInstanceOf(Function);
});
