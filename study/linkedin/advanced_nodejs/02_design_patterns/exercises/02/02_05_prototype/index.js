import scout_prototype from "./scout_prototype.js"

const alex = scout_prototype.clone("Alex Banks")
alex.addItemToList("slingshot")

const eve = scout_prototype.clone("Eve Porcello")
eve.addItemToList("reading light")

console.log(`${alex.name}: ${alex.shoppingList}`)
console.log(`${eve.name}: ${eve.shoppingList}`)
