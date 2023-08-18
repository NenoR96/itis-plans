const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const { id, limit, skip } = req.query;

  if (id && (limit || skip))
    return res.status(400).send("Cannot use id parameter with skip & limit");

  let options = {
    select: {
      id: true,
      displayPriority: true,
      allowance: true,
      plan: true,
      feature: {
        select: {
          id: true,
          title: true,
        },
      },
      price: true,
    },
  };

  id ? (options.where = { id: parseInt(id) }) : null;
  limit ? (options.take = parseInt(limit)) : null;
  skip ? (options.skip = parseInt(skip)) : null;

  try {
    const priceFeatures = id
      ? await prisma.priceFeature.findUnique(options)
      : await prisma.priceFeature.findMany(options);
    res.status(200).send(priceFeatures);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/search", async (req, res) => {
  let { text, limit, skip } = req.body;

  if (
    typeof text !== "string" ||
    !Number.isInteger(limit) ||
    !Number.isInteger(skip)
  )
    return res.status(400).send("Need to provide all parameters");
  let options = {
    where: {
      feature: {
        title: {
          contains: text,
          mode: "insensitive",
        },
      },
    },
    include: {
      plan: true,
      price: true,
      feature: true,
    },
    take: limit,
    skip,
  };
  try {
    const priceFeatures = await prisma.priceFeature.findMany(options);
    res.status(200).send(priceFeatures);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
