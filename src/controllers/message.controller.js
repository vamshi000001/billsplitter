const prisma = require("../config/prisma");

exports.sendMessage = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const { content } = req.body;
        const senderId = req.user.userId;

        // Check if member
        const member = await prisma.roomMember.findUnique({
            where: { roomId_userId: { roomId: parseInt(roomId), userId: senderId } }
        });

        // Admin is also a user, but typically this is for roommates.
        // Logic: Anyone in the room can send? PRD says "Roommate -> Admin".
        // "Visible only to: Room admin, App admin".
        // If I am admin, I can message myself? Sure.

        if (!member) {
            // Check if room admin?
            const room = await prisma.room.findUnique({ where: { id: parseInt(roomId) } });
            if (!room || room.adminId !== senderId) {
                return res.status(403).json({ message: "Access denied" });
            }
        }

        await prisma.message.create({
            data: {
                roomId: parseInt(roomId),
                senderId,
                content
            }
        });

        return res.status(201).json({ message: "Message sent to admin" });
    } catch (err) {
        next(err);
    }
};

exports.getMessages = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.userId;

        const room = await prisma.room.findUnique({ where: { id: parseInt(roomId) } });
        if (!room) return res.status(404).json({ message: "Room not found" });

        // Check membership
        const member = await prisma.roomMember.findUnique({
            where: { roomId_userId: { roomId: parseInt(roomId), userId: userId } }
        });

        if (!member && room.adminId !== userId && req.user.role !== "APP_ADMIN") {
            return res.status(403).json({ message: "Access denied" });
        }

        const messages = await prisma.message.findMany({
            where: { roomId: parseInt(roomId) },
            include: { sender: { select: { name: true, email: true } } },
            orderBy: { createdAt: "desc" }
        });

        return res.status(200).json(messages);
    } catch (err) {
        next(err);
    }
};

exports.markAsRead = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.userId;

        const room = await prisma.room.findUnique({ where: { id: parseInt(roomId) } });
        if (!room) return res.status(404).json({ message: "Room not found" });

        // Only Admin can mark messages as read/resolved
        if (room.adminId !== userId) {
            return res.status(403).json({ message: "Only admin can manage messages" });
        }

        await prisma.message.updateMany({
            where: {
                roomId: parseInt(roomId),
                status: "OPEN"
            },
            data: {
                status: "RESOLVED"
            }
        });

        return res.status(200).json({ message: "Messages marked as read" });
    } catch (err) {
        next(err);
    }
};
