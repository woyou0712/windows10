import createElement from "new-dream/src/utils/createElement";

class TaskbarTime {
  public box: HTMLElement
  private time: HTMLElement
  private date: HTMLElement
  constructor() {
    this.box = createElement("windows10-taskbar-datetime");
    this.time = createElement("windows10-taskbar-datetime-time");
    this.date = createElement("windows10-taskbar-datetime-date");
    this.box.appendChild(this.time);
    this.box.appendChild(this.date);
    this.setTime()
    setInterval(() => { this.setTime() }, 1000)
  }
  private setTime() {
    const d = new Date();
    const M = d.getMonth() + 1;
    const D = d.getDate();
    const h = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds();
    this.time.innerText = `${h >= 10 ? h : "0" + h}:${m >= 10 ? m : "0" + m}:${s >= 10 ? s : "0" + s}`;
    this.date.innerText = `${d.getFullYear()}/${M >= 10 ? M : "0" + M}/${D >= 10 ? D : "0" + D}`;
  }
}

export default TaskbarTime