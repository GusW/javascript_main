interface ContactDetails {
  birthDate: ContactBirthDate
}

interface ContactAddress {
  adressLine1: AdressLine
  adressLine2: AdressLine
}

interface ContactDetailsAndAdress extends ContactDetails, ContactAddress {}

interface AddressInterface {
  line1: AdressLine
  line2?: AdressLine
  province: string
  region: string
  postalCode: string
}

interface ContactInterface extends AddressInterface {
  id: number
  name: string
  birthDate: ContactBirthDate
  someOptionaField?: string
  status: ContactStatus
  statusAsType?: ContactStatusType
}

let primaryContact: ContactInterface
primaryContact = {
  id: 12345,
  name: 'Joe Doe',
  birthDate: new Date('1900-01-01'),
  status: ContactStatus.ACTIVE,
  line1: 'Rue Morgue',
  province: 'Chihuaha',
  region: 'Everest',
  postalCode: 'PXO-XYZ000',
}

interface ContactEvent {
  contactId: ContactInterface['id']
}

interface ContactDeletedEvent extends ContactEvent {}

interface ContactStatusChangedEvent extends ContactEvent {
  oldStatus: ContactInterface['status']
  newStatus: ContactInterface['status']
}

interface ContactEvents {
  deleted: ContactDeletedEvent
  statusChanged: ContactStatusChangedEvent
  // ... and so on
}

interface Query {
  sort?: 'asc' | 'desc'
  matches(val: any): boolean
}
