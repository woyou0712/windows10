import createElement from "new-dream/src/utils/createElement";
import { DesktopAppSize } from "../../types/style";
import { App } from "../../types/windows";
import ShortcutViews from "./ShortcutViews";

/** 桌面操作区域视图 */
export default class OperationView {
  /** 视图盒子 */
  public viewBox: HTMLElement;
  /** 拖拽遮罩层 */
  private shade: HTMLElement;
  /** 快捷方式视图 */
  private shortcutViews: ShortcutViews;

  constructor() {
    this.viewBox = createElement("windows10-desktop-operation-box");
    this.shade = createElement("windows10-desktop-operation-move-shade");
    // 创建快捷方式视图
    this.shortcutViews = new ShortcutViews(this.viewBox);
  }


  /** 移动桌面节点 */
  private moveNode(node: HTMLElement, moveEndCallback: ({ left, top }: { left: number; top: number }) => void) {
    let timeAuto = 0;
    // 鼠标按下
    node.onmousedown = (e) => {
      // 延时触发移动（避免和单击、双击冲突）
      timeAuto = setTimeout(() => {
        // 添加移动状态样式
        node.classList.add("move");
        let left = parseInt(node.style.left), top = parseInt(node.style.top); // 获取初始值
        const appX = e.offsetX, appY = e.offsetY;
        this.viewBox.appendChild(this.shade); // 挂载遮罩层
        this.shade.onmousemove = (s) => {
          const sX = s.offsetX, sY = s.offsetY;
          left = sX - appX;
          top = sY - appY;
          if (top < 0) {
            top = 0
          }
          if (left < 0) {
            left = 0
          }
          node.style["left"] = `${left}px`;
          node.style["top"] = `${top}px`;
        }
        // 鼠标抬起,移动结束
        this.shade.onmouseup = () => {
          // 去除移动状态样式
          node.classList.remove("move");
          // 去除遮罩层
          const parentNode = this.shade.parentNode;
          if (parentNode) {
            parentNode.removeChild(this.shade)
          }
          // 清空移动事件
          this.shade.onmousemove = null;
          // 调用结束回调函数
          moveEndCallback({ left, top })
        }
      }, 200);
    }
    // 如果在缓冲期抬起鼠标或者移出鼠标，说明用户无需移动元素，则清除定时任务
    node.onmouseup = node.onmouseleave = () => {
      clearTimeout(timeAuto)
    }

    return this
  }


  /** 设置应用快捷方式 */
  public setAppShortcut(appList: App[]) {
    this.shortcutViews.setShortcut(appList);
    return this
  }

  /** 设置桌面应用图标大小 */
  public setShortcutSize(size: DesktopAppSize) {
    this.shortcutViews.setShortcutSize(size)
    return this
  }
  /** 设置桌面应用字体颜色 */
  public setTextColor(color: string) {
    this.shortcutViews.setTextColor(color);
    return this
  }
  /** 设置图标对齐方式 */
  public setAlignAoto(alignAuto: boolean) {
    this.shortcutViews.setAlignAoto(alignAuto);
    return this
  }
  /** 监听应用参数变更 */
  public onAppOptionChange(fn: (data: App[]) => void) {
    /** 监听应用参数变更 */
    this.shortcutViews.onAppOptionChange(fn);
    // 监听快捷方式渲染
    this.shortcutViews.onShortcutRender((data) => {
      fn(data);
      // 为快捷方式添加移动方法
      data.forEach(s => {
        this.moveNode(s.shortcutItem.box, ({ left, top }) => {
          // 移动结束后，对快捷方式重新排序渲染
          this.shortcutViews.moveShortcutSortRender(s, { left, top });
        })
      })
    });
    return this
  }

}
