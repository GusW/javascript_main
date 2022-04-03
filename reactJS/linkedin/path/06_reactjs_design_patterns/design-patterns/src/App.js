// Chapter 1
import { LargePersonListItem } from './components/people/LargePersonListItem.js'
import { LargeProductListItem } from './components/products/LargeProductListItem.js'
import { Modal } from './components/UncontrolledModal.js'
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
import { useState } from 'react'
import { UncontrolledForm } from './components/UncontrolledForm.js'
import { ControlledForm } from './components/ControlledForm.js'
import { ControlledModal } from './components/ControlledModal.js'
import { UncontrolledOnboardingFlow } from './components/UncontrolledOnboardingFlow.js'
import { ControlledOnboardingFlow } from './components/ControlledOnboardingFlow.js'
// Chapter 4
import { printProps } from './components/printProps.js'
import { withUser } from './containers/withUser.js'
import { UserInfoForm } from './components/UserInfoForm.js'
// Chapter 5
import { UserInfoWithuseCurrentUser } from './components/people/UserInfoWithuseCurrentUser.js'
import { UserInfoWithuseUser } from './components/people/UserInfoWithuseUser.js'
import { UserInfoWithuseResource } from './components/people/UserInfoWithuseResource.js'
import { ProductInfoWithuseResource } from './components/products/ProductInfoWithuseResource.js'
import { UserInfoWithuseDataSource } from './components/people/UserInfoWithuseDataSource.js'
// Chapter 6
import { nestedObject } from './utils/dummyData.js'
import { RecursiveComponent } from './components/RecursiveComponent.js'
import { DangerButton, BigSuccessButton } from './components/composition.js'
import {
  DangerButtonPartial,
  BigSuccessButtonPartial,
} from './components/partiallyApply.js'

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

const StepOne = ({ goToNext }) => (
  <>
    <h1>Step 1</h1>
    <button onClick={() => goToNext({ name: 'John Doe' })}>Next</button>
  </>
)
const StepTwo = ({ goToNext, goToPrevious }) => (
  <>
    <h1>Step 2</h1>
    <button onClick={goToPrevious}>Previous</button>
    <button onClick={() => goToNext({ age: 100 })}>Next</button>
  </>
)
const StepThree = ({ goToNext, goToPrevious }) => (
  <>
    <h1>Step 3</h1>
    <button onClick={goToPrevious}>Previous</button>
    <button onClick={() => goToNext({ hairColor: 'brown' })}>Next</button>
  </>
)

const StepFour = ({ goToNext, goToPrevious }) => (
  <>
    <h1>Step 4</h1>
    <button onClick={goToPrevious}>Previous</button>
    <button onClick={() => goToNext({ hairColor: 'brown' })}>Next</button>
  </>
)

const UserInfoWrapped = printProps(UserInfo)

const UserInfoWithLoader = withUser(UserInfo, '234')

const App = () => {
  // Controlled Modal
  const [shouldShowModal, setShouldShowModal] = useState(false)

  // Controlled Onboarding Flow
  const [onboardingData, setOnboardingData] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const _onNext = (stepData) => {
    setOnboardingData({ ...onboardingData, ...stepData })
    setCurrentIndex(currentIndex + 1)
  }
  const _onPrevious = () => {
    setCurrentIndex(currentIndex - 1)
  }

  return (
    <>
      {/* Chapter 6 - Functional Programming */}
      <>
        <h2>Chapter 6</h2>
        {/* RecursiveComponent */}
        <>
          <RecursiveComponent data={nestedObject} />
        </>
        {/* Composition */}
        <>
          <DangerButton text="Don't do it!" />
          <BigSuccessButton text="Yes!!!" />
        </>
        {/* Partial */}
        <>
          <br />
          <DangerButtonPartial text="No partail!" />
          <BigSuccessButtonPartial text="Partial" />
        </>
      </>
      {/* Chapter 5 - Custom hooks */}
      <>
        <h2>Chapter 5</h2>
        {/* useCurrentUser Hook */}
        <>
          <UserInfoWithuseCurrentUser />
        </>
        {/* useUser Hook */}
        <>
          <UserInfoWithuseUser userId={234} />
        </>
        {/* useResource Hook */}
        <>
          <UserInfoWithuseResource userId="123" />
          <ProductInfoWithuseResource productId="1234" />
        </>
        {/* useDataSource Hook */}
        <>
          <UserInfoWithuseDataSource userId="345" />
        </>
      </>
      {/* Chapter 4 - Higher-Order Components */}
      <>
        <h2>Chapter 4</h2>
        {/* Printing props with HOC */}
        <>
          <UserInfoWrapped a={1} b="Hello" c={{ name: 'Gus' }} />
        </>
        {/* Loading data with HOC */}
        <>
          <UserInfoWithLoader />
        </>
        {/* Forms with HOC */}
        <>
          <UserInfoForm />
        </>
      </>
      {/* Chapter 3 - Controlled and Uncontrolled Components */}
      <>
        <h2>Chapter 3</h2>
        {/* Uncontrolled only exposes its internal state on a "final" event */}
        <>
          <UncontrolledForm />
        </>
        {/* Controlled handles changes on the fly */}
        <>
          <ControlledForm />
        </>
        {/* Controlled modal - opposed to the implementation in Chapter 1 */}
        <>
          <ControlledModal
            shouldShow={shouldShowModal}
            onRequestClose={() => setShouldShowModal(false)}
          >
            <Text message={'Hello FooBar'} />
          </ControlledModal>
          <button onClick={() => setShouldShowModal(!shouldShowModal)}>
            {shouldShowModal ? 'Hide Modal' : 'Show Modal'}
          </button>
        </>
        {/* Uncontrolled onboarding flow - parent component has little to none control over its execution */}
        <>
          <UncontrolledOnboardingFlow
            onFinish={(data) => {
              console.log(data)
              alert('Onboarding complete!')
            }}
          >
            <StepOne />
            <StepTwo />
            <StepThree />
          </UncontrolledOnboardingFlow>
        </>
        {/* Controlled onboarding flow - controlling changes over the flow */}
        <>
          <ControlledOnboardingFlow
            currentIndex={currentIndex}
            onNext={_onNext}
            onPrevious={_onPrevious}
          >
            <StepOne />
            <StepTwo />
            {onboardingData.age >= 62 && <StepThree />}
            <StepFour />
          </ControlledOnboardingFlow>
        </>
      </>
      {/* Chapter 2 - Container Components */}
      <>
        <h2>Chapter 2</h2>
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
        <h2>Chapter 1</h2>
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
}

export default App
