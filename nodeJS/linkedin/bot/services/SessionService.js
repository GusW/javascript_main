export default class SessionService {
  constructor() {
    this.sessions = {}
    this.timeout = 60 * 5
  }

  static now = () => {
    return Math.floor(new Date() / 1000)
  }

  static #unpackEvent = (event) => {
    const { channel, user, thread_ts, ts } = event
    return {
      channel,
      user,
      thread_ts: thread_ts || ts,
    }
  }

  static #createSessionId = ({ channel = '', user = '', thread_ts = '' }) =>
    [channel, user, thread_ts].join('-')

  static #getSessionIdFromEvent = (event) => {
    const { channel, user, thread_ts } = SessionService.#unpackEvent(event)
    return SessionService.#createSessionId({ channel, user, thread_ts })
  }

  create = (event) => {
    this.#cleanup()

    const { channel, user, thread_ts } = SessionService.#unpackEvent(event)
    const sessionId = SessionService.#createSessionId({
      channel,
      user,
      thread_ts,
    })
    const newSession = {
      timestamp: SessionService.now(),
      context: {
        slack: {
          channel,
          user,
          thread_ts,
        },
      },
    }

    this.sessions = {
      ...this.sessions,
      [sessionId]: newSession,
    }

    return newSession
  }

  get = (event) => {
    this.#cleanup()

    const sessionId = SessionService.#getSessionIdFromEvent(event)
    if (!this.sessions.hasOwnProperty(sessionId)) return false

    this.update(sessionId)
    return this.sessions[sessionId]
  }

  delete = (sessionId) => {
    const { [sessionId]: _, ...otherSessions } = this.sessions
    if (!sessionId) return false

    this.sessions = otherSessions
    return true
  }

  update = (sessionId) => {
    this.#cleanup()

    const { [sessionId]: sessionData } = this.sessions
    if (!sessionData) return false

    const updatedSession = { ...sessionData, timestamp: SessionService.now() }

    this.sessions = { ...this.sessions, [sessionId]: { ...updatedSession } }
    return updatedSession
  }

  #cleanup = () => {
    const now = SessionService.now()

    Object.entries(this.sessions).forEach((key, sessionData) => {
      if (sessionData.timestamp + this.timeout < now) {
        this.delete(key)
      }
    })
    return true
  }

  handleSessionFromEvent = (event) => this.get(event) || this.create(event)
}
