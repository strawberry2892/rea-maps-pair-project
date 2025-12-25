import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient({
    log: ["query", "error"]
});


async function connect() {
    try {
        await prisma.$connect();
    } catch (e) {
        console.error("Prisma connect error:", e);
    }
}
connect();


const gracefulShutdown = async () => {
    try {
        await prisma.$disconnect();
    } catch (e) {
        console.error("Error during Prisma disconnect:", e);
    } finally {
        process.exit(0);
    }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

export default prisma;
