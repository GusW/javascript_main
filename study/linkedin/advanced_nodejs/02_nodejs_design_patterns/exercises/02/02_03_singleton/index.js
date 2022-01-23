import logger from "./Logger.js"
import Shopper from "./Shopper.js"
import Store from "./Store.js"

logger.log("starting app...")

var alex = new Shopper("alex", 500)
var ski_shop = new Store("Steep and Deep Supplies", [
  {
    item: "Downhill Skis",
    qty: 5,
    price: 750,
  },
  {
    item: "Knit Hat",
    qty: 20,
    price: 5,
  },
])

logger.log("finished config...")

console.log(`${logger.count} logs total`)
logger.logs.map((log) => console.log(`   ${log.message}`))
