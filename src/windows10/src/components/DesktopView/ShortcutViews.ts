import { Win, Menu } from "new-dream";
import createElement from "new-dream/src/utils/createElement";
import { DesktopAppSize } from "../../types/style";
import { App, District } from "../../types/windows";
import { appDesktopSort } from "../../utils/appSort";
import getNearNumIndex from "../../utils/getNearNumIndex";
import openApp from "../../utils/openApp";
import AppDetail from "../../systemApps/AppDetail/index.vue";
import ShortcutEls from "./ShortcutEls"
/** 视图区域大小 */
interface ViewSize { width: number; height: number }
/** 桌面快捷方式 */
interface Shortcut extends App {
  shortcutEls: ShortcutEls
}

/** 桌面快捷方式视图类 */
export default class ShortcutViews {
  /** 桌面操作区域视图盒子 */
  public operationViewBox: HTMLElement;
  /** 快捷方式列表 */
  public shortcutList: Shortcut[] = [];
  /** 新的应用列表（按序更新） */
  private newAppList: App[] = [];

  /** 是否网格对齐 */
  private alignAuto?: boolean;
  /** 应用图标大小 */
  private shortcutSize?: DesktopAppSize;
  private shortcutWidth = 76;
  private shortcutHeight = 90;
  private shortcutPadding = "4px 12px";
  /** 桌面可视区域大小 */
  private viewSize?: ViewSize;
  /**  横向坐标列表（每一列的X坐标列表）*/
  private columnList: number[] = [];
  /** 纵向坐标列表（每一行的Y坐标列表） */
  private rowList: number[] = [];
  /** 桌面网列表（可放置快捷方式的区域列表） */
  private districtList: District[][] = [];
  /** 桌面字体颜色 */
  private textColor?: string

  private methods = {
    onShortcutRender: (data: Shortcut[]) => { console.log("应用数据发生变化", data) },
    onAppOptionChange: (data: App[]) => { console.log("应用数据发生变化", data) },
  }
  // 桌面盒子
  constructor(operationViewBox: HTMLElement) {
    this.operationViewBox = operationViewBox;
  }

  private get __shortcutSize() {
    return this.shortcutSize
  }
  private set __shortcutSize(v) {
    // 图标大小发生变化
    if (v && v !== this.shortcutSize) {
      this.setAppIconSize(v); // 重新设置图标大小
      if (this.__viewSize) {
        this.sliceDesktop(this.__viewSize); // 重新切割网格区域
      }
      if (this.shortcutList && this.shortcutList.length) {
        // 如果有快捷方式，拷贝一份应用列表重新比较渲染
        this.newAppList = this.shortcutList.map(app => Object.assign({}, app))
        this.renderShortcut();
      }
    }
    this.shortcutSize = v
  }

  private get __viewSize() {
    return this.viewSize
  }

  private set __viewSize(v) {
    if (!this.viewSize) {
      this.viewSize = { width: 0, height: 0 }
    }
    const oldSize = this.viewSize;
    if (v && (v.width !== oldSize.width || v.height !== oldSize.height)) {
      console.log("【桌面可视区域】设置范围")
      this.viewSize = Object.assign({}, v);
      // 桌面大小发生变化，切割桌面
      this.sliceDesktop(v);
      if (this.shortcutList && this.shortcutList.length) {
        // 如果有快捷方式，拷贝一份应用列表重新比较渲染
        this.newAppList = this.shortcutList.map(app => Object.assign({}, app));
        this.renderShortcut();
      }
    }
  }

  private get __alignAuto() {
    return this.alignAuto
  }

  private set __alignAuto(v) {
    // 如果数据有更新
    if (this.alignAuto !== v) {
      this.alignAuto = v;
      // 拷贝一份新的应用数据列表
      this.newAppList = this.shortcutList.map(app => Object.assign({}, app))
      if (v) {
        // 重新渲染快捷方式(对齐到网格)
        this.renderShortcut();
        // 快捷方式上锁
        this.shortcutList.forEach(s => {
          s.shortcutEls.box.classList.remove("not-lock")
        })
      } else {
        // 快捷方式解锁
        this.shortcutList.forEach(s => {
          s.shortcutEls.box.classList.add("not-lock")
        })
      }
    }
  }

  private get __textColor() {
    return this.textColor
  }

  private set __textColor(v) {
    if (v && v !== this.textColor) {
      console.log("【快捷方式字体颜色】更新")
      // 设置快捷方式字体颜色
      this.shortcutList.forEach(s => {
        s.shortcutEls.box.style["color"] = v;
      })
      this.textColor = v
    }
  }

