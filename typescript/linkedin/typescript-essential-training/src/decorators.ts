interface Contact {
  id: number
}

const currentUser = {
  id: 1234,
  roles: ['ContactEditor'],
  isAuthenticated(): boolean {
    return true
  },
  isInRole(role: string): boolean {
    return this.roles.contains(role)
  },
}

const authorize =
  (role: string) =>
  (target: any, property: string, descriptor: PropertyDescriptor) => {
    const wrapped = descriptor.value

    descriptor.value = function () {
      if (!currentUser.isAuthenticated()) {
        throw Error('User is not authenticated')
      }
      if (!currentUser.isInRole(role)) {
        throw Error(`User not in role ${role}`)
      }

      try {
        return wrapped.apply(this, arguments)
      } catch (ex) {
        // TODO: some fancy logging logic here
        throw ex
      }
    }
  }

const freeze = (constructor: Function) => {
  Object.freeze(constructor)
  Object.freeze(constructor.prototype)
}

const singleton = <T extends { new (...args: any[]): {} }>(constructor: T) =>
  class Singleton extends constructor {
    private static instance = null

    constructor(...args) {
      super(...args)
      if (Singleton.instance) {
        throw Error('Duplicated instance')
      }

      Singleton.instance = this
    }
  }

const auditable = (target: object, key: string | symbol) => {
  // get the initial value, before the decorator is applied
  let val = target[key]

  // then overwrite the property with a custom getter and setter
  Object.defineProperty(target, key, {
    get: () => val,
    set: (newVal) => {
      console.log(`${key.toString()} changed: `, newVal)
      val = newVal
    },
    enumerable: true,
    configurable: true,
  })
}

@freeze
@singleton
class ContactRepository {
  @auditable
  private contacts: Contact[] = []

  @authorize('ContactViewer')
  getContactById(id: number): Contact | null {
    const contact = this.contacts.find((x) => x.id === id)
    return contact
  }

  @authorize('ContactEditor')
  save(contact: Contact): void {
    const existing = this.getContactById(contact.id)

    if (existing) {
      Object.assign(existing, contact)
    } else {
      this.contacts.push(contact)
    }
  }
}
