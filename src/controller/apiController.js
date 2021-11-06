const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function index(req, res) {
  const users = await User.findAll();
  res.status(200).json(users);
}

async function create(req, res) {
  const { name, email, password, role } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashPassword,
    role,
  });
  return res.status(201).json(user);
}

async function auth(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) return res.json({ error: "Login invalido" });

  const validPass = await bcrypt.compare(password, user.password);

  if (validPass) {
    const token = jwt.sign({ id: user.id }, "123456");
    return res.status(201).json({ token });
  }
  return res.json({ error: "Login invalido" });
}

async function getUser(req, res) {
  const user = await User.findOne({
    where: {
      id: req.userId,
    },
  });

  return res.json(user);
}

module.exports = { index, create, auth, getUser };
