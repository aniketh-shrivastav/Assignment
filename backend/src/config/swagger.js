import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Internship Assignment API",
      version: "1.0.0",
      description: "Scalable REST API with JWT auth, RBAC, and Product CRUD",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            password: { type: "string", example: "strongpassword" },
            role: { type: "string", enum: ["user", "admin"], example: "user" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "john@example.com" },
            password: { type: "string", example: "strongpassword" },
          },
        },
        ProductRequest: {
          type: "object",
          required: ["title", "price"],
          properties: {
            title: { type: "string", example: "Wireless Mouse" },
            description: {
              type: "string",
              example: "Ergonomic and rechargeable",
            },
            price: { type: "number", example: 49.99 },
          },
        },
        ApiError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Validation failed" },
          },
        },
      },
    },
    paths: {
      "/api/v1/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterRequest" },
              },
            },
          },
          responses: {
            201: { description: "User registered" },
            409: { description: "Email already exists" },
          },
        },
      },
      "/api/v1/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            200: { description: "Login success" },
            401: { description: "Invalid credentials" },
          },
        },
      },
      "/api/v1/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Get current user",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Current user profile" },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/v1/products": {
        get: {
          tags: ["Products"],
          summary: "List products (admin: all, user: own)",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Product list" },
          },
        },
        post: {
          tags: ["Products"],
          summary: "Create product",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductRequest" },
              },
            },
          },
          responses: {
            201: { description: "Product created" },
          },
        },
      },
      "/api/v1/products/admin/all": {
        get: {
          tags: ["Products"],
          summary: "Admin only: list all products",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "All products" },
            403: { description: "Access denied" },
          },
        },
      },
      "/api/v1/products/{id}": {
        get: {
          tags: ["Products"],
          summary: "Get product by id",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Product found" },
            404: { description: "Not found" },
          },
        },
        put: {
          tags: ["Products"],
          summary: "Update product by id",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductRequest" },
              },
            },
          },
          responses: {
            200: { description: "Product updated" },
          },
        },
        delete: {
          tags: ["Products"],
          summary: "Delete product by id",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Product deleted" },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);