  /** 设置图标大小 */
  public setAppIconSize(size: DesktopAppSize) {
    console.log("【桌面图标】设置大小")
    const styleId = "style-desktop-shortcut-size";
    switch (size) {
      case "max":
        this.shortcutHeight = 104
        this.shortcutPadding = "4px"
        break;
      case "mini":
        this.shortcutHeight = 76
        this.shortcutPadding = "4px 18px"
        break;
      default:
        this.shortcutHeight = 90
        this.shortcutPadding = "4px 12px"
    }
    // 更新视图
    let style = document.getElementById(styleId);
    if (!style) {
      // 如果没有主题样式，则创建
      style = createElement({ name: "style", id: styleId });
      document.head.appendChild(style);
    }
    style.innerHTML = `
      :root{
        --shortcutWidth: ${this.shortcutWidth}px !important;
        --shortcutHeight: ${this.shortcutHeight}px !important;
        --shortcutPadding: ${this.shortcutPadding} !important;
      }
    `;
    return this
  }

  /** 切割桌面 */
  public sliceDesktop(viewSize: ViewSize) {
    console.log("【桌面可视区域】切割网格")
    const padding = 5; // 桌面便宜留5px的内边距
    this.districtList = [];
    this.columnList = [];
    this.rowList = [];
    // 切割出所有的列
    for (let x = padding; x < viewSize.width - (this.shortcutWidth + padding * 2); x += this.shortcutWidth) {
      // 储存每一列的X坐标
      this.columnList.push(x)
    }
    // 切割出所有的行
    for (let y = padding; y < viewSize.height - (this.shortcutHeight + padding * 2); y += this.shortcutHeight) {
      // 储存每一行的Y坐标
      this.rowList.push(y)
    }
    // 初始化所有网格以及状态
    this.columnList.forEach((x) => {
      // 一列区域
      const column: District[] = []
      this.rowList.forEach((y) => {
        column.push({ x, y, occupy: false })
      })
      this.districtList.push(column)
    })

    return this
  }
  /** 获取可用的网格坐标 */
  private getDistrict(): District {
    for (const column of this.districtList) {
      for (const row of column) {
        if (!row.occupy) {
          return row
        }
      }
    }
    // 如果没有可用区域，则将图标设置在区域之外
    return { x: -100, y: -100, occupy: false };
  }
  /** 获取坐标相近的网格对象 */
  private getNearDistrict(x: number, y: number): District {
    let col = this.columnList.indexOf(x); // 获取对应的列下标
    let row = this.rowList.indexOf(y); // 获取对应的行下标
    if (col === -1) {
      // 如果没有对应的列，找到最近的列
      col = getNearNumIndex(this.columnList, x);
    }
    if (row === -1) {
      // 如果没有对应的行，找到最近的行
      row = getNearNumIndex(this.rowList, y);
    }
    if (col !== -1 && row !== -1) {
      // 开始检查是否被占用
      for (let i = col; i < this.districtList.length; i++) {
        const column = this.districtList[i]
        for (let n = i === col ? row : 0; n < column.length; n++) {
          const item = this.districtList[i][n];
          if (!item.occupy) {
            return item
          }
        }
      }
    }
    // 如果没有可用区域，则将图标设置在区域之外
    return { x: -100, y: -100, occupy: false }

  }

