import { Direaction, SelectStatus, Theme } from "./style";

export interface WindowsOptions {
  taskbar: {
    theme: Theme; // 任务栏主题
    direaction: Direaction; // 任务栏方向
    selectStatus: SelectStatus; // 是否显示搜索框
  }
}

export type OptionsCallback = (data: OptionsData) => void


export interface OptionsData {
  taskbar?: {
    theme?: Theme; // 任务栏主题
    direaction?: Direaction; // 任务栏方向
    selectStatus?: SelectStatus; // 任务栏方向
  }
}

export type WinCallback = (data: Win) => void

export interface Methods {
  onOptionChange?: OptionsCallback
}

