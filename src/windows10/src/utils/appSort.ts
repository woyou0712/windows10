import { App } from "../types/windows.d";

export function appDesktopSort(appList: App[]) {
  // 按照排序规则排序
  for (let i = 0; i < appList.length - 1; i++) {
    for (let n = i + 1; n < appList.length; n++) {
      const item = appList[i], next = appList[n];
      if (Number(item.desktopIndex) > Number(next.desktopIndex)) {
        appList[i] = next;
        appList[n] = item;
      }
    }
  }
  return appList
}