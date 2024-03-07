import jwt from 'jsonwebtoken';

export const generateToken = ({ id }: { id: string }): string => {
  var payload = {
    khemirabobo: true,
    user: {
      id: String(id)
    }
  };

  return jwt.sign(payload, `${process.env.JWT_SECRET}`, { algorithm: 'RS512', expiresIn: '30d' });
}