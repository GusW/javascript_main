import { Router } from 'express'
import { createEventAdapter } from '@slack/events-api'
import { WebClient } from '@slack/web-api'
import moment from 'moment'
import ConversationService from '../../services/ConversationService.js'

const router = Router()

export default (params) => {
  const { config, witService, sessionService, reservationService } = params

  const slackEvents = createEventAdapter(config.slack.signingSecret)
  const slackWebClient = new WebClient(config.slack.token)

  router.use('/events', slackEvents.requestListener())

  const processEvent = async (session, event) => {
    const mention = /<@[A-Z0-9]+>/
    const eventText = event.text.replace(mention, '').trim()

    const context = await ConversationService.run({
      witService,
      text: eventText,
      context: session.context,
    })

    const { complete, followUp, entities } = context?.conversation

    let text = ''
    if (!complete) {
      text = followUp
    } else {
      const { customerName, reservationDateTime, numberOfGuests } = entities

      const reservationResult = await reservationService.tryReservation(
        moment(reservationDateTime).unix(),
        numberOfGuests,
        customerName
      )
      text = reservationResult.success || reservationResult.error
    }

    if (
      session.context.conversation.exit ||
      session.context.conversation.complete
    ) {
      session.context.conversation = {}
    }

    return slackWebClient.chat.postMessage({
      text,
      channel: session?.context?.slack?.channel,
      thread_ts: session?.context?.slack?.thread_ts,
      username: 'Siri',
    })
  }

  const handleMention = async (event) => {
    const session = sessionService.handleSessionFromEvent(event)
    return await processEvent(session, event)
  }

  const handleMessage = async (event) => {
    const session = sessionService.get(event)
    return session ? await processEvent(session, event) : false
  }

  slackEvents.on('app_mention', handleMention)
  slackEvents.on('message', handleMessage)

  return router
}
