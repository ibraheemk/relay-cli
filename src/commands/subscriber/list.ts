import { cli } from 'cli-ux'
import { Command } from '../../lib/command'

// eslint-disable-next-line quotes
import debugFn = require('debug')
import { getSubscribers } from '../../lib/session'

const debug = debugFn(`subscriber`)

export default class SubscriberList extends Command {
  static description = `list subscribers`

  async run(): Promise<void> {
    const subscribers = getSubscribers()

    debug(subscribers)

    cli.table(subscribers, {
      name:{},
      id: {},
    }, {
      printLine: this.log,
    })
  }
}
