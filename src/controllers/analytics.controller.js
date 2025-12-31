const prisma = require("../config/prisma");

exports.getCategorySummary = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.userId;

        // Access check
        const member = await prisma.roomMember.findUnique({
            where: { roomId_userId: { roomId: parseInt(roomId), userId: parseInt(userId) } }
        });
        const room = await prisma.room.findUnique({ where: { id: parseInt(roomId) } });

        if (!room) return res.status(404).json({ message: "Room not found" });
        if (!member && room.adminId !== userId && req.user.role !== "APP_ADMIN") {
            return res.status(403).json({ message: "Access denied" });
        }

        // Group by category
        // Prisma groupBy
        const summary = await prisma.expense.groupBy({
            by: ['category'],
            where: { roomId: parseInt(roomId) },
            _sum: {
                amount: true
            }
        });

        // Formatting response: { "Utilities": 500, "Food": 300 }
        const result = {};
        summary.forEach(item => {
            result[item.category] = item._sum.amount;
        });

        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.getCycleSummary = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.userId;

        // Access check
        const member = await prisma.roomMember.findUnique({
            where: { roomId_userId: { roomId: parseInt(roomId), userId: parseInt(userId) } }
        });
        const room = await prisma.room.findUnique({ where: { id: parseInt(roomId) } });

        if (!room) return res.status(404).json({ message: "Room not found" });
        if (!member && room.adminId !== userId && req.user.role !== "APP_ADMIN") {
            return res.status(403).json({ message: "Access denied" });
        }

        // Total expenses (Current cycle? Or global?)
        // "Monthly / Cycle Summary"
        // Usually implies the current ACTIVE cycle status.
        // Logic: Get active cycle total, member counts, paid/unpaid counts.

        const activeCycle = await prisma.expenseCycle.findFirst({
            where: { roomId: parseInt(roomId), isClosed: false }
        });

        const total = activeCycle ? activeCycle.totalAmount : 0; // If no active cycle, 0? Or fetch total active?

        const membersCount = await prisma.roomMember.count({ where: { roomId: parseInt(roomId) } });
        const paidCount = await prisma.roomMember.count({ where: { roomId: parseInt(roomId), paymentStatus: "PAID" } });
        const unpaidCount = await prisma.roomMember.count({ where: { roomId: parseInt(roomId), paymentStatus: "UNPAID" } });

        return res.status(200).json({
            total,
            members: membersCount,
            paid: paidCount,
            unpaid: unpaidCount
        });
    } catch (err) {
        next(err);
    }
};

exports.getMonthlyAnalytics = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.userId;

        const room = await prisma.room.findUnique({ where: { id: parseInt(roomId) } });
        if (!room) return res.status(404).json({ message: "Room not found" });

        // Fetch all expenses
        const expenses = await prisma.expense.findMany({
            where: { roomId: parseInt(roomId) },
            select: { amount: true, createdAt: true }
        });

        // Group by Month-Year (e.g., "Dec 2024")
        const monthlyData = {};
        expenses.forEach(exp => {
            const date = new Date(exp.createdAt);
            const key = date.toLocaleString('default', { month: 'short', year: 'numeric' }); // "Dec 2024"
            if (!monthlyData[key]) monthlyData[key] = 0;
            monthlyData[key] += exp.amount;
        });

        // Convert to array and sort cronologically 
        // Note: Simple string sort won't work perfectly for "Dec 2024" vs "Jan 2025".
        // Better to use a sortable key or sort by date object.

        // Let's create an array of objects
        const chartData = Object.keys(monthlyData).map(key => ({
            month: key,
            total: monthlyData[key]
        }));

        // Sort by parsing the date string
        chartData.sort((a, b) => new Date(a.month) - new Date(b.month));

        // Return last 3 months for clear chart
        // Limit to 3 items
        return res.status(200).json(chartData.slice(-3));

    } catch (err) {
        next(err);
    }
};
