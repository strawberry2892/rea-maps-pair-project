import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prisma";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//пользователи
app.get("/api/users", async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            include: {
            group: true,
            department: true,
            submissions: true
        },
        take: 100
    });
        res.json(users);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

app.post("/api/users", async (req: Request, res: Response) => {
    try {
        const { email, passwordHash, firstName, lastName, role, groupId, departmentId, avatarUrl } = req.body;

        if (!email || !passwordHash || !firstName || !lastName || !role) {
            return res.status(400).json({ error: "email, passwordHash, firstName, lastName and role are required" });
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                lastName,
                role,
                groupId: groupId ?? null,
                departmentId: departmentId ?? null,
                avatarUrl: avatarUrl ?? null
            }
        });

        res.status(201).json(newUser);
    } catch (err: any) {
        console.error(err);
        if (err?.code === "P2002") {
            return res.status(409).json({ error: "Email already exists" });
        }
        res.status(500).json({ error: "Failed to create user", details: err?.message ?? String(err) });
    }
});

// группы
app.get("/api/groups", async (req: Request, res: Response) => {
    try {
        const groups = await prisma.group.findMany({
            include: {
                students: true,
                curator: true,
                schedules: true
            }
        });
        res.json(groups);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to fetch groups" });
    }
});

app.post("/api/groups", async (req: Request, res: Response) => {
    try {
        const { name, year, faculty, specialty, curatorId } = req.body;
        
        if (!name || !year || !faculty || !specialty) {
            return res.status(400).json({ error: "name, year, faculty and specialty are required" });
        }

        const newGroup = await prisma.group.create({
            data: {
                name,
                year: parseInt(year),
                faculty,
                specialty,
                curatorId: curatorId ? parseInt(curatorId) : null
            }
        });

        res.status(201).json(newGroup);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: "Failed to create group", details: err?.message ?? String(err) });
    }
});

// курсы
app.get("/api/courses", async (req: Request, res: Response) => {
    try {
        const courses = await prisma.course.findMany({
            include: {
                teacher: true,
                department: true
            }
        });
        res.json(courses);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to fetch courses" });
    }
});

// расписание
app.get("/api/schedules", async (req: Request, res: Response) => {
    try {
        const schedules = await prisma.schedule.findMany({
            include: {
                course: true,
                group: true
            }
        });
        res.json(schedules);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to fetch schedules" });
    }
});

// задания
app.get("/api/assignments", async (req: Request, res: Response) => {
    try {
        const assignments = await prisma.assignment.findMany({
            include: {
                course: true,
                submissions: true
            }
        });
        res.json(assignments);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to fetch assignments" });
    }
});

// тестовый
app.get("/api/test", async (req: Request, res: Response) => {
    try {
        // создаем тестового пользователя 
        const testUser = await prisma.user.upsert({
            where: { email: "test@test.com" },
            update: {},
            create: {
                email: "test@test.com",
                passwordHash: "test123",
                firstName: "Test",
                lastName: "User",
                role: "STUDENT"
            }
        });
        
        const usersCount = await prisma.user.count();
        const groupsCount = await prisma.group.count();
        
        res.json({
            message: "API is working!",
            testUser,
            counts: {
                users: usersCount,
                groups: groupsCount
            },
            endpoints: [
                "GET /api/users",
                "GET /api/groups",
                "GET /api/courses",
                "GET /api/schedules",
                "GET /api/assignments",
                "POST /api/users",
                "POST /api/groups"
            ]
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Test failed", details: e.message });
    }
});

// корневой
app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "Student Management System API",
        version: "1.0.0",
        endpoints: {
            users: ["GET /api/users", "POST /api/users"],
            groups: ["GET /api/groups", "POST /api/groups"],
            courses: "GET /api/courses",
            schedules: "GET /api/schedules",
            assignments: "GET /api/assignments",
            test: "GET /api/test"
        },
        frontend: "Open /frontend/index.html"
    });
});



app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
