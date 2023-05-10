import { Linkables, Properties } from '@/enums/auxiliary'
import { Watcher } from './Watcher'
import error from '@/ui/error'
import { throwError } from '@/helpers/miscellaneous'

export class Link {
  watcher: Watcher
  target: any
  property: Linkables
  id: string

  constructor(target: any, watcher: Watcher, property: Linkables) {
    this.target = target
    this.watcher = watcher
    this.property = property

    this.id = this.watcher.onChange((value: any) => {
      this.target[this.property] = value
      console.log('value now is: ', value)
    })
  }

  destroy() {
    this.watcher.removeListener(this.id)
  }
}

export default class CreateLink {
  link(property: Properties, watcher: Watcher) {
    console.log(property)
    if (property in Linkables) {
      return new Link(this, watcher, property as unknown as Linkables)
    } else {
      throwError('LinkError', `Property ${property} cannot be linked.`)
      return undefined
    }
  }
}
