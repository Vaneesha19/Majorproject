// import { PrismaClient } from "@prisma/client";
// import Stripe from "stripe";

// const stripe = new Stripe(
//   "sk_test_51QryUpIScDZJpzaOUilF1ffzylsYP23djnND3Rqdv7pLchoz1y1IJlzddkeu3CXCpTEUKlhRXGqzggkMul4xw4io00fekhj7BL"
// );

// export const createOrder = async (req, res, next) => {
//   try {
//     if (req.body.gigId) {
//       const { gigId } = req.body;
//       const prisma = new PrismaClient();
//       const gig = await prisma.gigs.findUnique({
//         where: { id: parseInt(gigId) },
//       });
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: gig?.price * 100,
//         currency: "usd",
//         automatic_payment_methods: {
//           enabled: true,
//         },
//       });
//       await prisma.orders.create({
//         data: {
//           paymentIntent: paymentIntent.id,
//           price: gig?.price,
//           buyer: { connect: { id: req?.userId } },
//           gig: { connect: { id: gig?.id } },
//         },
//       });
//       res.status(200).send({
//         clientSecret: paymentIntent.client_secret,
//       });
//     } else {
//       res.status(400).send("Gig id is required.");
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send("Internal Server Error");
//   }
// };

// export const confirmOrder = async (req, res, next) => {
//   try {
//     if (req.body.paymentIntent) {
//       const prisma = new PrismaClient();
//       await prisma.orders.update({
//         where: { paymentIntent: req.body.paymentIntent },
//         data: { isApproved: false},
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send("Internal Server Error");
//   }
// };

// export const getBuyerOrders = async (req, res, next) => {
//   try {
//     if (req.userId) {
//       const prisma = new PrismaClient();
//       const orders = await prisma.orders.findMany({
//         where: { buyerId: req.userId, isApproved: true },
//         include: { gig: true },
//       });
//       return res.status(200).json({ orders });
//     }
//     return res.status(400).send("User id is required.");
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send("Internal Server Error");
//   }
// };

// export const getSellerOrders = async (req, res, next) => {
//   try {
//     if (req.userId) {
//       const prisma = new PrismaClient();
//       const orders = await prisma.orders.findMany({
//         where: {
//           gig: {
//             createdBy: {
//               id: parseInt(req.userId),
//             },
//           },
//           isApproved: true,
//         },
//         include: {
//           gig: true,
//           buyer: true,
//         },
//       });
//       return res.status(200).json({ orders });
//     }
//     return res.status(400).send("User id is required.");
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send("Internal Server Error");
//   }
// };
// import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
// import prisma from "../prismaClient.js"; // Ensure the correct relative path

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); 
const stripe = new Stripe("sk_test_51QryUpIScDZJpzaOUilF1ffzylsYP23djnND3Rqdv7pLchoz1y1IJlzddkeu3CXCpTEUKlhRXGqzggkMul4xw4io00fekhj7BL");
// const prisma =new PrismaClient();


// export const createOrder = async (req, res) => {
//   try {
//     const { gigId } = req.body;
//     if (!gigId) {
//       return res.status(400).json({ error: "Gig ID is required." });
//     }

//     const prisma = new PrismaClient();

//     // Find gig details
//     const gig = await prisma.gigs.findUnique({
//       where: { id: parseInt(gigId) },
//       include: { createdBy: true }, // ✅ Use createdBy instead of seller
//     });

//     if (!gig) {
//       return res.status(404).json({ error: "Gig not found." });
//     }

//     // Create payment intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: gig.price * 100,
//       currency: "usd",
//       automatic_payment_methods: { enabled: true },
//     });

//     // Store order in database
//     const order = await prisma.orders.create({
//       data: {
//         paymentIntent: paymentIntent.id,
//         price: gig.price,
//         buyer: { connect: { id: req.userId } },
//         gig: { connect: { id: gig.id } },
//         seller: { connect: { id: gig.createdBy.id } }, // ✅ FIXED: Use connect for seller
//       },
//     });

//     res.status(200).send({
//       clientSecret: paymentIntent.client_secret,
//       orderId: order.id,
//     });
//   } catch (err) {
//     console.error("Error in createOrder:", err);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const createOrder = async (req, res) => {
  try {
    const { gigId } = req.body;
    if (!gigId) {
      return res.status(400).json({ error: "Gig ID is required." });
    }

    const prisma = new PrismaClient();

    // Find gig details
    const gig = await prisma.gigs.findUnique({
      where: { id: parseInt(gigId) },
      include: { createdBy: true }, // ✅ Use createdBy instead of seller
    });

    if (!gig) {
      return res.status(404).json({ error: "Gig not found." });
    }

    // Check if admin exists
    const admin = await prisma.admin.findUnique({
      where: { id: 1 },
    });

    if (!admin) {
      return res.status(404).json({ error: "Admin record not found. Please create an admin first." });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price * 100,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    // Store order in database
    const order = await prisma.orders.create({
      data: {
        paymentIntent: paymentIntent.id,
        price: gig.price,
        buyer: { connect: { id: req.userId } },
        gig: { connect: { id: gig.id } },
        seller: { connect: { id: gig.createdBy.id } },
      },
    });

    // ✅ Add money to admin account (since admin holds the money)
    await prisma.admin.update({
      where: { id: 1 },
      data: { adminBalance: { increment: gig.price } },
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    });
  } catch (err) {
    console.error("Error in createOrder:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



// export const approveOrder = async (req, res) => {
//   try {
//     const { orderId } = req.body;
//     if (!orderId) {
//       return res.status(400).json({ error: "Order ID is required." });
//     }

//     const updatedOrder = await prisma.orders.update({
//       where: { id: parseInt(orderId) },
//       data: { isApproved: true },
//     });

//     res.status(200).json({ message: "Order approved successfully", order: updatedOrder });
//   } catch (err) {
//     console.error("Error in approveOrder:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };//final

export const approveOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required." });
    }

    // Fetch order with seller details
    const order = await prisma.orders.findUnique({
      where: { id: parseInt(orderId) },
      include: { seller: true }, // Ensure seller data is included
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    if (!order.seller) {
      return res.status(500).json({ error: "Seller not found for this order." });
    }

    // ✅ Approve the order
    const updatedOrder = await prisma.orders.update({
      where: { id: parseInt(orderId) },
      data: { isApproved: true },
    });

    // ✅ Add amount to seller’s virtual balance
    await prisma.user.update({
      where: { id: order.seller.id },
      data: { virtualBalance: { increment: order.price } },
    });

    res.status(200).json({ message: "Order approved and amount credited to seller", order: updatedOrder });
  } catch (err) {
    console.error("❌ Error in approveOrder:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




/**
 * Get All Orders for Buyer
 */
export const getBuyerOrders = async (req, res, next) => {
  try {
    const orders = await prisma.orders.findMany({
      where: { buyerId: req.userId },
      include: { gig: true },
    });

    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Get All Orders for Seller
 */
export const getSellerOrders = async (req, res, next) => {
  try {
    const orders = await prisma.orders.findMany({
      where: {
        gig: { createdBy: { id: parseInt(req.userId) } },
      },
      include: { gig: true, buyer: true },
    });

    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Get Admin Escrow Balance
 */
export const getAdminBalance = async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: 1 } });
    res.status(200).json({ adminBalance: admin?.adminBalance || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
