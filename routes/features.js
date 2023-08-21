const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const includeOptions = {
  include: {
    priceFeature: {
      select: {
        allowance: true,
        price: {
          select: {
            plan: true,
          },
        },
      },
    },
  },
};

router.get("/", async (req, res) => {
  const { id, limit, skip } = req.query;

  if (id && (limit || skip))
    return res.status(400).send("Cannot use id parameter with skip & limit");

  let options = JSON.parse(JSON.stringify(includeOptions));

  id ? (options.where = { id: parseInt(id) }) : null;
  limit ? (options.take = parseInt(limit)) : null;
  skip ? (options.skip = parseInt(skip)) : null;

  try {
    const priceFeatures = id
      ? await prisma.feature.findUnique(options)
      : await prisma.feature.findMany(options);
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
      title: {
        contains: text,
        mode: "insensitive",
      },
    },
    ...includeOptions,
    take: limit,
    skip,
  };
  try {
    const priceFeatures = await prisma.feature.findMany(options);
    res.status(200).send(priceFeatures);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
