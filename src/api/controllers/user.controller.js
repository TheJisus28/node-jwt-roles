import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import { JWT_SECRET } from "../../../config";

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        ok: true,
        msg: "Missing required fields: username, email and password",
      });
    }

    const user = await UserModel.findOneByEmail(email);
    if (user) {
      return res.status(409).json({
        ok: true,
        msg: "Email already in use",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = await jwt.sign(
      {
        email: newUser.email,
        role: newUser.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(201).json({
      ok: true,
      msg: "User created",
      body: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: true,
      msg: "Error server",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: true,
        msg: "Missing required fields: username, email and password",
      });
    }

    const user = UserModel.findOneByEmail(email);
    if (!user) {
      return res.status(401).json({
        ok: true,
        msg: "Invalid credentials",
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        ok: true,
        msg: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.json({
      ok: true,
      msg: "User Logged",
      body: token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Server Error",
    });
  }
};

export const userController = {
  createUser,
  login,
};
