const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { nombre, email, contraseña } = req.body;

    // Verificar si ya existe ese email
    const userExistente = await User.findOne({ email });
    if (userExistente) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear y guardar el usuario
    const nuevoUsuario = new User({
      nombre,
      email,
      contraseña: hashedPassword
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    // Buscar usuario por email
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos' });
    }

    // Comparar contraseñas
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos' });
    }

    // Generar token
    const token = jwt.sign(
      {
        id: usuario._id,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
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

