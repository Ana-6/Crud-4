const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "public")));

const dataPath = path.join(__dirname, "users.json");

function readData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const data = readData();

  if (!email || !password) {
    return res.status(400).json({ message: "Campos vacíos" });
  }

  const user = data.users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  res.json({ message: "Login exitoso" });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const data = readData();

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  if (email.length > 50 || name.length > 50) {
    return res.status(400).json({ message: "Límites excedidos" });
  }

  const exists = data.users.find(u => u.email === email);
  if (exists) return res.status(400).json({ message: "Correo ya registrado" });

  const newUser = {
    id: Date.now(),
    name,
    email,
    password
  };

  data.users.push(newUser);
  writeData(data);

  res.json({ message: "Usuario creado correctamente" });
});

app.get("/users", (req, res) => {
  const data = readData();
  res.json(data.users);
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const data = readData();
  const user = data.users.find(u => u.id == id);

  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Campos obligatorios" });
  }

  user.name = name;
  user.email = email;
  user.password = password;

  writeData(data);
  res.json({ message: "Usuario actualizado" });
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();

  const filtered = data.users.filter(u => u.id != id);

  if (filtered.length === data.users.length) {
    return res.status(404).json({ message: "Usuario no existe" });
  }

  data.users = filtered;
  writeData(data);

  res.json({ message: "Usuario eliminado" });
});

app.listen(3000, () =>
    console.log("Servidor corriendo en http://localhost:3000")
  );