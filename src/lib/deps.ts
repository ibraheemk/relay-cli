/* eslint-disable quotes */
import CLI = require('cli-ux')
import HTTP = require('http-call')

import apiClient = require('./api-client')
import file = require('./file')
import flags = require('./flags')
/* eslint-enable quotes */

import Conf from 'conf'

const config = new Conf()
const susbscriberConfig = new Conf({
  configName: `subscriber`,
})

export const deps = {
  get cli(): typeof CLI.default { return fetch(`cli-ux`).default },
  get HTTP(): typeof HTTP { return fetch(`http-call`) },
  get APIClient(): typeof apiClient.APIClient { return fetch(`./api-client`).APIClient },
  get file(): typeof file { return fetch(`./file`) },
  get flags(): typeof flags { return fetch(`./flags`) },
  get config(): Conf<Record<string, unknown>> { return config },
  get susbscriberConfig(): Conf<Record<string, unknown>> { return susbscriberConfig },
}

const cache: Record<string, any> = {} // eslint-disable-line @typescript-eslint/no-explicit-any

function fetch(s: string) {
  if (!cache[s]) {
    cache[s] = require(s)
  }
  return cache[s]
}

export default deps
