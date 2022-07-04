/**
A linked list is a data structure that holds objects arranged in a linear order, this order is determined by a pointer.
Unlike an array, a linked list doesn't provide constant-time access to a particular index,
you have to iterate through the list to find an element,
on the other hand, is possible to add and remove items from the beginning of the list in a constant time.
Linked lists can be used to implement other data structures, such as stacks, queues, and graphs.

There are some types of linked lists:

Singly linked list - Each node has only a pointer to the next node.
Doubly linked list - Each node has pointers to both the previous and next node.
Circular linked list - The last node points to the first element.
 */

class Node<T> {
  data: T
  next: Node<T> | null = null

  constructor(data: T) {
    this.data = data
  }
}

class NodeDoubly<T> {
  data: T
  previous: NodeDoubly<T> | null = null
  next: NodeDoubly<T> | null = null

  constructor(data: T) {
    this.data = data
  }
}

class LinkedList<T> {
  head: Node<T> | null = null
  comparator: (a: T, b: T) => boolean

  constructor(comparator: (a: T, b: T) => boolean) {
    this.comparator = comparator
  }

  append(data: T): void {
    if (!this.head) {
      this.head = new Node(data)
    } else {
      let current = this.head
      while (current.next !== null) {
        current = current.next
      }
      current.next = new Node(data)
    }
  }

  delete(data: T): void {
    if (!this.head) return

    // Check if the head node is the node to be removed
    if (this.comparator(this.head.data, data)) {
      this.head = this.head.next
      return
    }

    let current = this.head.next
    let previous = this.head

    /**
     * Search for the node to be removed and keep track of its previous node
     *
     * If it were a double linked list, we could simply search the node
     * and it would have a pointer to the previous node
     **/
    while (current) {
      if (this.comparator(current.data, data)) {
        current = null
      } else {
        previous = current
        current = current.next
      }
    }

    /**
     * set previous.next to the target.next, if the node target is not found,
     * the 'previous' will point to the last node,
     * since the last node hasn't next, nothing will happen
     **/
    previous.next = previous.next ? previous.next.next : null
  }

  search(data: T): Node<T> | null {
    let current = this.head
    while (current) {
      if (this.comparator(current.data, data)) {
        return current
      }
      current = current.next
    }
    return null
  }

  traverse() {
    let current = this.head
    while (current != null) {
      console.log(current.data)
      current = current.next
    }
  }
}

export {}
