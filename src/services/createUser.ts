import { userRoles } from "@/constants/user";
import { log } from "console";

export default async function createUser(arg0:{email:string, name:string, password:string, role:string}) {
  const errors: string[] = [];
  const { email, name, password, role } = arg0;
  
  // Validación de campos requeridos
  if (!email) {
    errors.push("Correo electrónico es requerido");
  }
  if (!name) {
    errors.push("Nombre es requerido");
  }
  if (!password) {
    errors.push("La contraseña es requerida");
  }
  if (!role) {
    errors.push("El rol es requerido");
  }
  
  // revisando si el rol es uno de los roles permitidos
  const validRoles = userRoles.map(userRole => userRole.value);
  if (role && !validRoles.includes(role)) {
    errors.push("El rol seleccionado no es válido");
  }
  
  if (errors.length > 0) {
    return {
      response: null,
      responseStatus: 400,
      errors
    };
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({email, name, password, role}),
  });

  if (!response.ok) {
    throw new Error("Error creating user");
  }
  const data = await response.json();
  console.log(data, "createUser response");
  return {
    response: {
      email: data.email,
      name: name,
      role: data.role,
      id: data.user_id,
      access_token: data.access_token,
    },
    responseStatus: response.status,
    errors: []
  }
}