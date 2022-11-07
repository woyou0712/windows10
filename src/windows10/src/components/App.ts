import { Win } from "new-dream";
import { defaultConfig } from "new-dream/src/Win";
import { DefaultComputed } from "vue/types/options";
class App {
  private id?: string
  private title?: string
  private width?: string
  private height?: string
  private miniBtn?: boolean
  private maxBtn?: boolean
  private resize?: boolean
  private icon?: string | HTMLImageElement
  private props?: { [key: string]: any }
  private sandbox?: string[]
  private url?: string
  private component?: DefaultComputed

  constructor() {
    
  }
}

export default App