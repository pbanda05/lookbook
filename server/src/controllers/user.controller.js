import User from "../models/User.js";

export async function getMe(req, res, next) {
  try {
    const { uid, email, name, picture } = req.user; // from Firebase token (name/picture may be undefined)
    if (!uid || !email) return res.status(400).json({ message: "Invalid token claims" });

    const update = {
      firebaseUid: uid,
      email,
      name: name || "New User",
      avatarUrl: picture,
    };

    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { $setOnInsert: update },
      { upsert: true, new: true }
    );

    res.status(200).json({ user, synced: true });
  } catch (err) {
    next(err);
  }
}

export async function createDemoUser(req, res, next) {
  try {
    const { email, name, uid } = req.body;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({ email, name, firebaseUid: uid });
    }

    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}


export async function syncUser(req, res, next) {
    try {
      const { uid, email, name, picture } = req.user || {};
      if (!uid || !email) return res.status(400).json({ message: "Invalid token claims" });
  
      const update = {
        firebaseUid: uid,
        email,
        name: name || "New User",
        avatarUrl: picture,
      };
  
      const user = await User.findOneAndUpdate(
        { firebaseUid: uid },
        { $setOnInsert: update },
        { upsert: true, new: true }
      );
  
      res.status(200).json({ user, synced: true });
    } catch (err) { next(err); }
  }
  
  // (Optional) also export a default bag to avoid named-import issues
  export default { getMe, createDemoUser, syncUser };
