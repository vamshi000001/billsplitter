const prisma = require("../config/prisma");

exports.getCategorySummary = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.userId;

        // Access check
        const [member, room] = await Promise.all([
            prisma.roomMember.findUnique({
                where: { roomId_userId: { roomId: parseInt(roomId), userId: parseInt(userId) } }
            }),
            prisma.room.findUnique({ where: { id: parseInt(roomId) } })
        ]);

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
        const [member, room] = await Promise.all([
            prisma.roomMember.findUnique({
                where: { roomId_userId: { roomId: parseInt(roomId), userId: parseInt(userId) } }
            }),
            prisma.room.findUnique({ where: { id: parseInt(roomId) } })
        ]);

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

        const [membersCount, paidCount, unpaidCount] = await Promise.all([
            prisma.roomMember.count({ where: { roomId: parseInt(roomId) } }),
            prisma.roomMember.count({ where: { roomId: parseInt(roomId), paymentStatus: "PAID" } }),
            prisma.roomMember.count({ where: { roomId: parseInt(roomId), paymentStatus: "UNPAID" } })
        ]);

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

        // Generate last 3 months keys
        const last3Months = [];
        for (let i = 2; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            last3Months.push(d.toLocaleString('default', { month: 'short', year: 'numeric' }));
        }

        // Fetch all expenses
        const expenses = await prisma.expense.findMany({
            where: { roomId: parseInt(roomId) },
            select: { amount: true, createdAt: true }
        });

        // Group actual data
        const monthlyData = {};
        expenses.forEach(exp => {
            const key = new Date(exp.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!monthlyData[key]) monthlyData[key] = 0;
            monthlyData[key] += exp.amount;
        });

        // Map to last 3 months (Fill 0 if missing)
        const chartData = last3Months.map(month => ({
            month,
            total: monthlyData[month] || 0
        }));

        return res.status(200).json(chartData);

    } catch (err) {
        next(err);
    }
};
