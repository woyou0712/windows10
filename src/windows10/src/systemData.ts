import { WindowsOptions } from "./types/windows.d";
import { userIcon } from "./svg";
import { desktopImage0, desktopImage1, desktopImage2, loginImage } from "./images";

/**
 * 默认配置项
 */
export const defaultOptions: WindowsOptions = {
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
        backgroundRepeat: "repeat"
      },
      color: "#ffffff",
      fontSize: "14px",
    },
  },
}

