// Importación de la función que queremos testear
const { hashearPassword } = require('../src/utils/hashUtils');
// Importación de bcrypt para poder verificar el hash
const bcrypt = require('bcrypt');

describe('hashearPassword', () => {
  // Este test verifica que la función devuelva un hash válido y seguro
  it('debería devolver un hash válido que coincida con la contraseña original', async () => {
    const password = '123456';

    // Usa la función para obtener el hash
    const hash = await hashearPassword(password);

    // Asegura que el hash no sea igual al texto plano (por seguridad)
    expect(hash).not.toBe(password);

    // Verifica que el hash sí pueda ser validado con la contraseña original
    const esValido = await bcrypt.compare(password, hash);

    // Espera que la validación sea verdadera (el hash es correcto)
    expect(esValido).toBe(true);
  });
});
