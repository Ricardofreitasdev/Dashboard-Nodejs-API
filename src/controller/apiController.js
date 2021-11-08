const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



async function index(req, res) {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'role']
  });
  res.status(200).json(users);
}

async function findOneById(req, res){
  const { id } = req.params

  const user = await User.findOne(
    {
      where:{
        id
      },
      attributes: ['id', 'name', 'email', 'role']      
    
  })

  res.status(200).json(user);
}

async function create(req, res) {
  const { name, email, password } = req.body;
  const role = 'user'

  const existEmail = await User.findOne({
    where:{
      email
    }
  })

  if(existEmail){
  const message = {error: "e-mail já cadastrado"}
  return res.json(message);
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashPassword,
    role,
  });

  console.log(user.id);
  
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
  const { id } = req.params
  const loggedUser = req.userId

  console.log(loggedUser);
  console.log(id);

  if(loggedUser == id){
    const message = {error: "Você não pode se excluir"}
    return res.json(message);
  }

  const user = await User.destroy({
    where:{
      id
    }
  })

  return res.json(user);

}

module.exports = { index, create, auth, getUser, deleteUser, findOneById };
