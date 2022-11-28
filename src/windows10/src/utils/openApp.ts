import { Win } from "new-dream";
import { App } from "../types/windows.d";

export default function openApp(app: App) {
  if (app.component) {
    new Win({
      id: app.id,
      title: app.title,
      width: app.width,
      height: app.height,
      miniBtn: app.miniBtn,
      maxBtn: app.maxBtn,
      resize: app.resize,
      icon: app.icon,
      props: app.props,
      component: app.component,
    })
  } else if (app.url && app.externalWindow) {
    window.open(app.url);
  } else if (app.url) {
    new Win({
      id: app.id,
      title: app.title,
      width: app.width,
      height: app.height,
      miniBtn: app.miniBtn,
      maxBtn: app.maxBtn,
      resize: app.resize,
      icon: app.icon,
      url: app.url,
    })
  } else {
    console.error("应用数据异常，请检查应用数据", app)
  }
}