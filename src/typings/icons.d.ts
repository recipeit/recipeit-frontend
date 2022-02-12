import { Component } from 'vue'

export type IconWeight = 'regular' | 'semi-bold' | 'bold' | 'custom'

export type IconSet = {
  [key in IconWeight]?: {
    [key: string]: Component
  }
}
