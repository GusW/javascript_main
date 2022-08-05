# Advanced Node for Developers

Diagrams: <https://www.diagrams.net/>

## 1 - Internals

### 1.1 - Node Internals

![Internals](./images/internals_01.png)
![Internals](./images/internals_02.png)
![Internals](./images/internals_03.png)

### 1.2 - Implementations

![Implementations](./images/implementations_01.png)
![Implementations](./images/implementations_02.png)
![Implementations](./images/implementations_03.png)
![Implementations](./images/implementations_04.png)
![Implementations](./images/implementations_05.png)
![Implementations](./images/implementations_06.png)

### 1.3 - C++

![C++](./images/cpp_01.png)
![C++](./images/cpp_02.png)
![C++](./images/cpp_03.png)
![C++](./images/cpp_04.png)

### 1.4 - Threads

![Threads](./images/threads_01.png)
![Threads](./images/threads_02.png)
![Threads](./images/threads_03.png)
![Threads](./images/threads_04.png)
![Threads](./images/threads_05.png)
![Threads](./images/threads_06.png)

### 1.5 - Event Loop

![Event Loop](./images/event_loop_01.png)

```javascript
// node myFile.js

const pendingTimers = []
const pendingOSTasks = []
const pendingOperations = []

// new timers, tasks, operations are recorded from myFile running
myFile.runContents()

const shouldContinue = () => {
  /*
  #1: Any pending setTimeout, setInterval, setImmediate

  #2: Any pendingOSTasks (e.g server listening to port)

  #3: Any pendingOperations (e.g fs module)
  **/
  return (
    pendingTimers.length || pendingOSTasks.length || pendingOperations.length
  )
}

// Entire body executes in one TICK
while (shouldContinue()) {
  /*
  #1 Node checks pendingTimers and if there are any functions ready to be called - callbacks

  #2 Node checks pendingOSTasks and if there are any functions ready to be called - callbacks

  #3 Node checks pendingOperations and if there are any functions ready to be called - callbacks

  #4 Pause execution. continue when:
  - timer is about to complete
  - pendingOSTask is done
  - pendingOperation is done

  #5 Look at pendingTimers. Call any setImmediate

  #6 Handle any 'close' events eg readStream.on('close' => {...})

  **/
}
```

### 1.6 - Single-Threaded?

![Single Threaded](./images/single_threaded_01.png)
![Single Threaded](./images/single_threaded_02.png)
![Single Threaded](./images/single_threaded_03.png)
![Single Threaded](./images/single_threaded_04.png)

```javascript
import { performance } from 'perf_hooks'
import crypto from 'crypto'

const start = performance.now()
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('1: ', performance.now() - start)
  // 917.1989880055189
})

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('2: ', performance.now() - start)
  // 945.7754510045052
})
```

### 1.7 - Libuv Thread Pool

#### Default: 4 threads

![Libuv Thread Pool](./images/libuv_thread_pool_01.png)

### 1.8 - Threadpools with Multithreading

![Multithreading](./images/multithreading_01.png)
![Multithreading](./images/multithreading_02.png)
![Multithreading](./images/multithreading_03.png)
![Multithreading](./images/multithreading_04.png)
![Multithreading](./images/multithreading_05.png)
![Multithreading](./images/multithreading_06.png)

```javascript
import { performance } from 'perf_hooks'
import crypto from 'crypto'

const start = performance.now()
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('1: ', performance.now() - start)
  // 893.1103910058737
})

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('2: ', performance.now() - start)
  // 869.9508370012045
})

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('3: ', performance.now() - start)
  // 915.4592999964952
})

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('4: ', performance.now() - start)
  // 945.7754510045052
})

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('5: ', performance.now() - start)
  // 1597.9073330014944
})
```

### 1.9 - Changing Threadpool size

![Threadpool Size](./images/threadpool_size_01.png)

```javascript
// Default: 4 threads
process.env.UV_THREADPOOL_SIZE = 2
```

