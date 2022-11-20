import { DesktopTheme, Direaction, QueryStatus, TaskbarTheme } from "./style";

/** 用户信息 */
export interface UserInfo {
  nickName: string;
  avatar?: string;
  avatarType?: "image" | "svg"
}
/** 任务栏配置项 */
export interface TaskbarOption {
  /** 任务栏主题     */
  theme: TaskbarTheme;
  /** 任务栏方向     */
  direaction: Direaction;
  /** 是否显示搜索框     */
  queryStatus: QueryStatus;
}

/** 桌面配置项 */
export interface DesktopOption {
  /** 主题 */
  theme: DesktopTheme;
}

/**
 * 配置项改变的回调函数
 */
export type OptionsCallback = (data: OptionsData) => void

/**
 * 内部方法对象
 */
export interface Methods {
  /** 配置项变化监听函数 */
  onOptionChange?: OptionsCallback
}


/** 设置显示页面类型 */
export type SettingPageType = "default" | "taskbar" | "system" | "individuation" | "app";

/** Windows配置项 */
export interface WindowsOption {
  /** 用户信息 */
  userInfo: UserInfo;
  /** 任务栏配置项 */
  taskbar: TaskbarOption;
  /** 桌面配置项 */
  desktop: DesktopOption;
}