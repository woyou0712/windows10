import { Direaction, QueryStatus, Theme } from "./style";

export interface WindowsOptions {
  taskbar: {
    theme: Theme; // 任务栏主题
    direaction: Direaction; // 任务栏方向
    queryStatus: QueryStatus; // 是否显示搜索框
  }
}

export type OptionsCallback = (data: OptionsData) => void

/**
 * 配置项数据（用于改变配置项时传递数据）
 */
export interface OptionsData {
  /**
   * 任务栏配置项
   */
  taskbar?: {
    /**
     * 任务栏主题
     */
    theme?: Theme; 
    /**
     * 任务栏方向
     */
    direaction?: Direaction; 
    /**
     * 任务栏方向
     */
    queryStatus?: QueryStatus;
  }
}

export type WinCallback = (data: Win) => void

export interface Methods {
  onOptionChange?: OptionsCallback
}
/**
 * 全局任务对象
 */
export interface GlobalTask {
  /**
   * 任务变化监听回调函数（禁止直接访问）
   */
  TaskChangeCallback: (data: { [key: string]: Win }) => void;
  /**
   * 配置变化监听防抖定时器
   */
   OptionsChangeTime: number;
}