  /** 为快捷方式添加网格坐标 */
  private setShortcutPosition() {
    // 将所有网格对象置空
    this.districtList.forEach(colnum => { colnum.forEach(row => row.occupy = false) });
    // 为快捷方式添加坐标
    if (this.__alignAuto) {
      // 如果是自动对齐，直接按序添加
      this.newAppList.forEach((app) => {
        // 无需显示快捷方式的直接退出
        if (!app.desktopShow) { return }
        // 按序获取位置
        const district = this.getDistrict();
        app.desktopX = district.x;
        app.desktopY = district.y;
        district.occupy = true; // 标记占用

      })
    } else {
      // 如果不是自动对齐，则按自定义坐标就近插入网格
      // 没有坐标的APP列表
      const notPositionApp: App[] = [];
      this.newAppList.forEach((app) => {
        // 如果是自动对齐，直接按序添加
        if (!app.desktopShow) { return }
        if (app.desktopX && app.desktopY) {
          // 先将有坐标的应用就近放入对应的网格
          const district = this.getNearDistrict(app.desktopX, app.desktopY);
          app.desktopX = district.x;
          app.desktopY = district.y;
          district.occupy = true; // 标记占用
        } else {
          // 没有坐标的APP记录下来
          notPositionApp.push(app)
        }
      })
      // 将没有坐标的APP按网格顺序自动排列
      notPositionApp.forEach((app) => {
        // 如果是自动对齐，直接按序添加
        if (!app.desktopShow) { return }
        // 按序获取位置
        const district = this.getDistrict();
        app.desktopX = district.x;
        app.desktopY = district.y;
        district.occupy = true; // 标记占用
      })
    }

    return this
  }
  /** 清除桌面快捷方式   */
  private removeShortcut() {
    for (let i = this.shortcutList.length - 1; i >= 0; i--) {
      const shortcut = this.shortcutList[i];
      const parentEl = shortcut.shortcutEls.box.parentElement;
      if (parentEl) {
        parentEl.removeChild(shortcut.shortcutEls.box); // 移除视图元素
      }
      this.shortcutList.splice(i, 1); // 释放内存
    }
    return this
  }
  /** 创建快捷方式   */
  private createShortcut(app: App) {
    let shortcutEls = (app as Shortcut).shortcutEls; // 图标大小变化/桌面大小变化时可继续使用上次的元素
    let shortcut: Shortcut = Object.assign({ shortcutEls }, app);
    // 如果没有旧的元素，是第一次渲染，创建元素
    if (!shortcutEls || !shortcutEls.box) {
      console.log("【快捷方式】首次渲染，创建节点");
      shortcutEls = new ShortcutEls(app);
      // 初始化快捷方式字体颜色
      if (this.__textColor) shortcutEls.box.style["color"] = this.__textColor;
      // 包装成快捷方式对象
      shortcut = Object.assign({ shortcutEls }, app);
    } else {
      // 判断快捷方式标题是否需要更新
      if (shortcutEls.title !== app.title) {
        shortcutEls.setTitle(app.title);
      }
      // 判断快捷方式图标是否需要更新
      if (shortcutEls.icon !== app.icon) {
        shortcutEls.setIcon(app.icon)
      }
    }
    // 加载位置属性
    shortcutEls.box.style["left"] = `${app.desktopX}px`
    shortcutEls.box.style["top"] = `${app.desktopY}px`
    this.operationViewBox.appendChild(shortcutEls.box);
    this.shortcutList.push(shortcut);
    return shortcut
  }
  /** 比较新旧数据是否存在差异 */
  private differentShortcut() {
    for (let i = 0; i < this.newAppList.length; i++) {
      const app = this.newAppList[i], shortcut = this.shortcutList[i];
      if (!shortcut) {
        return true;
      }
      if (app.id !== shortcut.id || app.title !== shortcut.title || app.desktopX !== shortcut.desktopX || app.desktopY !== shortcut.desktopY || app.desktopShow !== shortcut.desktopShow) {
        return true;
      }
    }
    return false
  }
  /** 设置快捷方式的右键菜单  */
  private setShortcutRmenu() {
    new Menu(this.shortcutList.map(shortcut => shortcut.shortcutEls.box),
      [
        {
          id: 1,
          name: "打开",
          method: (el) => {
            const appId = el?.getAttribute("app-id");
            for (const shortcut of this.shortcutList) {
              if (shortcut.id === appId) {
                return openApp(shortcut)
              }
            }
          }
        },
        {
          id: 2,
          name: "删除快捷方式",
          method: (el) => {
            const appId = el?.getAttribute("app-id");
            const newAppList: App[] = [];
            this.shortcutList.forEach(shortcut => {
              const newApp = Object.assign({}, shortcut); // 拷贝新的应用数据
              if (newApp.id === appId) {
                newApp.desktopShow = false
              }
              newAppList.push(newApp)
            })
            this.setShortcut(newAppList);
          }
        },
        {
          id: 3,
          name: "属性",
          method: (el) => {
            const appId = el?.getAttribute("app-id");
            if (!appId) {
              return console.error("应用数据异常！")
            }
            let app = null;
            for (const shortcut of this.shortcutList) {
              if (shortcut.id === appId) {
                app = shortcut;
                break
              }
            }
            if (!app) {
              return console.error("应用数据异常！")
            }
            const win = new Win({
              id: appId,
              title: app.title,
              icon: app.icon,
              component: AppDetail,
              props: {
                data: app,
                change: (option: App) => {
                  const newAppList: App[] = [];
                  let updateShortcut = false; // 是否更新快捷方式
                  this.shortcutList.forEach(shortcut => {
                    const newApp = Object.assign({}, shortcut);
                    if (shortcut.id === appId) {
                      // 如果快捷方式显示与否有变化，则需要更新快捷方式
                      if (newApp.desktopShow !== option.desktopShow) {
                        updateShortcut = true;
                      }
                      Object.assign(newApp, option); // 更新应用数据
                    }
                    newAppList.push(newApp)
                  })
                  if (updateShortcut) {
                    console.log("快捷方式更新")
                    this.setShortcut(newAppList);
                  } else {
                    console.log("快捷方式没有更新，直接通知应用列表更新")
                    this.methods.onAppOptionChange(newAppList);
                  }
                  win.close();
                },
                close: () => {
                  win.close();
                }
              }
            })

          }
        },
      ])
  }
  /** 渲染应用快捷方式 */
  private renderShortcut() {
    // 将新的数据和旧的快捷方式作比较,判断是否需要重新渲染
    let isUpdate = false;
    isUpdate = this.differentShortcut();
    // 更新桌面大小
    this.__viewSize = { width: this.operationViewBox.offsetWidth, height: this.operationViewBox.offsetHeight };
    // 为快捷方式设置位置
    this.setShortcutPosition();
    if (!isUpdate) {
      // 如果之前的数据没有变化，查看重新设置了位置的数据是否有更新
      isUpdate = this.differentShortcut();
    }
    if (isUpdate) {
      console.log("---------------渲染快捷方式---------------")
      // 清除之前的快捷方式
      this.removeShortcut();
      // 重新加载快捷方式
      this.newAppList.forEach((app) => {
        if (!app.desktopShow) { return }
        this.createShortcut(app)
      })
      // 加载完成后，为快捷方式添加右键菜单
      this.setShortcutRmenu();
      // 渲染完成，通知监听函数
      this.methods.onShortcutRender(this.shortcutList);
    }
    // 清空新的应用列表
    this.newAppList = [];
    return this
  }

