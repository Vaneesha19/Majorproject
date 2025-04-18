// import { PrismaClient } from "@prisma/client";

// export const getSellerData = async (req, res, next) => {
//   try {
//     if (req.userId) {
//       const prisma = new PrismaClient();
//       const gigs = await prisma.gigs.count({ where: { userId: req.userId } });
//       const {
//         _count: { id: orders },
//       } = await prisma.orders.aggregate({
//         where: {
//           isCompleted: true,
//           gig: {
//             createdBy: {
//               id: req.userId,
//             },
//           },
//         },
//         _count: {
//           id: true,
//         },
//       });
//       const unreadMessages = await prisma.message.count({
//         where: {
//           recipientId: req.userId,
//           isRead: false,
//         },
//       });

//       const today = new Date();
//       const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//       const thisYear = new Date(today.getFullYear(), 0, 1);

//       const {
//         _sum: { price: revenue },
//       } = await prisma.orders.aggregate({
//         where: {
//           gig: {
//             createdBy: {
//               id: req.userId,
//             },
//           },
//           isCompleted: true,
//           createdAt: {
//             gte: thisYear,
//           },
//         },
//         _sum: {
//           price: true,
//         },
//       });

//       const {
//         _sum: { price: dailyRevenue },
//       } = await prisma.orders.aggregate({
//         where: {
//           gig: {
//             createdBy: {
//               id: req.userId,
//             },
//           },
//           isCompleted: true,
//           createdAt: {
//             gte: new Date(new Date().setHours(0, 0, 0, 0)),
//           },
//         },
//         _sum: {
//           price: true,
//         },
//       });

//       const {
//         _sum: { price: monthlyRevenue },
//       } = await prisma.orders.aggregate({
//         where: {
//           gig: {
//             createdBy: {
//               id: req.userId,
//             },
//           },
//           isCompleted: true,
//           createdAt: {
//             gte: thisMonth,
//           },
//         },
//         _sum: {
//           price: true,
//         },
//       });
//       return res.status(200).json({
//         dashboardData: {
//           orders,
//           gigs,
//           unreadMessages,
//           dailyRevenue,
//           monthlyRevenue,
//           revenue,
//         },
//       });
//     }
//     return res.status(400).send("User id is required.");
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send("Internal Server Error");
//   }
// };

import { PrismaClient } from "@prisma/client";

export const getSellerData = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(400).send("User ID is required.");
    }

    const prisma = new PrismaClient();

    // Total Gigs
    const gigs = await prisma.gigs.count({ where: { userId: req.userId } });

    // Total Orders
    const ordersCount = await prisma.orders.count({
      where: { gig: { createdBy: { id: req.userId } } },
    });

    // Unread Messages
    const unreadMessages = await prisma.message.count({
      where: { recipientId: req.userId, isRead: false },
    });

    // Total Earnings (Virtual Balance)
    const {
      _sum: { price: totalEarnings },
    } = await prisma.orders.aggregate({
      where: { gig: { createdBy: { id: req.userId } }, isApproved: true }, // Changed from isCompleted to isApproved
      _sum: { price: true },
    });

    return res.status(200).json({
      dashboardData: {
        gigs,
        ordersCount,
        unreadMessages,
        totalEarnings: totalEarnings || 0,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};
