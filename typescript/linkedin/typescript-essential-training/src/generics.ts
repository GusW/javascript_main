const genericClone = <T>(source: T): T => ({ ...source })

const genericMutation = <T1, T2 extends T1>(source: T1): T2 =>
  Object.apply({}, source)

interface GenericInterface {
  foo: string
}

const gen: GenericInterface = {
  foo: 'bar',
}

const clonedGen = genericClone(gen)

interface GenericMutation extends GenericInterface {
  hey: number
}

const mutated = genericMutation<GenericInterface, GenericMutation>(gen)

interface GenericExample<TExternalID> {
  foo: string
  hey: number
  extra: TExternalID
}

const getValue = <T>(source: T, propertyName: keyof T) => source?.[propertyName]
