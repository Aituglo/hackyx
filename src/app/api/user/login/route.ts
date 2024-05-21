import { SHA256 as sha256 } from "crypto-js";
import prisma from "@/lib/prisma";

const hashPassword = (string: string) => {
  return sha256(string).toString();
};


export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json({ message: "invalid inputs" }, { status: 400 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
    });
    if (user && user.password === hashPassword(password)) {
      // exclude password from json response
      return Response.json(exclude(user, ["password"]));
    } else {
      return Response.json({ message: "invalid credentials" }, { status: 401 });
    }
  } catch (e) {
    throw new Error(e);
  }
}

// Function to exclude user password returned from prisma
function exclude(user, keys) {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}