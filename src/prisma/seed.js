const { PrismaClient } = require("@prisma/client");
const { SHA256 } = require("crypto-js");
const prisma = new PrismaClient();

const hashPassword = (string) => {
  return SHA256(string).toString();
};

const load = async () => {
  try {
    await prisma.user.create({
      data: {
        username: "admin",
        email: "admin@example.com",
        password: hashPassword("password"),
      },
    });
    console.log("User created successfully!");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
