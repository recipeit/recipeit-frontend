import { Component } from 'vue'

export type IconWeight = 'regular' | 'semiBold' | 'bold' | 'custom'

export type IconSet = {
  [key in IconWeight]?: {
    [key: string]: Component
  }
}
