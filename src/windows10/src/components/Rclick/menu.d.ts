export interface MenuItem {
  id: string | number
  icon?: string | HTMLImageElement
  name: string
  method: (el?: HTMLElement) => void
}

export type MenuSattus = "block" | "none"