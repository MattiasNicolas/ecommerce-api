const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { hashearPassword } = require('../utils/hashUtils'); 

const registerUser = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si ya existe ese email
    const userExistente = await User.findOne({ email });
    if (userExistente) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await hashearPassword(password);

    // Crear y guardar el usuario
    const nuevoUsuario = new User({
      nombre,
      email,
      password: hashedPassword
    });

    await nuevoUsuario.save();

    // Devolver datos del usuario sin la contraseña
    res.status(201).json({
      message: 'Usuario registrado con éxito',
      usuario: {
        _id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos' });
    }

    // Comparar contraseñas
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos' });
    }

    // Generar token
    const token = jwt.sign(
      {
        id: usuario._id,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login exitoso',
      token
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

module.exports = {
  registerUser,
  loginUser
};

