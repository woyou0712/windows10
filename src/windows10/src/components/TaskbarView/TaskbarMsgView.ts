import createElement from "new-dream/src/utils/createElement";
import { messageIcon } from "../../svg";

/** 任务栏消息视图 */
export default class TaskbarMsgView {
  public messageBox = createElement("windows10-taskbar-message");
  constructor() {
    this.messageBox.innerHTML = messageIcon;
  }
}
