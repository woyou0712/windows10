import { baiduIcon, githubIcon, userIcon } from "./svg";
import { desktopImage0, desktopImage1, desktopImage2, loginImage } from "./images";
import { WindowsOption } from "./types/windows";

/**
 * 默认配置项
 */
export const defaultOptions: WindowsOption = {
  userInfo: {
    nickName: "小妖",
    avatar: userIcon,
    avatarType: "svg"
  },
  taskbar: {
    theme: { backgroundColor: "#444444", color: "#FFFFFF" },
    direaction: "bottom",
    queryStatus: "show"
  },
  desktop: {
    theme: {
      background: {
        type: "image",
        backgroundImage: desktopImage0,
        backgroundPosition: "center",
        backgroundRepeat: "repeat",
        backgroundSize: "100% 100%",
      },
      backgroundList: ["http://demo.bauble.vip/bg001.jpg"],
      color: "#ffffff",
      shortcutSize: "mini",
    },
    alignAuto: true
  },
}

export const defaultAppList = [
  {
    id: "windows10-git-hub",
    title: "GitHub",
    maxBtn: true,
    miniBtn: true,
    resize: true,
    icon: githubIcon,
    url: "https://github.com/woyou0712",
    desktopShow: true,
  },
  {
    id: "windows10-bai-du",
    title: "百度",
    maxBtn: true,
    miniBtn: true,
    resize: true,
    icon: baiduIcon,
    url: "http://baidu.com",
    desktopShow: true,
  },
  {
    id: "windows10-git-hub",
    title: "GitHub",
    maxBtn: true,
    miniBtn: true,
    resize: true,
    icon: githubIcon,
    url: "https://github.com/woyou0712",
    desktopShow: true,
  },
]
