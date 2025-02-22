import { URL } from 'url'

const config = {
  qa: {
    host: `all-api-qa-ibot.nocell.io`,
    authHost: `auth.relaygo.info`,
    id: `RScqSh4k`,
    secret: `LU64MEJ8Byij3J38`,
  },
  pro: {
    host: `all-main-pro-ibot.nocell.io`,
    authHost: `auth.relaygo.com`,
    id: ``,
    secret: ``,
  }
}

export class Vars {
  get env(): `qa`|`pro` {
    if (process.env.RELAY_ENV) {
      if (process.env.RELAY_ENV !== `qa` && process.env.RELAY_ENV !== `pro`) {
        throw new Error(`RELAY_ENV must be set to either "qa" or "pro"`)
      } else {
        return process.env.RELAY_ENV
      }
    } else {
      return `qa`
    }
  }

  get host(): string {
    const h = process.env.RELAY_HOST || config[this.env].host
    if (!h.includes(this.env)) {
      process.env.RELAY_ENV && console.error(`RELAY_ENV=${process.env.RELAY_ENV}`)
      process.env.RELAY_HOST && console.error(`RELAY_HOST=${process.env.RELAY_HOST}`)
      console.error(`Host and environment must align`)
      throw new Error(`Environment / host mismatch`)
    } else {
      return h
    }

  }

  get apiUrl(): string {
    return this.host.startsWith(`http`) ? this.host : `https://${this.host}`
  }

  get apiHost(): string {
    if (this.host.startsWith(`http`)) {
      const u = new URL(this.host)
      if (u.host) return u.host
    }
    return `${this.host}`
  }

  get authHost(): string {
    return config[this.env].authHost
  }

  get authUrl(): string {
    return `https://${this.authHost}`
  }

  get authId(): string {
    return config[this.env].id
  }

  get authCodeId(): string {
    return `Rk7Qq5jp`
  }

  get authSecret(): string {
    return config[this.env].secret
  }

  get authRedirectUri(): string {
    return `http://localhost:8080/authorization-code/callback`
  }

  get stratusUrl(): string {
    return `https://api-d.republicdev.info/stratus/rest`
  }
}

export const vars = new Vars()
