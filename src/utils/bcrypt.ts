import bcrypt from 'bcrypt';
const saltRounds = 10;

export const hashPassword = async (password: string) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    // Manejar el error console.log(error)
  }
};

export const comparePasswords = async (inputPassword: string, hashedPassword: string) => {
  try {
    const result = await bcrypt.compare(inputPassword, hashedPassword);
    return result;
  } catch (error) {
    // Manejar el error console.log(error)
  }
};