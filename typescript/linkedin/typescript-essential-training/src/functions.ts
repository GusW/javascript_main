const clone = (source: ContactInterface): ContactInterface => ({ ...source })

const cloneFunc = (_func: (source: ContactInterface) => ContactInterface) => {}

const whatever = { min: 1, max: 120 }

const tellMe = (source: typeof whatever) => {
  console.log(source)
}

const handleEvent = <T extends keyof ContactEvents>(
  eventName: T,
  handler: (evt: ContactEvents[T]) => void
) => {
  switch (eventName) {
    case 'statusChanged':
      handler({
        contactId: 1,
        oldStatus: ContactStatus.ACTIVE,
        newStatus: ContactStatus.INACTIVE,
      })
      break

    default:
      break
  }
}

const searchContacts = (contacts: ContactInterface[], query: ContactQuery) =>
  contacts.filter((contact) => {
    for (const property of Object.keys(contact) as (keyof ContactInterface)[]) {
      // get the query object for this property
      const propertyQuery = query[property]
      // check to see if it matches
      if (propertyQuery && propertyQuery.matches(contact[property])) {
        return true
      }
    }

    return false
  })

const filteredContacts = searchContacts(
  [
    /* contacts */
  ],
  {
    id: { matches: (id) => id === 123 },
    name: { matches: (name) => name === 'Carol Weaver' },
  }
)
