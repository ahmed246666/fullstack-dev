/**
 * Item Service - In-Memory Database Layer
 * Simulates database interactions for CRUD operations on items.
 */

class ItemService {
  constructor() {
    this.items = [
      {
        id: 1,
        title: "REST API Principles Guide",
        category: "Backend",
        description: "Comprehensive guide to HTTP methods, status codes, and API design.",
        status: "completed",
        createdAt: "2026-08-01T10:00:00.000Z",
        updatedAt: "2026-08-01T10:00:00.000Z"
      },
      {
        id: 2,
        title: "Express.js Routing & Middleware",
        category: "Node.js",
        description: "Hands-on practice building controllers, custom middleware, and error handlers.",
        status: "in-progress",
        createdAt: "2026-08-02T11:30:00.000Z",
        updatedAt: "2026-08-02T11:30:00.000Z"
      },
      {
        id: 3,
        title: "SQL vs NoSQL Foundations",
        category: "Database",
        description: "Understanding relational schema designs versus document collections.",
        status: "planned",
        createdAt: "2026-08-02T14:15:00.000Z",
        updatedAt: "2026-08-02T14:15:00.000Z"
      }
    ];
    this.nextId = 4;
  }

  /**
   * Get all items with optional filtering by category or status
   */
  getAllItems(filters = {}) {
    let result = [...this.items];

    if (filters.category) {
      result = result.filter(
        item => item.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.status) {
      result = result.filter(
        item => item.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    return result;
  }

  /**
   * Find item by ID
   */
  getItemById(id) {
    const numericId = parseInt(id, 10);
    return this.items.find(item => item.id === numericId) || null;
  }

  /**
   * Create a new item
   */
  createItem(data) {
    const newItem = {
      id: this.nextId++,
      title: data.title.trim(),
      category: data.category.trim(),
      description: data.description ? data.description.trim() : "",
      status: data.status || "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.items.push(newItem);
    return newItem;
  }

  /**
   * Update existing item by ID
   */
  updateItem(id, data) {
    const numericId = parseInt(id, 10);
    const index = this.items.findIndex(item => item.id === numericId);

    if (index === -1) {
      return null;
    }

    const currentItem = this.items[index];
    const updatedItem = {
      ...currentItem,
      title: data.title !== undefined ? data.title.trim() : currentItem.title,
      category: data.category !== undefined ? data.category.trim() : currentItem.category,
      description: data.description !== undefined ? data.description.trim() : currentItem.description,
      status: data.status !== undefined ? data.status : currentItem.status,
      updatedAt: new Date().toISOString()
    };

    this.items[index] = updatedItem;
    return updatedItem;
  }

  /**
   * Delete item by ID
   */
  deleteItem(id) {
    const numericId = parseInt(id, 10);
    const index = this.items.findIndex(item => item.id === numericId);

    if (index === -1) {
      return false;
    }

    this.items.splice(index, 1);
    return true;
  }
}

module.exports = new ItemService();
