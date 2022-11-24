import { DefaultComputed } from "vue/types/options";
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
  /** 自动网格对齐 */
  alignAuto: boolean;
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
/** 用户打开设置监听函数 */
export type SettingOpenFn = (type?: SettingPageType) => void;

export interface App {
  /** 唯一ID，传唯一ID应用只可开一个，不传唯一应用可以多开 */
  id?: number | string;
  /** 窗口标题 */
  title: string;
  /** 窗口宽 */
  width?: string;
  /** 窗口高 */
  height?: string;
  /** 最小化按钮是否显示 */
  miniBtn?: boolean;
  /** 最大化按钮是否显示 */
  maxBtn?: boolean;
  /** 窗口是否可缩放 */
  resize?: boolean;
  /** 图标 */
  icon: string | HTMLIFrameElement;
  /** VUE组件所需的参数 */
  props?: { [key]: any };
  /** VUE组件 */
  component?: DefaultComputed;
  /** 网站URL地址 */
  url?: string;
  /** 是否在桌面显示 */
  desktopShow?: boolean;
  /** 在桌面上的位置X */
  desktopX?: number;
  /** 在桌面上的位置Y */
  desktopY?: number;
}
/** 桌面快捷方式 */
export interface Shortcut extends App {
  shortcutEls: HTMLElement
}

/** Windows配置项 */
export interface WindowsOption {
  /** 用户信息 */
  userInfo: UserInfo;
  /** 任务栏配置项 */
  taskbar: TaskbarOption;
  /** 桌面配置项 */
  desktop: DesktopOption;
}

/** 网格区域对象 */
export interface District {
  /** 坐标 */
  x: number;
  /** 坐标 */
  y: number;
  /** 是否被占用 */
  occupy: boolean;
}