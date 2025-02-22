import { isEmpty, size, map } from 'lodash'
import cli from 'cli-ux'

import debugFn from 'debug'

import deps from './deps'
import { vars } from './vars'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AutoComplete, Select } = require('enquirer') // eslint-disable-line quotes

const debug = debugFn(`login`)

export interface Subscriber {
  id: string,
  email: string,
  name: string,
}

export interface User {
  email: string
}

export interface AccountEnvelope {
  account: Account
}

export interface Account {
  account_name: string
  subscriber_id: string
  owner_email: string
}

export interface Tokens {
  access_token: string,
  refresh_token?: string
}

export interface TokenAccount extends Tokens {
  username?: string
}

export type SessionTokens = Record<string, TokenAccount>

export interface Session {
  subscriber: Subscriber
}

export const getSession = (): Session => {
  return deps.config.get(`session`) as Session
}

export const clearConfig = (): void => {
  deps.config.clear()
}

export const deleteSession = (): void => {
  deps.config.delete(`session`)
}

export const clearSubscribers = (): void => {
  deps.susbscriberConfig.clear()
}

export const getToken = (host: string = vars.apiHost): TokenAccount | undefined => {
  const tokens = deps.config.get(`session.tokens`) as SessionTokens
  return tokens?.[host]
}

export const setToken = (token: TokenAccount, host: string = vars.apiHost): void => {
  const tokens: SessionTokens = (deps.config.get(`session.tokens`) || {}) as SessionTokens
  tokens[host] = token
  deps.config.set(`session.tokens`, tokens)
}


export const saveSubscribers = (subscribers: Subscriber[]): void => {
  deps.susbscriberConfig.set(`all`, subscribers)
}

export const getSubscribers = (): Subscriber[] => {
  const subscribers = deps.susbscriberConfig.get(`all`) as Subscriber[]
  if (isEmpty(subscribers)) {
    throw new Error(`no saved subscribers`)
  }
  return subscribers
}

export const saveDefaultSubscriber = (subscriber: Subscriber): void => {
  deps.config.set(`session.subscriber`, subscriber)
}

export const getDefaultSubscriber = (): Subscriber => {
  const subscriber = deps.config.get(`session.subscriber`)
  if (subscriber === undefined) {
    throw new Error(`no default subscriber set`)
  } else {
    return subscriber as Subscriber
  }
}

export const getDefaultSubscriberId = (): string => {
  return getDefaultSubscriber().id
}

export const resolveSubscriber = async (subscribers: Subscriber[]=getSubscribers()): Promise<boolean> => {
  debug(subscribers)
  const subscribersSize = size(subscribers)
  if (subscribersSize === 1 && subscribers[0]) {
    saveDefaultSubscriber(subscribers[0])
    return true
  } else {
    const selector =  (subscribersSize > 25) ? AutoComplete : Select
    const subscriberPrompt = new selector({
      multiple: false,
      name: `subscriber`,
      message: `Pick your default Relay account`,
      choices: map(subscribers, (subscriber, value) => ({ name: `${subscriber.name} (${subscriber.id})`, value })),
      limit: 10,
    })

    const subscriberIdx: number = await subscriberPrompt.run()
    debug(`choosen index`, subscriberIdx)

    const subscriber = subscribers[subscriberIdx]
    if (subscriber) {
      debug(`choosen subscriber`, subscriber)
      saveDefaultSubscriber(subscriber)
      if (subscribersSize > 1) {
        cli.log(`=====================`)
        cli.log(`Default Relay Account`)
        cli.log(`${subscriber.name} (${subscriber.id})`)
        cli.log(`=====================`)
      }
      return true
    } else {
      return false
    }
  }
}
