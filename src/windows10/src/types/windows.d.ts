import { DesktopTheme, Direaction, QueryStatus, TtaskbarTheme } from "./style";

export interface UserInfo {
  nickName: string;
  avatar?: string;
  avatarType?: "image" | "svg"
}

/**
 * 完整配置项
 */
export interface WindowsOptions {
  /**
   * 用户信息
   */
  userInfo: UserInfo,
  /**
   * 任务栏配置项
   */
  taskbar: {
    /** 任务栏主题     */
    theme: TtaskbarTheme;
    /** 任务栏方向     */
    direaction: Direaction;
    /** 是否显示搜索框     */
    queryStatus: QueryStatus;
  },
  /**
   * 桌面配置项
   */
  desktop: {
    /** 主题 */
    theme: DesktopTheme;
  }

}
/**
 * 配置项改变的回调函数
 */
export type OptionsCallback = (data: OptionsData) => void

/**
 * 配置项数据（用于改变配置项时传递数据）
 */
export interface OptionsData {
  /**  任务栏配置项   */
  taskbar?: {
    /** 任务栏主题     */
    theme?: TtaskbarTheme;
    /**  任务栏方向     */
    direaction?: Direaction;
    /**  任务栏方向     */
    queryStatus?: QueryStatus;
  }
  /**
   * 桌面配置项
   */
  desktop?: {
    /** 主题 */
    theme?: DesktopTheme;
  }
}

/**
 * 内部方法对象
 */
export interface Methods {
  /** 配置项变化监听函数 */
  onOptionChange?: OptionsCallback
}


