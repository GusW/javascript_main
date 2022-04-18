export default class ConversationService {
  static #generateEmptyConversation = () => ({
    entities: {},
    followUp: '',
    complete: false,
    exit: false,
  })

  static #handleReservationIntent = (context) => {
    if (context.conversation.entities.intent === 'reservation') {
      return ConversationService.intentReservation(context)
    }
  }

  static #handleBye = (context) => {
    if (context.conversation.entities.bye) {
      delete context.conversation.entities.bye
      context.conversation.followUp =
        'Looking foward to hearing from you again, soon!'
      context.conversation.exit = true
      return true
    }
  }

  static #handleGreeting = (context) => {
    if (context.conversation.entities.greetings) {
      delete context.conversation.entities.greetings
      context.conversation.followUp =
        'Hello, this is Siri! How may I help you today?'
      return true
    }
  }

  static run = async ({ witService, text, context }) => {
    let conversation =
      context?.conversation || ConversationService.#generateEmptyConversation()

    if (!text) {
      context.conversation = {
        ...conversation,
        followUp: 'Hey you!',
      }
      return context
    }

    const witEntities = await witService.query(text)
    context.conversation = {
      ...conversation,
      entities: {
        ...conversation.entities,
        ...witEntities,
      },
    }

    const isGreeting = ConversationService.#handleGreeting(context)
    const isBye = ConversationService.#handleBye(context)
    if (isGreeting || isBye) return context

    const isReservationIntent =
      ConversationService.#handleReservationIntent(context)
    if (isReservationIntent) return isReservationIntent

    context.conversation = {
      ...conversation,
      followUp: 'Could you rephrase that?',
    }
    return context
  }

  static intentReservation = (context) => {
    let { conversation } = context
    const { entities } = conversation
    const { reservationDateTime, numberOfGuests, customerName } = entities

    if (!reservationDateTime) {
      conversation = {
        ...conversation,
        followUp: 'For when would you like to make your reservation?',
      }
    } else if (!numberOfGuests) {
      conversation = {
        ...conversation,
        followUp: 'For how many persons?',
      }
    } else if (!customerName) {
      conversation = {
        ...conversation,
        followUp: 'Would you tell me your name please?',
      }
    } else {
      conversation = { ...conversation, complete: true }
    }
    context = { ...context, conversation }
    return context
  }
}
