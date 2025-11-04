import User from "../models/User.js";

// GET /api/users/me
export async function getMe(_req, res, next) {
  try {
    // Placeholder: get "the first" user until auth is added
    const user = await User.findOne().lean();
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user yet. Create one at POST /api/users/demo" });
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// POST /api/users/demo
export async function createDemoUser(req, res, next) {
  try {
    const {
      email = "demo@lookbook.app",
      name = "Demo User",
      avatarUrl,
    } = req.body || {};

    const existing = await User.findOne({ email });
    if (existing) return res.status(200).json({ user: existing, existed: true });

    const user = await User.create({ email, name, avatarUrl });
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}
