// import { PrismaClient } from "@prisma/client";

// import { existsSync, renameSync, unlinkSync } from "fs";

// export const addGig = async (req, res, next) => {
//   try {
//     if (req.files) {
//       const fileKeys = Object.keys(req.files);
//       const fileNames = [];
//       fileKeys.forEach((file) => {
//         const date = Date.now();
//         renameSync(
//           req.files[file].path,
//           "uploads/" + date + req.files[file].originalname
//         );
//         fileNames.push(date + req.files[file].originalname);
//       });
//       if (req.query) {
//         const {
//           title,
//           description,
//           category,
//           features,
//           price,
//           revisions,
//           time,
//           shortDesc,
//         } = req.query;
//         const prisma = new PrismaClient();

//         await prisma.gigs.create({
//           data: {
//             title,
//             description,
//             deliveryTime: parseInt(time),
//             category,
//             features,
//             price: parseInt(price),
//             shortDesc,
//             revisions: parseInt(revisions),
//             createdBy: { connect: { id: req.userId } },
//             images: fileNames,
//           },
//         });

//         return res.status(201).send("Successfully created the gig.");
//       }
//     }
//     return res.status(400).send("All properties should be required.");
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send("Internal Server Error");
//   }
// };

// export const getUserAuthGigs = async (req, res, next) => {
//   try {
//     if (req.userId) {
//       const prisma = new PrismaClient();
//       const user = await prisma.user.findUnique({
//         where: { id: req.userId },
//         include: { gigs: true },
//       });
//       return res.status(200).json({ gigs: user?.gigs ?? [] });
//     }
//     return res.status(400).send("UserId should be required.");
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send("Internal Server Error");
//   }
// };

// export const getGigData = async (req, res, next) => {
//   try {
//     if (req.params.gigId) {
//       const prisma = new PrismaClient();
//       const gig = await prisma.gigs.findUnique({
//         where: { id: parseInt(req.params.gigId) },
//         include: {
//           reviews: {
//             include: {
//               reviewer: true,
//             },
//           },
//           createdBy: true,
//         },
//       });

//       const userWithGigs = await prisma.user.findUnique({
//         where: { id: gig?.createdBy.id },
//         include: {
//           gigs: {
//             include: { reviews: true },
//           },
//         },
//       });

//       const totalReviews = userWithGigs.gigs.reduce(
//         (acc, gig) => acc + gig.reviews.length,
//         0
//       );

//       const averageRating = (
//         userWithGigs.gigs.reduce(
//           (acc, gig) =>
//             acc + gig.reviews.reduce((sum, review) => sum + review.rating, 0),
//           0
//         ) / totalReviews
//       ).toFixed(1);

//       return res
//         .status(200)
//         .json({ gig: { ...gig, totalReviews, averageRating } });
//     }
//     return res.status(400).send("GigId should be required.");
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send("Internal Server Error");
//   }
// };

// export const editGig = async (req, res, next) => {
//   try {
//     if (req.files) {
//       const fileKeys = Object.keys(req.files);
//       const fileNames = [];
//       fileKeys.forEach((file) => {
//         const date = Date.now();
//         renameSync(
//           req.files[file].path,
//           "uploads/" + date + req.files[file].originalname
//         );
//         fileNames.push(date + req.files[file].originalname);
//       });
//       if (req.query) {
//         const {
//           title,
//           description,
//           category,
//           features,
//           price,
//           revisions,
//           time,
//           shortDesc,
//         } = req.query;
//         const prisma = new PrismaClient();
//         const oldData = await prisma.gigs.findUnique({
//           where: { id: parseInt(req.params.gigId) },
//         });
//         await prisma.gigs.update({
//           where: { id: parseInt(req.params.gigId) },
//           data: {
//             title,
//             description,
//             deliveryTime: parseInt(time),
//             category,
//             features,
//             price: parseInt(price),
//             shortDesc,
//             revisions: parseInt(revisions),
//             createdBy: { connect: { id: parseInt(req.userId) } },
//             images: fileNames,
//           },
//         });
//         oldData?.images.forEach((image) => {
//           if (existsSync(`uploads/${image}`)) unlinkSync(`uploads/${image}`);
//         });

