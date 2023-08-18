const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  let options = {
    include: {
      prices: {
        include: {
          price: true,
          feature: true,
        },
      },
      categories: true,
    },
  };

  const { id, limit, skip } = req.query;

  if (id && (limit || skip))
    return res.status(400).send("Cannot use id parameter with skip & limit");

  id ? (options.where = { id: parseInt(id) }) : null;
  limit ? (options.take = parseInt(limit)) : null;
  skip ? (options.skip = parseInt(skip)) : null;

  try {
    const plans = id ? await prisma.plan.findUnique(options) : await prisma.plan.findMany(options);
    res.status(200).send(plans);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    console.dir(data, { depth: null });
    const priceFeatures = data?.prices?.map((priceFeature) => {
      return {
        displayPriority: priceFeature.displayPriority,
        allowance: priceFeature.allowance,
        price: {
          create: {
            price: priceFeature.price.price,
            market: priceFeature.price.market,
            type: priceFeature.price.type,
          },
        },
        feature: {
          create: {
            title: priceFeature.feature.title,
          },
        },
      };
    });

    const categories = data?.categories?.map((category) => {
      return {
        title: category.title,
      };
    });

    let createdPlan = await prisma.plan.create({
      data: {
        title: data.title,
        prices: {
          create: priceFeatures,
        },
        categories: {
          create: categories,
        },
      },
      include: {
        prices: {
          include: {
            price: true,
            feature: true,
          },
        },
        categories: true,
      },
    });
    res.status(200).send(createdPlan);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/", async (req, res) => {
  try {
    const { id, title } = req.body;
    const updatedPlan = await prisma.plan.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title: title,
      },
    });
    res.status(200).send(updatedPlan);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/", async (req, res) => {
  try {
    const id = req.query.id;
    const deletedPlan = await prisma.plan.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).send(deletedPlan);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
