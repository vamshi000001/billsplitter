const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const emailService = require('../services/email.service');

// Hardcoded super admin credentials for demo
// In production, this should be in env or a separate Admin table
const ADMIN_EMAIL = 'superadmin@splitapp.com';
const ADMIN_PASSWORD = 'supersecretpassword';

exports.broadcastEmail = async (req, res) => {
    const { subject, message } = req.body;
    try {
        // Fetch all room admins (unique users who own a room)
        const rooms = await prisma.room.findMany({
            select: { adminId: true, admin: { select: { email: true, name: true } } },
            distinct: ['adminId']
        });

        const sendPromises = rooms.map(room => {
            if (room.admin && room.admin.email) {
                return emailService.sendManualEmail(room.admin.email, "System Broadcast", subject, message, "Super Admin");
            }
        });

        await Promise.all(sendPromises);

        res.status(200).json({ message: `Broadcast sent to ${rooms.length} admins` });
    } catch (error) {
        res.status(500).json({ message: 'Broadcast failed', error: error.message });
    }
};

exports.superAdminLogin = async (req, res) => {
    const { email, password } = req.body;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Return a simple token or just success. 
        // For this demo, we'll return a success flag and a mock token.
        return res.status(200).json({
            message: 'Super Admin Login Successful',
            token: 'super-admin-mock-token',
            user: { name: 'Super Admin', email: ADMIN_EMAIL, role: 'APP_ADMIN' }
        });
    }

    return res.status(401).json({ message: 'Invalid Super Admin Credentials' });
};

exports.getStats = async (req, res) => {
    try {
        const roomCount = await prisma.room.count();
        const activeRoommates = await prisma.roomMember.count(); // Approximate active users

        res.status(200).json({
            roomCount,
            activeRoommates
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};

exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await prisma.room.findMany({
            include: {
                admin: {
                    select: { name: true, email: true }
                },
                _count: {
                    select: { members: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rooms', error: error.message });
    }
};

exports.banRoom = async (req, res) => {
    const { roomId } = req.params;
    const { isBanned } = req.body; // Expect boolean

    try {
        const room = await prisma.room.update({
            where: { id: parseInt(roomId) },
            data: { isBanned }
        });
        res.status(200).json({ message: `Room ${isBanned ? 'banned' : 'unbanned'} successfully`, room });
    } catch (error) {
        res.status(500).json({ message: 'Error updating room status', error: error.message });
    }
};

exports.deleteRoom = async (req, res) => {
    const { roomId } = req.params;

    try {
        // Transaction to delete all related data first or use cascade if configured (Prisma handles cascade if schema set, but safe to be explicit here if needed)
        // For now, assuming cascade delete is NOT set up in DB, we rely on Prisman or manual. 
        // Let's rely on Prisma cascade if relation exists, else manual.
        // Prisma schema usually doesn't cascade by default unless specified.

        // Delete dependencies first manually to be safe
        const rId = parseInt(roomId);

        await prisma.message.deleteMany({ where: { roomId: rId } });
        await prisma.expense.deleteMany({ where: { roomId: rId } });
        await prisma.expenseCycle.deleteMany({ where: { roomId: rId } });
        await prisma.roomMember.deleteMany({ where: { roomId: rId } });

        await prisma.room.delete({
            where: { id: rId }
        });

        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting room', error: error.message });
    }
};
