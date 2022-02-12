import { RecipeitGlobalComponents } from '@/components/base'

declare module 'vue' {
  export type GlobalComponents = {
    [key in keyof typeof RecipeitGlobalComponents]: typeof RecipeitGlobalComponents[key]
  }
}
