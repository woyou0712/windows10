
/**
 * 图片背景
 */
interface imageBg {
  type: "image";
  /** 背景图片URL */
  backgroundImage: string;
  /** 背景大小   * initial:默认   * contain:原图尺寸   * 100% 100%:拉伸  */
  backgroundSize?: "initial" | "contain" | "100% 100%" | "50% 50%";
  /** 背景契合度   * repeat：铺满   * no-repeat：不平铺   * repeat-x：横向铺满   * repeat-y：纵向铺满   */
  backgroundRepeat?: "repeat" | "no-repeat" | "repeat-x" | "repeat-y";
  /** 背景图片位置   * initial：默认   * center：居中   * top：上   * bottom：下   * left：左   * right：右   */
  backgroundPosition?: "initial" | "center" | "top" | "bottom" | "left" | "right";
}
/**
 * 纯色背景
 */
interface colorBg {
  type: "color";
  /** 背景颜色16进制色号 */
  backgroundColor: string;
}

/**
 * 任务栏主题
 */
export interface TaskbarTheme {
  /** 任务栏背景颜色   */
  backgroundColor: string;
  /** 任务栏字体颜色   */
  color: string;
}

/**
 * 任务栏方向
 */
export type Direaction = "top" | "bottom";
/**
 * 搜索框显示状态
 */
export type QueryStatus = "show" | "none"
/** 桌面背景 */
export type DesktopBackground = imageBg | colorBg

export interface DesktopTheme {
  /** 背景（图片或纯色）   */
  background: DesktopBackground;
  /** 背景图片URL列表 */
  backgroundList: string[];
  /**  桌面字体颜色（16进制色号）   */
  color: string;
  /**  桌面图标大小   */
  iconSize: "mini" | "default" | "max";
}
