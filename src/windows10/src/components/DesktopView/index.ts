import { Message, MessageBox, Win, Menu } from "new-dream";
import { disSvg, indSvg } from "new-dream/src/svg/button";
import createElement from "new-dream/src/utils/createElement";
import { defaultOptions } from "../../defaultData";
import { appIcon } from "../../svg";
import { DesktopBackground } from "../../types/style";
import { App, DesktopOption, SettingOpenFn, SettingPageType } from "../../types/windows";
import DesktopOperationView from "./DesktopOperationView";

/** 桌面元素 */
export default class DesktopView {
  public box = createElement("windows10-desktop");
  private background = createElement("windows10-desktop-background");
  private desktopView: DesktopOperationView;
  private methods = {
    openSetting: (type?: SettingPageType) => { console.log("打开设置") },
  };

  private backgroundOption?: DesktopBackground;
  constructor() {
    this.desktopView = new DesktopOperationView();
    Win.defaultContentBox = this.desktopView.box; // 将弹窗组件的顶级盒子设定为桌面
    Message.defaultContentBox = this.box; // 将消息提示框的默认盒子设定为桌面
    MessageBox.defaultContentBox = this.box;
    this.box.appendChild(this.desktopView.box);
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
    if (isUpdate) {
      this.renderBackground(v)
    }
    this.backgroundOption = Object.assign({}, v);
  }

  /** 渲染背景 */
  private renderBackground(background: DesktopBackground) {
    console.log("【桌面背景】开始渲染")
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
        name: "自动对齐锁定",
        method: () => {
          this.desktopView.setAlignAoto(true);
        }
      },
      {
        id: 2,
        name: "解锁自动对齐",
        method: () => {
          this.desktopView.setAlignAoto(false);
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
      this.desktopView.setShortcutSize(option.theme.shortcutSize).setTextColor(option.theme.color).setAlignAoto(option.alignAuto);
    }
  }
  /**
   * 设置应用快捷方式
   */
  public setAppShortcut(appList: App[]) {
    /** 设置桌面快捷方式 */
    this.desktopView.setShortcut(appList)
    return this
  }

  /** 事件监听 */
  public onEvent({ onShortcutChange, openSetting }: { onShortcutChange: (data: App[]) => void, openSetting: SettingOpenFn }) {
    this.methods.openSetting = openSetting
    this.desktopView.onShortcutChange(onShortcutChange)
    return this
  }
}