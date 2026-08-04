/**
 * Item Service - Multi-Stack Data Abstraction & Query Processing Layer
 * Handles pagination, search filtering, sorting, and CRUD business logic.
 */

class ItemService {
  constructor() {
    this.items = [
      {
        id: 1,
        title: "Enterprise Architecture Patterns",
        category: "Backend",
        description: "Guide to Controller-Service-Repository multi-layer architecture.",
        price: 49.99,
        stock: 25,
        status: "active",
        createdAt: "2026-08-01T09:00:00.000Z",
        updatedAt: "2026-08-01T09:00:00.000Z"
      },
      {
        id: 2,
        title: "Node.js Express Performance Tuning",
        category: "Node.js",
        description: "Optimizing Event Loop, stream processing, and HTTP caching headers.",
        price: 39.99,
        stock: 12,
        status: "active",
        createdAt: "2026-08-01T10:30:00.000Z",
        updatedAt: "2026-08-01T10:30:00.000Z"
      },
      {
        id: 3,
        title: "PostgreSQL & Prisma Integration",
        category: "Database",
        description: "Designing relational schemas, migrations, indexes, and connection pooling.",
        price: 59.99,
        stock: 8,
        status: "active",
        createdAt: "2026-08-02T14:00:00.000Z",
        updatedAt: "2026-08-02T14:00:00.000Z"
      },
      {
        id: 4,
        title: "Microservices Messaging with RabbitMQ",
        category: "Backend",
        description: "Asynchronous event-driven architecture and message queue patterns.",
        price: 64.99,
        stock: 5,
        status: "draft",
        createdAt: "2026-08-02T16:20:00.000Z",
        updatedAt: "2026-08-02T16:20:00.000Z"
      },
      {
        id: 5,
        title: "Docker & Containerization Best Practices",
        category: "DevOps",
        description: "Multi-stage Docker builds, environment variables, and Docker Compose.",
        price: 44.99,
        stock: 30,
        status: "active",
        createdAt: "2026-08-03T08:15:00.000Z",
        updatedAt: "2026-08-03T08:15:00.000Z"
      }
    ];
    this.nextId = 6;
  }

  /**
   * Get paginated items list with filtering, searching, and sorting
   */
  getAllItems(options = {}) {
    const {
      search = '',
      category = '',
      status = '',
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = options;

    let result = [...this.items];

    // 1. Keyword Search (title or description)
    if (search && search.trim() !== '') {
      const query = search.trim().toLowerCase();
      result = result.filter(
        item =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    // 2. Category Filter
    if (category && category.trim() !== '') {
      result = result.filter(
        item => item.category.toLowerCase() === category.trim().toLowerCase()
      );
    }

    // 3. Status Filter
    if (status && status.trim() !== '') {
      result = result.filter(
        item => item.status.toLowerCase() === status.trim().toLowerCase()
      );
    }

    // 4. Sorting
    result.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    // 5. Pagination Math
    const total = result.length;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const totalPages = Math.ceil(total / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = result.slice(startIndex, startIndex + limitNum);

    return {
      items: paginatedItems,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    };
  }

  /**
   * Find single item by ID
   */
  getItemById(id) {
    const numericId = parseInt(id, 10);
    return this.items.find(item => item.id === numericId) || null;
  }

  /**
   * Create new item record
   */
  createItem(data) {
    const newItem = {
      id: this.nextId++,
      title: data.title.trim(),
      category: data.category.trim(),
      description: data.description ? data.description.trim() : "",
      price: parseFloat(data.price) || 0,
      stock: parseInt(data.stock, 10) || 0,
      status: data.status || "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.items.push(newItem);
    return newItem;
  }

  /**
   * Update existing item (Full Replace PUT)
   */
  updateItem(id, data) {
    const numericId = parseInt(id, 10);
    const index = this.items.findIndex(item => item.id === numericId);

    if (index === -1) return null;

    const currentItem = this.items[index];
    const updatedItem = {
      id: numericId,
      title: data.title.trim(),
      category: data.category.trim(),
      description: data.description ? data.description.trim() : "",
      price: parseFloat(data.price) || 0,
      stock: parseInt(data.stock, 10) || 0,
      status: data.status || "active",
      createdAt: currentItem.createdAt,
      updatedAt: new Date().toISOString()
    };

    this.items[index] = updatedItem;
    return updatedItem;
  }

  /**
   * Partial Update (PATCH)
   */
  patchItem(id, data) {
    const numericId = parseInt(id, 10);
    const index = this.items.findIndex(item => item.id === numericId);

    if (index === -1) return null;

    const currentItem = this.items[index];
    const updatedItem = {
      ...currentItem,
      ...(data.title !== undefined && { title: data.title.trim() }),
      ...(data.category !== undefined && { category: data.category.trim() }),
      ...(data.description !== undefined && { description: data.description.trim() }),
      ...(data.price !== undefined && { price: parseFloat(data.price) }),
      ...(data.stock !== undefined && { stock: parseInt(data.stock, 10) }),
      ...(data.status !== undefined && { status: data.status }),
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

    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }
}

module.exports = new ItemService();
