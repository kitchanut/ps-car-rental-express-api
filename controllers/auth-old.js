const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const register = async (req, res) => {
//   let data = req.body;
//   const user = await await prisma.users.findUnique({
//     where: {
//       email: data.email,
//     },
//   });
//   if (user) {
//     return res.status(422).json({ message: "User already exists" });
//   } else {
//     data.password = await bcrypt.hash(data.password, 10);
//     const new_users = await prisma.users.create({
//       data: data,
//     });
//     return res.status(201).json(new_users);
//   }
// };

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.users.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
};

module.exports = { login };
