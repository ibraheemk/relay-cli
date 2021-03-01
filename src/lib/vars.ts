import * as url from 'url'

export class Vars {
  get host(): string {
    return this.envHost || `all-main-qa-ibot.nocell.io`
  }

  get apiUrl(): string {
    return this.host.startsWith(`http`) ? this.host : `https://${this.host}`
  }

  get apiHost(): string {
    if (this.host.startsWith(`http`)) {
      const u = url.parse(this.host)
      if (u.host) return u.host
    }
    return `${this.host}`
  }

  get envHost(): string | undefined {
    return process.env.RELAY_HOST
  }

  get authUrl(): string {
    return process.env.RELAY_LOGIN_HOST || `https://auth.republicdev.info`
  }

  get authId(): string {
    return `RScqSh4k`
  }

  get authSecret(): string {
    return `LU64MEJ8Byij3J38`
  }
}

export const vars = new Vars()
