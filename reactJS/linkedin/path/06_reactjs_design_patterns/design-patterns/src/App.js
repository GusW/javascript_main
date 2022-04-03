// Chapter 1
import { LargePersonListItem } from './components/people/LargePersonListItem.js'
import { LargeProductListItem } from './components/products/LargeProductListItem.js'
import { Modal } from './components/Modal.js'
import { NumberedList } from './components/NumberedList.js'
import { RegularList } from './components/RegularList.js'
import { SmallPersonListItem } from './components/people/SmallPersonListItem.js'
import { SmallProductListItem } from './components/products/SmallProductListItem.js'
import { SplitScreen } from './components/SplitScreen.js'
import { people, products } from './utils/dummyData.js'
// Chapter 2
import axios from 'axios'
import { CurrentUserLoader } from './containers/CurrentUserLoader.js'
import { DataSource } from './containers/DataSource.js'
import { ProductInfo } from './components/products/ProductInfo.js'
import { ResourceLoader } from './containers/ResourceLoader.js'
import { UserInfo } from './components/people/UserInfo.js'
import { UserLoader } from './containers/UserLoader.js'
// Chapter 3

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

const _getServerData = (url) => async () => {
  const response = await axios.get(url)
  return response.data
}

const _getLocalStorageData = (key) => () => localStorage.getItem(key)

const Text = ({ message }) => <h1>{message}</h1>

const App = () => (
  <>
    {/* Chapter 2 - Container Components */}
    <>
      {/* Loads 1 specific user from server */}
      <>
        <CurrentUserLoader>
          <UserInfo />
        </CurrentUserLoader>
      </>
      {/* Loads users from server */}
      <>
        <UserLoader userId="234">
          <UserInfo />
        </UserLoader>
        <UserLoader userId="345">
          <UserInfo />
        </UserLoader>
      </>
      {/* Loads resources specifying their type and url */}
      <>
        <ResourceLoader resourceUrl="/users/234" resourceName="user">
          <UserInfo />
        </ResourceLoader>
        <ResourceLoader resourceUrl="/products/1234" resourceName="product">
          <ProductInfo />
        </ResourceLoader>
      </>
      {/* Loads resources abstracting whem from */}
      <>
        <DataSource
          getDataFunc={_getServerData('/users/123')}
          resourceName="user"
        >
          <UserInfo />
        </DataSource>
        <DataSource
          getDataFunc={_getLocalStorageData('message')}
          resourceName="message"
        >
          <Text />
        </DataSource>
      </>
    </>
    {/* Chapter 1 - Layout Components */}
    <>
      {/* Show Modal */}
      <>
        <Modal>
          <LargeProductListItem product={products[0]} />
        </Modal>
      </>
      {/* Reusable split screen and lists */}
      <>
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
    </>
  </>
)

export default App
