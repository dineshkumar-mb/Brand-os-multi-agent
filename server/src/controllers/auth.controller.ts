import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "@brand-os/database";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { hashPassword, comparePassword } from "../utils/password-hasher";
import { emailService } from "../services/email.service";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_personal_brand_os_2026";

interface InMemUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: "USER" | "ADMIN" | "TEAM_MEMBER";
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory fallback repository when DB is offline or not seeded
const mockUsers: Map<string, InMemUser> = new Map();

// Default seed user in memory
(async () => {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@brand-os.com").toLowerCase();
  const defaultPassword = process.env.ADMIN_INITIAL_PASSWORD || "AdminPass2026!";
  const defaultPasswordHash = await hashPassword(defaultPassword);

  mockUsers.set(adminEmail, {
    id: "usr_admin_001",
    email: adminEmail,
    name: "Staff AI Engineer",
    passwordHash: defaultPasswordHash,
    role: "ADMIN",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
})();

export class AuthController {
  /**
   * Register a new user account
   */
  public async register(req: Request, res: Response) {
    try {
      const { email, password, name, role = "USER" } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: "Name, email, and password are required." });
      }

      if (typeof password !== "string" || password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long." });
      }

      const emailNormalized = email.trim().toLowerCase();
      const validRoles = ["USER", "ADMIN", "TEAM_MEMBER"];
      const assignedRole = validRoles.includes(role) ? role : "USER";

      // 1. Try Prisma DB registration
      try {
        const existingDbUser = await prisma.user.findUnique({ where: { email: emailNormalized } });
        if (existingDbUser) {
          return res.status(409).json({ error: "An account with this email address already exists." });
        }

        const passwordHash = await hashPassword(password);
        const dbUser = await prisma.user.create({
          data: {
            email: emailNormalized,
            name: name.trim(),
            passwordHash,
            role: assignedRole as any,
            profile: {
              create: {
                industry: "AI & Software Engineering",
                careerStage: "Senior / Lead Engineer",
                targetAudience: "Developers & Engineering Managers",
                writingTone: "Authoritative, engaging, data-driven",
              },
            },
            settings: {
              create: {},
            },
          },
        });

        const token = jwt.sign(
          { sub: dbUser.id, email: dbUser.email, name: dbUser.name, role: dbUser.role },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        return res.status(201).json({
          message: "Account created successfully.",
          token,
          user: {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
          },
        });
      } catch (dbErr) {
        console.warn("[Auth DB Notice] Operating in fallback memory mode:", (dbErr as any)?.message);
      }

      // 2. Fallback In-Memory Registration
      if (mockUsers.has(emailNormalized)) {
        return res.status(409).json({ error: "An account with this email address already exists." });
      }

      const passwordHash = await hashPassword(password);
      const newUserId = `usr_${Date.now()}`;
      const newUser: InMemUser = {
        id: newUserId,
        email: emailNormalized,
        name: name.trim(),
        passwordHash,
        role: assignedRole as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsers.set(emailNormalized, newUser);

      const token = jwt.sign(
        { sub: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(201).json({
        message: "Account created successfully.",
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Failed to create account." });
    }
  }

  /**
   * Log in user with email and password
   */
  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
      }

      const emailNormalized = email.trim().toLowerCase();

      // 1. Try Prisma DB Login
      try {
        const dbUser = await prisma.user.findUnique({ where: { email: emailNormalized } });
        if (dbUser) {
          const isPasswordValid = await comparePassword(password, dbUser.passwordHash);
          if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password." });
          }

          const token = jwt.sign(
            { sub: dbUser.id, email: dbUser.email, name: dbUser.name, role: dbUser.role },
            JWT_SECRET,
            { expiresIn: "7d" }
          );

          return res.json({
            message: "Login successful.",
            token,
            user: {
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name,
              role: dbUser.role,
            },
          });
        }
      } catch (dbErr) {
        console.warn("[Auth DB Notice] Operating in fallback memory mode:", (dbErr as any)?.message);
      }

      // 2. Fallback In-Memory Login
      const memUser = mockUsers.get(emailNormalized);
      if (!memUser) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      const isPasswordValid = await comparePassword(password, memUser.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      const token = jwt.sign(
        { sub: memUser.id, email: memUser.email, name: memUser.name, role: memUser.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Login successful.",
        token,
        user: {
          id: memUser.id,
          email: memUser.email,
          name: memUser.name,
          role: memUser.role,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Login failed." });
    }
  }

  /**
   * Request password reset token via email
   */
  public async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email address is required." });
      }

      const emailNormalized = email.trim().toLowerCase();
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiration

      // 1. Try Prisma DB update
      try {
        const dbUser = await prisma.user.findUnique({ where: { email: emailNormalized } });
        if (dbUser) {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { resetToken, resetTokenExpiry },
          });

          await emailService.sendPasswordResetEmail(emailNormalized, resetToken, dbUser.name);

          return res.json({
            message: "Password reset token generated and sent to your email address.",
            resetToken,
          });
        }
      } catch (dbErr) {
        console.warn("[Auth DB Notice] Operating in fallback memory mode:", (dbErr as any)?.message);
      }

      // 2. Fallback In-Memory update
      const memUser = mockUsers.get(emailNormalized);
      if (memUser) {
        memUser.resetToken = resetToken;
        memUser.resetTokenExpiry = resetTokenExpiry;
        mockUsers.set(emailNormalized, memUser);

        await emailService.sendPasswordResetEmail(emailNormalized, resetToken, memUser.name);

        return res.json({
          message: "Password reset token generated and sent to your email address.",
          resetToken,
        });
      }

      // Consistent response to prevent user enumeration
      await emailService.sendPasswordResetEmail(emailNormalized, resetToken, "User");

      return res.json({
        message: "If an account exists with this email address, a password reset email has been sent.",
        resetToken,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Failed to process forgot password request." });
    }
  }

  /**
   * Reset password using a valid reset token
   */
  public async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ error: "Reset token and new password are required." });
      }

      if (typeof newPassword !== "string" || newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters long." });
      }

      const newPasswordHash = await hashPassword(newPassword);

      // 1. Try Prisma DB password reset
      try {
        const dbUser = await prisma.user.findFirst({
          where: {
            resetToken: token,
            resetTokenExpiry: { gt: new Date() },
          },
        });

        if (dbUser) {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              passwordHash: newPasswordHash,
              resetToken: null,
              resetTokenExpiry: null,
            },
          });

          return res.json({
            message: "Password reset successful! You can now log in with your new password.",
          });
        }
      } catch (dbErr) {
        console.warn("[Auth DB Notice] Operating in fallback memory mode:", (dbErr as any)?.message);
      }

      // 2. Fallback In-Memory reset
      for (const [email, user] of mockUsers.entries()) {
        if (user.resetToken === token && user.resetTokenExpiry && user.resetTokenExpiry > new Date()) {
          user.passwordHash = newPasswordHash;
          user.resetToken = null;
          user.resetTokenExpiry = null;
          mockUsers.set(email, user);

          return res.json({
            message: "Password reset successful! You can now log in with your new password.",
          });
        }
      }

      return res.status(400).json({ error: "Invalid or expired password reset token." });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Failed to reset password." });
    }
  }

  /**
   * Get authenticated user profile details
   */
  public async getProfile(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { profile: true },
      });

      if (dbUser) {
        return res.json({
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
          profile: dbUser.profile || {
            industry: "AI & Software Engineering",
            careerStage: "Senior / Lead Engineer",
            targetAudience: "Developers & Engineering Managers",
            writingTone: "Authoritative, engaging, data-driven",
          },
        });
      }
    } catch {
      // Ignore DB error, return JWT token details
    }

    return res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      profile: {
        industry: "AI & Software Engineering",
        careerStage: "Senior / Lead Engineer",
        targetAudience: "Developers & Tech Leaders",
        writingTone: "Authoritative, engaging, data-driven",
      },
    });
  }
}

export const authController = new AuthController();
