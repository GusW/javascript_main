export class SlackContext {
  #channel
  #user
  #thread_ts
  constructor({ channel, user, thread_ts }) {
    this.#channel = channel
    this.#user = user
    this.#thread_ts = thread_ts
  }

  get channel() {
    return this.#channel
  }

  get user() {
    return this.#user
  }

  get thread_ts() {
    return this.#thread_ts
  }

  serialized = () => ({
    channel: this.channel,
    user: this.user,
    thread_ts: this.thread_ts,
  })
}

export class ConversationContext {
  #entities
  #followUp
  #complete
  #exit
  constructor() {
    this.#entities = {}
    this.#followUp = ''
    this.#complete = false
    this.#false = false
  }

  get entities() {
    return this.#entities
  }

  set entities(newEntities) {
    this.#entities = { ...this.#entities, ...newEntities }
  }

  get followUp() {
    return this.#followUp
  }

  set followUp(newFollowUp) {
    this.#followUp = newFollowUp
  }

  get complete() {
    return this.#complete
  }

  toggleIsIncomplete = () => (this.#complete = false)
  toggleIsComplete = () => (this.#complete = true)

  get exit() {
    return this.#exit
  }

  toggleShouldNotExit = () => (this.#exit = false)
  toggleShouldExit = () => (this.#exit = true)
}

export default class SessionContext {
  #slack
  #conversation
  constructor({ channel = '', user = '', thread_ts = '' }) {
    this.#slack = new SlackContext(channel, user, thread_ts)
    this.#conversation = new ConversationContext()
  }

  get slack() {
    return this.#slack
  }

  get conversation() {
    return this.#conversation
  }
}
