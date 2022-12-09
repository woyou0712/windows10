import createElement from "new-dream/src/utils/createElement";
import { winIcon, quitIcon, setIcon, userIcon } from "../../svg";
import { UserInfo } from "../../types/windows";



/** Win菜单元素 */
export default class TaskbarWinEls {
  public winBox = createElement("windows10-taskbar-win");
  public winIcon = createElement("windows10-taskbar-win-icon");
  /** Win菜单 */
  public viewBox = createElement("windows10-taskbar-win-view");;
  // 左侧小菜单
  public viewLeft = createElement("windows10-taskbar-win-view-left");
  public leftContent = createElement("win-view-left-content");
  public userInfo = createElement("win-view-left-content-item");
  public userIcons = createElement("win-view-left-content-item-icon");
  public userName = createElement("win-view-left-content-item-name");
  public setter = createElement("win-view-left-content-item");
  public setIcons = createElement("win-view-left-content-item-icon");
  public setName = createElement("win-view-left-content-item-name");
  public quit = createElement("win-view-left-content-item");
  public quitIcons = createElement("win-view-left-content-item-icon");
  public quitName = createElement("win-view-left-content-item-name");
  // 中间区域的应用列表
  public viewConten = createElement("windows10-taskbar-win-view-content");
  // 右侧开始屏幕
  public viewRight = createElement("windows10-taskbar-win-view-right");

  private nickName?: string
  private avatarType?: "svg" | "image";
  private avatar?: string;
  constructor() {
    // 装载用户信息
    this.__avatar = userIcon;
    this.__nickName = "用户"
    // 设置图文
    this.setIcons.innerHTML = setIcon;
    this.setName.innerText = "设置"
    // 退出图文
    this.quitIcons.innerHTML = quitIcon;
    this.quitName.innerText = "退出"

    // 组装左侧小菜单
    this.userInfo.appendChild(this.userIcons);
    this.userInfo.appendChild(this.userName);
    this.leftContent.appendChild(this.userInfo);
    this.setter.appendChild(this.setIcons);
    this.setter.appendChild(this.setName);
    this.leftContent.appendChild(this.setter);
    this.quit.appendChild(this.quitIcons);
    this.quit.appendChild(this.quitName);
    this.leftContent.appendChild(this.quit);
    this.viewLeft.appendChild(this.leftContent);
    // 组装大盒子
    this.viewBox.appendChild(this.viewLeft);
    this.viewBox.appendChild(this.viewConten);
    this.viewBox.appendChild(this.viewRight);
    // 将窗口装入到WIN盒子中
    this.winIcon.innerHTML = winIcon;
    this.winBox.appendChild(this.winIcon);
    this.winBox.appendChild(this.viewBox);
    // 监听事件
    // 点击切换显示win菜单
    this.winIcon.addEventListener("click", () => {
      this.viewBox.classList.toggle("show");
    })
    this.winBox.setAttribute("tabindex", "0"); // 允许获得焦点
    // 失去焦点关闭win菜单
    this.winBox.addEventListener("blur", () => {
      this.viewBox.classList.remove("show");
    })
  }

  private get __nickName() {
    return this.nickName
  }
  private set __nickName(v) {
    if (v && v !== this.nickName) {
      this.userName.innerText = v;
      this.nickName = v
    }
  }

  private get __avatar() {
    return this.avatar
  }
  private set __avatar(v) {
    if (v && v !== this.avatar) {
      // 如果头像类型是图片
      if (this.avatarType === "image") {
        let avatar = document.getElementById("windows10-taskbar-avatar") as HTMLImageElement;
        if (!avatar) {
          avatar = createElement({ name: "img", id: 'windows10-taskbar-avatar' }) as HTMLImageElement;
          this.userIcons.appendChild(avatar)
        }
        if (v && v !== this.avatar) {
          avatar.setAttribute("src", v)
        }
      } else {
        // 否则按SVG处理
        if (v && v !== this.avatar) {
          this.userIcons.innerHTML = v
        }
      }
      this.avatar = v
    }
  }

  /**
   * 渲染用户信息
   */
  public renderUserInfo(userInfo: UserInfo) {
    this.__nickName = userInfo.nickName
    this.avatarType = userInfo.avatarType
    this.__avatar = userInfo.avatar
    return this
  }

}