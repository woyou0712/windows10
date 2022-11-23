import { Menu, Message, MessageBox, Win } from "new-dream";
import { dirSvg, disSvg, indSvg } from "new-dream/src/svg/button";
import createElement from "new-dream/src/utils/createElement";
import { defaultOptions } from "../defaultData";
import { appIcon } from "../svg";
import { DesktopAppSize, DesktopBackground } from "../types/style.d";
import { App, DesktopOption, District, SettingOpenFn, SettingPageType, Shortcut } from "../types/windows.d";
import getNearNumIndex from "../utils/getNearNumIndex";

interface ViewSize { width: number; height: number }

/** 桌面APP列表 */
class DesktopAppEls {
  /** 桌面盒子 */
  public box: HTMLElement;
  /** 拖拽遮罩层 */
  private shade: HTMLElement;
  /** 快捷方式列表 */
  private shortcutList: Shortcut[] = [];

  /** 是否网格对齐 */
  private alignAuto = true;
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

  private methods = {
    onAppChange: (data: App[]) => { console.log("应用数据发生变化", data) }
  }
  constructor() {
    this.box = createElement("windows10-desktop-app-box");
    this.shade = createElement("windows10-desktop-app-shade");
    this.__alignAuto = true;
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
      this.viewSize = Object.assign({}, v)
      this.sliceDesktop(v); // 桌面大小发生变化，切割桌面
    }
  }

  private get __alignAuto() {
    return this.alignAuto
  }

  private set __alignAuto(v) {
    // 如果是设置网格对其
    if (v && !this.alignAuto) {
      // 
    }
    this.alignAuto = v;
  }

  /** 设置图标大小 */
  private setAppIconSize(size: DesktopAppSize) {
    console.log("设置桌面图标大小")
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
  }

  /** 切割桌面 */
  private sliceDesktop(viewSize: ViewSize) {
    console.log("切割桌面网格")
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
  private setShortcutPosition(appList: App[]) {
    // 将所有网格对象置空
    this.districtList.forEach(colnum => { colnum.forEach(row => row.occupy = false) })
    // 为快捷方式添加坐标
    if (this.alignAuto) {
      // 如果是自动对齐，直接按序添加
      appList.forEach((app) => {
        const district = this.getDistrict();
        app.desktopX = district.x;
        app.desktopY = district.y;
        district.occupy = true; // 标记占用
      })
    } else {
      // 如果不是自动对齐，则按自定义坐标就近插入网格
      // 没有坐标的APP列表
      const notPositionApp: App[] = [];
      appList.forEach((app) => {
        if (app.desktopX && app.desktopY) {
          // 先将有坐标的应用放入对应的网格
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
        const district = this.getDistrict();
        app.desktopX = district.x;
        app.desktopY = district.y;
        district.occupy = true; // 标记占用
      })
    }
    // 和已经渲染的快捷方式作比较,判断是否需要重新渲染
    let isUpdate = false;
    for (let i = 0; i < appList.length; i++) {
      const app = appList[i], shortcut = this.shortcutList[i];
      if (!shortcut) {
        isUpdate = true;
        break
      }
      if (app.id !== shortcut.id || app.title !== shortcut.title || app.desktopX !== shortcut.desktopX || app.desktopY !== shortcut.desktopY) {
        console.log(app.id, shortcut.id)
        isUpdate = true;
        break
      }
    }
    if (isUpdate) {
      console.log("新的应用数据和旧的应用数据有差异。渲染快捷方式")
      // 渲染快捷方式
      this.renderShortcut(appList);
    }
  }
  /**
   * 清除桌面应用
   */
  private removeShortcut() {
    for (let i = this.shortcutList.length - 1; i >= 0; i--) {
      this.box.removeChild(this.shortcutList[i].shortcutEls); // 移除视图元素
      this.shortcutList.splice(i, 1); // 移除储存的快捷方式对象
    }
  }
  /**
   * 在桌面添加应用
   */
  private appendShortcut(app: App) {
    const appBox = createElement("windows10-desktop-app-item");
    // 加载位置属性
    appBox.style["left"] = `${app.desktopX}px`
    appBox.style["top"] = `${app.desktopY}px`
    const icon = createElement("windows10-desktop-app-icon-box");
    if (typeof app.icon === "string") {
      icon.innerHTML = app.icon
    } else if (app.icon.nodeName) {
      icon.appendChild(app.icon)
    }
    const title = createElement("windows10-desktop-app-title");
    title.innerText = app.title;
    appBox.appendChild(icon);
    appBox.appendChild(title);
    this.box.appendChild(appBox);
    const shortcut = Object.assign({ shortcutEls: appBox }, app)
    this.shortcutList.push(shortcut);
  }

  /** 渲染应用快捷方式 */
  private renderShortcut(appList: App[]) {
    console.log("开始渲染快捷方式")
    // 清除之前的应用
    this.removeShortcut();
    // 重新加载快捷方式
    appList.forEach((app) => {
      this.appendShortcut(app)
    })
    this.methods.onAppChange(appList)
    return this
  }


  /** 设置快捷方式 */
  public setShortcut(appList: App[]) {
    const vw = this.box.offsetWidth, vh = this.box.offsetHeight;
    // 设置桌面大小
    this.__viewSize = { width: vw, height: vh };
    // 设置快捷方式坐标
    this.setShortcutPosition(appList);
  }

  /** 设置桌面应用图标大小 */
  public setShortcutSize(size: DesktopAppSize) {
    this.__shortcutSize = size
    return this
  }
  /** 设置桌面应用字体颜色 */
  public setTextColor(color: string) {
    this.box.style["color"] = color;
    return this
  }
  /** 设置自动对齐 */
  public setAlignAoto(alignAuto: boolean) {
    this.alignAuto = alignAuto;
    return this
  }

  /** 监听事件 */
  public onAppChange(fn: (data: App[]) => void) {
    this.methods.onAppChange = fn;
    return this
  }
}


/** 桌面元素 */
export default class DesktopEls {
  public box = createElement("windows10-desktop");
  private background = createElement("windows10-desktop-background");
  private desktopApp: DesktopAppEls;
  private methods = {
    openSetting: (type?: SettingPageType) => { console.log("打开设置") },
  };

  private backgroundOption?: DesktopBackground;
  constructor() {
    Win.defaultContentBox = this.box; // 将弹窗组件的顶级盒子设定为桌面
    Message.defaultContentBox = this.box; // 将消息提示框的默认盒子设定为桌面
    MessageBox.defaultContentBox = this.box;
    this.desktopApp = new DesktopAppEls();
    this.box.appendChild(this.desktopApp.box);
    this.box.appendChild(this.background);
    this.setRmenu();
  }

  private get __backgroundOption() {
    return this.backgroundOption
  }

  private set __backgroundOption(v) {
    let oldOption = this.backgroundOption; // 旧的配置项
    let isUpdate = false;
    if (!v) {
      v = Object.assign({}, defaultOptions.desktop.theme.background);
      isUpdate = true;
    } else if (!oldOption) {
      oldOption = Object.assign({}, defaultOptions.desktop.theme.background);
      isUpdate = true;
    } else if (v.type === "color" && oldOption.type === "color") {
      // 如果都是是纯色,判断是否有更新
      if (v.backgroundColor !== oldOption.backgroundColor) {
        isUpdate = true
      }
    } else if (v.type === "image" && oldOption.type === "image") {
      // 如果都是背景图片,判断是否有更新
      if (v.backgroundImage !== oldOption.backgroundImage || v.backgroundPosition !== oldOption.backgroundPosition || v.backgroundRepeat !== oldOption.backgroundRepeat || v.backgroundSize !== oldOption.backgroundSize) {
        isUpdate = true
      }
    } else {
      // 如果类型不一样, 重新渲染
      isUpdate = true
    }
    // 如果有更新，重新渲染
    if (isUpdate) { this.renderBackground(v) }
    this.backgroundOption = Object.assign({}, v);
  }

  /** 渲染背景 */
  private renderBackground(background: DesktopBackground) {
    console.log("渲染桌面背景")
    if (background.type === "image") {
      this.background.style["backgroundImage"] = `url(${background.backgroundImage})`
      if (background.backgroundSize) {
        this.background.style["backgroundSize"] = background.backgroundSize
      }
      if (background.backgroundRepeat) {
        this.background.style["backgroundRepeat"] = background.backgroundRepeat
      }
      if (background.backgroundPosition) {
        this.background.style["backgroundPosition"] = background.backgroundPosition
      }
    } else if (background.type === "color") {
      this.background.style["backgroundColor"] = background.backgroundColor;
      this.background.style["backgroundImage"] = "none"
    } else {
      console.error("桌面背景配置项异常！")
    }
  }
  /**
   * 设置右键菜单
   */
  private setRmenu() {
    const option = [
      {
        id: 0,
        name: "新建应用",
        icon: appIcon,
        method: () => {
          console.log("你点击了【新建应用】")
        }
      },
      {
        id: 1,
        name: "快捷方式自动对齐",
        method: () => {
          console.log("你点击了【快捷方式自动对齐】")
        }
      },
      {
        id: 2,
        name: "取消自动对齐",
        method: () => {
          console.log("你点击了【取消自动对齐】")
        }
      },
      {
        id: 3,
        name: "重载(F5)",
        method: function () {
          location.reload()
        }
      },
      {
        id: 4,
        icon: disSvg,
        name: "显示设置",
        method: () => {
          this.methods.openSetting("system");
        }
      },
      {
        id: 4,
        icon: indSvg,
        name: "个性化",
        method: () => {
          this.methods.openSetting("individuation");
        }
      },
    ]
    new Menu(this.box, option)
  }


  /**
   * 设置背景
   */
  public setBackground(background: DesktopBackground) {
    this.__backgroundOption = background
    return this
  }
  /**
   * 更新视图
   */
  public updateView(option: DesktopOption) {
    if (option.theme) {
      /** 设置桌面背景 */
      this.setBackground(option.theme.background);
      /**  设置快捷方式图标大小 、设置字体颜色 、设置网格自动对齐 */
      this.desktopApp.setShortcutSize(option.theme.shortcutSize).setTextColor(option.theme.color).setAlignAoto(option.alignAuto);
    }
  }
  /**
   * 设置应用快捷方式
   */
  public setAppShortcut(appList: App[]) {
    /** 设置桌面快捷方式 */
    this.desktopApp.setShortcut(appList)
    return this
  }

  /** 事件监听 */
  public onEvent({ onAppChange, openSetting }: { onAppChange: (data: App[]) => void, openSetting: SettingOpenFn }) {
    this.methods.openSetting = openSetting
    this.desktopApp.onAppChange(onAppChange)
    return this
  }
}