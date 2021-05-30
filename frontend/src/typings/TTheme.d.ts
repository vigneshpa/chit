import TTheme from "@/theme"
declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
      $TTheme:TTheme
    }
  }