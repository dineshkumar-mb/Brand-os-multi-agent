import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_personal_brand_os_2026";

export class AuthController {
  public login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }
    const token = jwt.sign({ sub: "user_123", email, role: "ADMIN" }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({
      token,
      user: { id: "user_123", email, name: "Staff AI Engineer", role: "ADMIN" },
    });
  }

  public getProfile(req: Request, res: Response) {
    return res.json({
      id: "user_123",
      email: "engineer@brand-os.ai",
      name: "Staff AI Engineer",
      role: "ADMIN",
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