//         return res.status(201).send("Successfully Eited the gig.");
//       }
//     }
//     return res.status(400).send("All properties should be required.");
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send("Internal Server Error");
//   }
// };

// export const searchGigs = async (req, res, next) => {
//   try {
//     if (req.query.searchTerm || req.query.category) {
//       const prisma = new PrismaClient();
//       const gigs = await prisma.gigs.findMany(
//         createSearchQuery(req.query.searchTerm, req.query.category)
//       );
//       return res.status(200).json({ gigs });
//     }
//     return res.status(400).send("Search Term or Category is required.");
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send("Internal Server Error");
//   }
// };

// const createSearchQuery = (searchTerm, category) => {
//   const query = {
//     where: {
//       OR: [],
//     },
//     include: {
//       reviews: {
//         include: {
//           reviewer: true,
//         },
//       },
//       createdBy: true,
//     },
//   };
//   if (searchTerm) {
//     query.where.OR.push({
//       title: { contains: searchTerm, mode: "insensitive" },
//     });
//   }
//   if (category) {
//     query.where.OR.push({
//       category: { contains: category, mode: "insensitive" },
//     });
//   }
//   return query;
// };

// const checkOrder = async (userId, gigId) => {
//   try {
//     const prisma = new PrismaClient();
//     const hasUserOrderedGig = await prisma.orders.findFirst({
//       where: {
//         buyerId: parseInt(userId),
//         gigId: parseInt(gigId),
//         isCompleted: true,
//       },
//     });
//     return hasUserOrderedGig;
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const checkGigOrder = async (req, res, next) => {
//   try {
//     if (req.userId && req.params.gigId) {
//       const hasUserOrderedGig = await checkOrder(req.userId, req.params.gigId);
//       return res
//         .status(200)
//         .json({ hasUserOrderedGig: hasUserOrderedGig ? true : false });
//     }
//     return res.status(400).send("userId and gigId is required.");
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send("Internal Server Error");
//   }
// };

// export const addReview = async (req, res, next) => {
//   try {
//     if (req.userId && req.params.gigId) {
//       if (await checkOrder(req.userId, req.params.gigId)) {
//         if (req.body.reviewText && req.body.rating) {
//           const prisma = new PrismaClient();
//           const newReview = await prisma.reviews.create({
//             data: {
//               rating: req.body.rating,
//               reviewText: req.body.reviewText,
//               reviewer: { connect: { id: parseInt(req?.userId) } },
//               gig: { connect: { id: parseInt(req.params.gigId) } },
//             },
//             include: {
//               reviewer: true,
//             },
//           });
//           return res.status(201).json({ newReview });
//         }
//         return res.status(400).send("ReviewText and Rating are required.");
//       }
//       return res
//         .status(400)
//         .send("You need to purchase the gig in order to add review.");
//     }
//     return res.status(400).send("userId and gigId is required.");
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send("Internal Server Error");
//   }
// };


import prisma from "../prismaClient.js";
import { existsSync, renameSync, unlinkSync } from "fs";

export const addGig = async (req, res) => {
  try {
    if (!req.files || !req.query) {
      return res.status(400).send("All properties should be required.");
    }

    const fileKeys = Object.keys(req.files);
    const fileNames = fileKeys.map((file) => {
      const fileName = Date.now() + req.files[file].originalname;
      renameSync(req.files[file].path, `uploads/${fileName}`);
      return fileName;
    });

    const { title, description, category, features, price, revisions, time, shortDesc } = req.query;

    await prisma.gigs.create({
      data: {
        title,
        description,
        deliveryTime: parseInt(time),
        category,
        features,
        price: parseInt(price),
        shortDesc,
        revisions: parseInt(revisions),
        createdBy: { connect: { id: req.userId } },
        images: fileNames,
      },
    });

    res.status(201).send("Successfully created the gig.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export const getUserAuthGigs = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(400).send("UserId is required.");
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { gigs: true },
    });

    res.status(200).json({ gigs: user?.gigs ?? [] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export const getGigData = async (req, res) => {
  try {
    if (!req.params.gigId) {
      return res.status(400).send("GigId is required.");
    }

    const gig = await prisma.gigs.findUnique({
      where: { id: parseInt(req.params.gigId) },
      include: {
        reviews: { include: { reviewer: true } },
        createdBy: true,
      },
    });

    if (!gig) {
      return res.status(404).send("Gig not found.");
    }

    const userWithGigs = await prisma.user.findUnique({
      where: { id: gig.createdBy.id },
      include: { gigs: { include: { reviews: true } } },
    });

    const totalReviews = userWithGigs.gigs.reduce((acc, g) => acc + g.reviews.length, 0);
    const averageRating = totalReviews
      ? (userWithGigs.gigs.reduce((acc, g) => acc + g.reviews.reduce((sum, r) => sum + r.rating, 0), 0) / totalReviews).toFixed(1)
      : "0.0";

    res.status(200).json({ gig: { ...gig, totalReviews, averageRating } });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export const editGig = async (req, res) => {
  try {
    if (!req.files || !req.query || !req.params.gigId) {
      return res.status(400).send("All properties should be required.");
    }

    const fileKeys = Object.keys(req.files);
    const fileNames = fileKeys.map((file) => {
      const fileName = Date.now() + req.files[file].originalname;
      renameSync(req.files[file].path, `uploads/${fileName}`);
      return fileName;
    });

    const oldData = await prisma.gigs.findUnique({
      where: { id: parseInt(req.params.gigId) },
    });

    await prisma.gigs.update({
      where: { id: parseInt(req.params.gigId) },
      data: {
        ...req.query,
        price: parseInt(req.query.price),
        deliveryTime: parseInt(req.query.time),
        revisions: parseInt(req.query.revisions),
        createdBy: { connect: { id: parseInt(req.userId) } },
        images: fileNames,
      },
    });

    oldData?.images.forEach((image) => {
      if (existsSync(`uploads/${image}`)) unlinkSync(`uploads/${image}`);
    });

    res.status(201).send("Successfully edited the gig.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export const searchGigs = async (req, res) => {
  try {
    if (!req.query.searchTerm && !req.query.category) {
      return res.status(400).send("Search Term or Category is required.");
    }

    const gigs = await prisma.gigs.findMany(
      createSearchQuery(req.query.searchTerm, req.query.category)
    );

    res.status(200).json({ gigs });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const createSearchQuery = (searchTerm, category) => ({
  where: {
    OR: [
      searchTerm ? { title: { contains: searchTerm, mode: "insensitive" } } : {},
      category ? { category: { contains: category, mode: "insensitive" } } : {},
    ],
  },
  include: {
    reviews: { include: { reviewer: true } },
    createdBy: true,
  },
});

const checkOrder = async (userId, gigId) => {
  try {
    return await prisma.orders.findFirst({
      where: {
        buyerId: parseInt(userId),
        gigId: parseInt(gigId),
        isApproved: true, // ✅ FIX: Replaced `isCompleted` with `isApproved`
      },
    });
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const checkGigOrder = async (req, res) => {
  try {
    if (!req.userId || !req.params.gigId) {
      return res.status(400).send("userId and gigId are required.");
    }

    const hasUserOrderedGig = await checkOrder(req.userId, req.params.gigId);
    res.status(200).json({ hasUserOrderedGig: !!hasUserOrderedGig });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export const addReview = async (req, res) => {
  try {
    if (!req.userId || !req.params.gigId || !req.body.reviewText || !req.body.rating) {
      return res.status(400).send("All fields are required.");
    }

    if (!(await checkOrder(req.userId, req.params.gigId))) {
      return res.status(400).send("You need to purchase the gig to add a review.");
    }

    const newReview = await prisma.reviews.create({
      data: {
        rating: req.body.rating,
        reviewText: req.body.reviewText,
        reviewer: { connect: { id: parseInt(req.userId) } },
        gig: { connect: { id: parseInt(req.params.gigId) } },
      },
      include: { reviewer: true },
    });

    res.status(201).json({ newReview });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
