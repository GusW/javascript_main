import { LargePersonListItem } from './people/LargePersonListItem'
import { LargeProductListItem } from './products/LargeProductListItem'
import { Modal } from './Modal'
import { NumberedList } from './NumberedList'
import { RegularList } from './RegularList'
import { SmallPersonListItem } from './people/SmallPersonListItem'
import { SmallProductListItem } from './products/SmallProductListItem'
import { SplitScreen } from './SplitScreen'
import { people, products } from './utils/dummyData'

const LeftHandComponent = ({ children, name }) => (
  <>
    <h1 style={{ backgroundColor: 'green' }}>{name}</h1>
    {children}
  </>
)

const RightHandComponent = ({ children, message }) => (
  <>
    <p style={{ backgroundColor: 'red' }}>{message}!</p>
    {children}
  </>
)

const App = () => (
  <>
    <Modal>
      <LargeProductListItem product={products[0]} />
    </Modal>
    <SplitScreen leftWeight={1} rightWeight={3}>
      <LeftHandComponent name="Foo">
        <RegularList
          items={people}
          resourceName="person"
          itemComponent={SmallPersonListItem}
        />
        <RegularList
          items={products}
          resourceName="product"
          itemComponent={SmallProductListItem}
        />
      </LeftHandComponent>
      <RightHandComponent message="Bar">
        <NumberedList
          items={people}
          resourceName="person"
          itemComponent={LargePersonListItem}
        />
        <NumberedList
          items={products}
          resourceName="product"
          itemComponent={LargeProductListItem}
        />
      </RightHandComponent>
    </SplitScreen>
  </>
)

export default App
