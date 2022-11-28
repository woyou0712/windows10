import { githubIcon, userIcon, blogsIcon, chromeIcon, calculatorIcon } from "./svg";
import { desktopImage0, desktopImage1, desktopImage2, loginImage } from "./images";
import { App, WindowsOption } from "./types/windows";
import Calculator from "./systemApps/Calculator.vue";
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
      shortcutSize: "default",
    },
    alignAuto: true
  },
}

export const defaultAppList:App[] = [
  {
    id: "windows10-git-hub",
    title: "GitHub",
    icon: githubIcon,
    url: "https://github.com/woyou0712",
    desktopShow: true,
    externalWindow: true,
  },
  {
    id: "windows10-bing",
    title: "必应",
    maxBtn: true,
    miniBtn: true,
    resize: true,
    icon: chromeIcon,
    url: "https://cn.bing.com",
    desktopShow: true,
  },
  {
    id: "windows10-bauble-blogs",
    title: "博客",
    maxBtn: true,
    miniBtn: true,
    resize: true,
    icon: blogsIcon,
    url: "http://www.bauble.vip/",
    desktopShow: true,
  },
  {
    id: "windows10-calculator",
    title: "计算器",
    desktopShow: true,
    icon: calculatorIcon,
    component:Calculator
  },
]
