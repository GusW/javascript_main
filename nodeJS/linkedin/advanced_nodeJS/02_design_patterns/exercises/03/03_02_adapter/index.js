import localStorageAdapter from "./LocalStorageAdapter.js"

console.log("localStorage length: ", localStorageAdapter.length)

const uid = localStorageAdapter.getItem("user_id")

console.log("user_id: ", uid)

if (!uid) {
  console.log("User ID not found. Setting the user id and token...")
  localStorageAdapter.setItem(
    "token",
    "TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
  )
  localStorageAdapter.setItem("user_id", "12345")
} else {
  console.log("User ID found.", uid)
  console.log("clearning the User ID...")
  localStorageAdapter.clear()
}
