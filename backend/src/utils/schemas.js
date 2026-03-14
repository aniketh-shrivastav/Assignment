import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const nameRegex = /^[a-zA-Z\s'\-]+$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters")
      .regex(
        nameRegex,
        "Name can only contain letters, spaces, hyphens and apostrophes",
      ),
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email("Please enter a valid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters")
      .max(128, "Password must be at most 128 characters")
      .regex(
        passwordRegex,
        "Password must contain at least one letter and one number",
      ),
    role: z
      .enum(["user", "admin"], {
        errorMap: () => ({ message: "Role must be 'user' or 'admin'" }),
      })
      .optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email("Please enter a valid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters")
      .max(128, "Password must be at most 128 characters"),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const createProductSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required" })
      .trim()
      .min(1, "Title cannot be empty")
      .max(120, "Title must be at most 120 characters"),
    description: z
      .string()
      .trim()
      .max(1000, "Description must be at most 1000 characters")
      .optional()
      .default(""),
    price: z
      .number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a valid number",
      })
      .min(0, "Price cannot be negative"),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const updateProductSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(1, "Title cannot be empty")
        .max(120, "Title must be at most 120 characters")
        .optional(),
      description: z
        .string()
        .trim()
        .max(1000, "Description must be at most 1000 characters")
        .optional(),
      price: z
        .number({ invalid_type_error: "Price must be a valid number" })
        .min(0, "Price cannot be negative")
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid product id"),
  }),
  query: z.object({}),
});

export const productIdParamSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid product id"),
  }),
  query: z.object({}),
});
