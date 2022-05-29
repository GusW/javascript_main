// type is merely an alias to another type
type AdressLine = string

type ContactBirthDate = Date | number | string

// alternative to interface extension
// interface ContactDetailsAndAdress extends ContactDetails, ContactAddress {}
type ContactDetailsAndAdressType = ContactDetails & ContactAddress

// alternative to enums
type ContactStatusType = 'active' | 'inactive' | 'new'

// only contains keys of ContactInterface
type ContactFields = keyof ContactInterface

type AwesomeId = ContactInterface['id']

// Helper generic type "Partial" - all props are optional
type ContactQuery = Partial<Record<keyof ContactInterface, Query>>

// Helper on restricting certain props
type ContactQueryLimited = Omit<
  Partial<Record<keyof ContactInterface, Query>>,
  'address' | 'status'
>

// Helper on making only certain props available
type ContactQuerySomePropsOnly = Partial<
  Pick<Record<keyof ContactInterface, Query>, 'id' | 'name'>
>

// Helper on making all props required
type RequiredContactQuery = Required<ContactQuerySomePropsOnly>