  /** 移动快捷方式后重新排序 */
  public moveShortcutSortRender(shortcut: Shortcut, { left, top }: { left: number; top: number }) {
    // 移动结束之后，将新的应用数据装载到列表
    this.newAppList = this.shortcutList.map(s => {
      // 拷贝应用数据
      const newShortcut = Object.assign({}, s);
      if (newShortcut.id === shortcut.id) {
        newShortcut.desktopX = left;
        newShortcut.desktopY = top;
      }
      return newShortcut
    })
    // 移动结束之后，对应用进行重新排序
    for (let i = 0; i < this.newAppList.length - 1; i++) {
      for (let n = i + 1; n < this.newAppList.length; n++) {
        const item = this.newAppList[i];
        const next = this.newAppList[n];
        if (item.desktopY && item.desktopX && next.desktopY && next.desktopX) {
          const bool = (item.desktopX - next.desktopX > this.shortcutWidth / 2) || (item.desktopY > next.desktopY && next.desktopX - item.desktopX < this.shortcutWidth / 2)
          if (bool) {
            this.newAppList[i] = next
            this.newAppList[n] = item
          }
        }
      }
    }
    // 为应用设置桌面显示顺序
    this.newAppList.forEach((app, index) => app.desktopIndex = index);
    // 开始渲染
    this.renderShortcut();
  }


  /** 设置快捷方式 */
  public setShortcut(appList: App[]) {
    // 先按规则排序
    this.newAppList = appDesktopSort(appList).map(item => Object.assign({}, item));
    // 渲染快捷方式
    this.renderShortcut();
  }

  /** 设置桌面应用图标大小 */
  public setShortcutSize(size: DesktopAppSize) {
    this.__shortcutSize = size
    return this
  }
  /** 设置桌面应用字体颜色 */
  public setTextColor(color: string) {
    this.__textColor = color
    return this
  }
  /** 设置图标对齐方式 */
  public setAlignAoto(alignAuto: boolean) {
    this.__alignAuto = alignAuto;
    return this
  }

  /** 监听快捷方式渲染 */
  public onShortcutRender(fn: (data: Shortcut[]) => void) {
    this.methods.onShortcutRender = fn;
    return this
  }
  /** 监听应用属性改变 */
  public onAppOptionChange(fn: (data: App[]) => void) {
    this.methods.onAppOptionChange = fn;
    return this
  }

}
