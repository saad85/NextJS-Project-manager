import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const prisma = new PrismaClient();

// Signup Validation Schema
const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.string().optional(), // Defaults to 'user'
  organizationName: z
    .string()
    .min(3, "Organization name must be at least 3 characters"),
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .toLowerCase(),
});

export const signupService = async (data: any) => {
  // Validate data
  const validatedData = signupSchema.parse(data);
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    role,
    organizationName,
    subdomain,
  } = validatedData;

  // Check if email or phone already exists
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { phone }] },
  });
  if (existingUser) {
    throw new Error("Email or phone already in use");
  }

  // Check if subdomain exists
  const existingOrg = await prisma.organization.findUnique({
    where: { subdomain },
  });
  if (existingOrg) {
    throw new Error("Subdomain is already in use");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Find or create the role
  const roleName = role || "user";
  let userRole = await prisma.role.findUnique({ where: { name: roleName } });

  if (!userRole) {
    throw new Error("Role not found");
  }

  // Create Organization & Settings
  const organization = await prisma.organization.create({
    data: {
      name: organizationName,
      subdomain,
      settings: {
        create: {
          allowGuests: false,
          timezone: "UTC",
        },
      },
    },
  });

  // Create User and Associate with Organization
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      roleId: userRole.id,
      organizationId: organization.id,
    },
    select: {
      userId: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      organization: {
        select: { name: true, subdomain: true },
      },
    },
  });

  return user;
};
