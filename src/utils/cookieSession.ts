import * as jwt from 'jsonwebtoken';

export default function cookieSession($args:{email:string,token:string}) {
  // Aquí puedes implementar la lógica para manejar la sesión de cookies
  const { email, token } = $args;
  const secretKey = process.env.AUTH_SECRET || 'default_secret';
  if (!email || !token) {
    throw new Error("Email and token are required for cookie session.");
  }
  const payload ={
    email,
    token,

  }
interface CookieSessionArgs {
    email: string;
    token: string;
}

interface JwtPayload {
    email: string;
    token: string;
}

const jwtSignResult: string = jwt.sign(
    payload as JwtPayload,
    secretKey,
    { expiresIn: '7d' }
);

document.cookie = `session=${jwtSignResult}; path=/; max-age=604800; secure; HttpOnly`;

}