const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function index(req, res) {
  const users = await User.findAll({
    attributes: ["avatar", "name", "email", "role", "id"],
  });
  res.status(200).json(users);
}

async function findOneById(req, res) {
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      id,
    },
    attributes: ["id", "name", "email", "role", "avatar"],
  });

  res.status(200).json(user);
}

async function create(req, res) {
  const { name, email, password } = req.body;
  const role = "user";

  const existEmail = await User.findOne({
    where: {
      email,
    },
  });

  if (existEmail) {
    const message = { error: "e-mail já cadastrado" };
    return res.json(message);
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashPassword,
    role,
  });

  const token = jwt.sign({ id: user.id }, "123456");
  return res.status(201).json({ token });
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

async function deleteUser(req, res) {
  const { id } = req.params;
  const loggedUser = req.userId;

  if (loggedUser == id) {
    const message = { error: "Você não pode se excluir" };
    return res.json(message);
  }

  const user = await User.destroy({
    where: {
      id,
    },
  });

  return res.json(user);
}

async function updateUser(req, res) {
  const { id } = req.params;
  let avatar_url = null;

  const { name, email, role } = req.body;

  if (req.file) {
    avatar_url = `https://backend-dashboard-api.herokuapp.com/uploads/${req.file.filename}`;
  }

  const user = await User.findOne({
    where: {
      id: id,
    },
  });

  if (!name || !email || !role) {
    const message = { error: "Dados invalidos" };
    return res.json(message);
  }

  user.name = name;
  user.email = email;
  user.role = role;

  if (avatar_url) {
    user.avatar = avatar_url;
  }

  await user.save();

  const message = { sucess: "Dados atualizados com sucesso" };
  return res.json(message);
}

async function updatePassByAdmin(req, res) {
  const { newPass } = req.body;
  const { id } = req.params;

  console.log("here");
  const user = await User.findOne({
    where: {
      id,
    },
    attributes: ["password", "id"],
  });

  const hashPassword = await bcrypt.hash(newPass, 10);
  user.password = hashPassword;

  await user.save();

  const message = { sucess: "Senha atualizada" };
  return res.json(message);
}

async function updatePass(req, res) {
  const { oldPass, newPass } = req.body;

  const { id } = req.params;

  const user = await User.findOne({
    where: {
      id,
    },
    attributes: ["password", "id"],
  });

  const isvalid = await bcrypt.compare(oldPass, user.password);

  if (!isvalid) {
    const message = { error: "Senha antiga é inválida" };
    return res.json(message);
  }

  const hashPassword = await bcrypt.hash(newPass, 10);
  user.password = hashPassword;

  console.log(user);

  await user.save();

  const message = { sucess: "Senha atualizada" };
  return res.json(message);
}

module.exports = {
  index,
  create,
  auth,
  getUser,
  deleteUser,
  findOneById,
  updateUser,
  updatePass,
  updatePassByAdmin,
};
