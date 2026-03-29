
class Stack {
    constructor() {
        this.items = [];
    }

    // Add element to top of stack
    push(element) {
        this.items.push(element);
        return this.items;
    }

    // Take element from top of stack
    pop() {
        if (this.isEmpty()) return "Underflow";
        return this.items.pop();
    }

    // Return top element
    peek() {
        if (this.isEmpty()) return "No elements in Stack";
        return this.items[this.items.length - 1];
    }

    // Check if stack is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Return underlying array
    getItems() {
        return this.items;
    }

    // Clear stack
    clear() {
        this.items = [];
        return this.items;
    }
}

export default Stack;