![Threadpool Questions](./images/threadpool_questions_01.png)

### 1.10 - OS Operations

![Libuv OS Delegation](./images/libuv_os_delegation_01.png)

```javascript
import https from 'https'
import { performance } from 'perf_hooks'

const init = performance.now()

const doRequest = () =>
  https
    .request('https://www.google.com', (res) => {
      res.on('data', () => {})
      res.on('end', () => {
        console.log(performance.now() - init)
      })
    })
    .end()

doRequest() // 385.8212580084801
doRequest() // 386.08700999617577
doRequest() // 387.06043699383736
doRequest() // 387.2905650138855
doRequest() // 387.4232259988785
```

![OS/Async Questions](./images/os_async_questions_01.png)

### 1.11 - Event Loop Review

#### Tick: one execution of the event loop

![Event Loop Review](./images/event_loop_review_01.png)

### 1.12 - Unexpeted Event Loop Behavior

```javascript
import { performance } from 'perf_hooks'
import crypto from 'crypto'
import https from 'https'
import fs from 'fs'
import path from 'path'

const start = performance.now()
const BASE_DIR = path.resolve()

const doHash = (id) =>
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log(`${id}: `, performance.now() - start)
  })

const doRequest = () =>
  https
    .request('https://www.google.com', (res) => {
      res.on('data', () => {})
      res.on('end', () => {
        console.log(performance.now() - start)
      })
    })
    .end()

doRequest()

console.log(path.resolve())
fs.readFile(path.join(BASE_DIR, 'sandbox.js'), 'utf8', () => {
  console.log('FS:', performance.now() - start)
})

doHash(1)
doHash(2)
doHash(3)
doHash(4)

/*
Request:    259.59928500652313 
Hash 2:     693.1666750013828 
FS:         694.0922180116177 
Hash 1:     707.5694110095501 
Hash 3:     761.2291159927845 
Hash 4:     775.8082939982414 
**/
```

#### If threadpool size is increased to 5

```javascript
process.env.UV_THREADPOOL_SIZE = 5
/*
FS:         94.0922180116177 
Request:    259.59928500652313 
Hash 2:     693.1666750013828 
Hash 1:     707.5694110095501 
Hash 3:     761.2291159927845 
Hash 4:     775.8082939982414 
**/
```

![Unexpected Event Loop Behavior](./images/unexpected_ev_loop_behavior_01.png)
![Unexpected Event Loop Behavior](./images/unexpected_ev_loop_behavior_02.png)
![Unexpected Event Loop Behavior](./images/unexpected_ev_loop_behavior_03.png)
![Unexpected Event Loop Behavior](./images/unexpected_ev_loop_behavior_04.png)
![Unexpected Event Loop Behavior](./images/unexpected_ev_loop_behavior_05.png)
![Unexpected Event Loop Behavior](./images/unexpected_ev_loop_behavior_06.png)

## 2 - Enhance Node Performance

### 2.1 Clustering

#### Normal app

![Clustering](./images/clustering_01.png)
![Clustering](./images/clustering_03.png)

#### Clustered app

![Clustering](./images/clustering_02.png)
![Clustering](./images/clustering_04.png)

### 2.2 Benchmarking Server Performance

```bash
ab -c 50 -n 500 localhost:3000/fast
```

### 2.3 Forking

![Forking](./images/forking_01.png)
![Forking](./images/forking_02.png)
![Forking](./images/forking_03.png)
![Forking](./images/forking_04.png)

### 2.4 PM2

#### <https://pm2.io/>

```bash
npm i -G pm2

# -i 0 => let PM2 decide the amount of logical cores
# logical core = physical core * amount of simultaneous threads
pm2 start index.js -i 0
```

#### Common commmands

```bash
pm2 list

pm2 show <name>

pm2 monit

pm2 delete <name>
```

### 2.5 Webworker Threads

![Threading](./images/threading_01.png)
