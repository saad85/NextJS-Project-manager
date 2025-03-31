import { PrismaClient } from "@prisma/client";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const JWT_SECRET = (process.env.JWT_SECRET as string) || "supersecretkey";
const JWT_EXPIRATION = (process.env.JWT_EXPIRATION as string) || "1h";

console.log("JWT_SECRET:", JWT_SECRET);
console.log("JWT_EXPIRATION:", JWT_EXPIRATION);

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
  console.log(data);
  //   const validatedData = signupSchema.parse(data);
  //   const {
  //     firstName,
  //     lastName,
  //     email,
  //     phone,
  //     password,
  //     role,
  //     organizationName,
  //     subdomain,
  //   } = validatedData;
  //   console.log("existingUser", validatedData);
  // Check if email or phone already exists
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email: data.email }, { phone: data.phone }] },
  });
  console.log("existingUser", existingUser);
  if (existingUser) {
    throw new Error("Email or phone already in use");
  }

  // Check if subdomain exists
  console.log("existingOrg", data.subDomain);
  const existingOrg = await prisma.organization.findUnique({
    where: { subdomain: data.subDomain },
  });
  console.log("existingOrg", existingOrg);
  if (existingOrg) {
    throw new Error("Subdomain is already in use");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Find or create the role
  const roleName = data.role || "User";
  let userRole = await prisma.role.findUnique({ where: { name: roleName } });

  console.log("userRole", userRole);

  if (!userRole) {
    // throw new Error("Role not found");
    userRole = await prisma.role.create({
      data: { name: roleName },
    });
  }

  console.log("userRole", userRole);
  // Create Organization & Settings
  const organization = await prisma.organization.create({
    data: {
      name: data.organizationName,
      subdomain: data.subDomain,
      settings: {
        create: {
          allowGuests: false,
          timezone: "UTC",
        },
      },
    },
  });

  console.log("organization", organization);

  // Create User and Associate with Organization
  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
    },
    select: {
      userId: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    },
  });

  // Create Organization User
  const createdOrganizationUser = await prisma.organizationUser.create({
    data: {
      userId: user.userId,
      organizationId: organization.id,
    },
    select: {
      userId: true,
      organizationId: true,
      id: true,
    },
  });

  console.log("createdOrganizationUser", createdOrganizationUser);

  // Create User Role
  const createdUserRole = await prisma.orgUserRole.create({
    data: {
      orgUserId: createdOrganizationUser.id,
      roleId: userRole.id,
      orgId: organization.id,
    },
  });

  console.log("createdUserRole", createdUserRole);

  console.log("user", user);

  return user;
};

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginService = async (data: any) => {
  //   const validatedData = loginSchema.parse(data);
  //   const { email, password } = validatedData;

  // Find user by email
  console.log("data", data);
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: {
      organizationUsers: {
        where: {
          organization: {
            subdomain: data.subDomain,
          },
        },
        include: {
          organization: true,
          orgUserRoles: true,
        },
      },
    },
  });

  console.log("user in login", user);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const passwordMatch = await bcrypt.compare(data.password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }

  const secretKey: jwt.Secret = Buffer.from(JWT_SECRET, "utf-8");

  const payload = {
    userId: user.userId,
    roleId: user.organizationUsers[0].orgUserRoles[0].roleId,
    orgId: user.organizationUsers[0].organizationId,
  };

  const signOptions: SignOptions = {
    expiresIn: "1h",
    algorithm: "HS256",
  };

  const token = jwt.sign(payload, secretKey, signOptions);

  return {
    token,
    user: {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      organization: {
        name: user.organizationUsers[0].organization.name,
        subdomain: user.organizationUsers[0].organization.subdomain,
      },
    },
  };
};
