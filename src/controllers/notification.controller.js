const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20 // Limit to last 20
        });
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch notifications" });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { notificationId } = req.params;

        // If 'all' is passed, mark all as read
        if (notificationId === 'all') {
            await prisma.notification.updateMany({
                where: { userId, isRead: false },
                data: { isRead: true }
            });
            return res.status(200).json({ message: "All notifications marked as read" });
        }

        const notification = await prisma.notification.findUnique({ where: { id: parseInt(notificationId) } });
        if (!notification || notification.userId !== userId) {
            return res.status(404).json({ message: "Notification not found" });
        }

        await prisma.notification.update({
            where: { id: parseInt(notificationId) },
            data: { isRead: true }
        });

        res.status(200).json({ message: "Notification marked as read" });
    } catch (err) {
        res.status(500).json({ message: "Failed to update notification" });
    }
};

// Internal helper to create notification
exports.createNotification = async (userId, content, type = 'INFO') => {
    try {
        await prisma.notification.create({
            data: { userId, content, type }
        });
    } catch (err) {
        console.error("Failed to create notification:", err);
    }
};
