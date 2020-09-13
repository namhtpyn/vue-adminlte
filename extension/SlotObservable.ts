import { VNode } from 'vue'
import _ from 'lodash'
export function observe(v: Vue, callback: Function) {
  let oldSlot: any = v.$slots.default

  let interval = setInterval(() => {
    if (!_.isEqual(oldSlot, v.$slots.default)) {
      oldSlot = v.$slots.default
      callback()
    }
    if ((v as any)._isDestroyed) clearInterval(interval)
  }, 200)
}
