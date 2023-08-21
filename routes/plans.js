const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const includeOptions = {
  include: {
    prices: {
      include: {
        priceFeature: {
          include: {
            price: true,
            features: {
              include: {
                categories: true,
              },
            },
          },
        },
      },
    },
  },
};

router.get("/", async (req, res) => {
  let options = JSON.parse(JSON.stringify(includeOptions));
  const { id, limit, skip } = req.query;

  if (id && (limit || skip))
    return res.status(400).send("Cannot use id parameter with skip & limit");

  id ? (options.where = { id: parseInt(id) }) : null;
  limit ? (options.take = parseInt(limit)) : null;
  skip ? (options.skip = parseInt(skip)) : null;

  try {
    const plans = id
      ? await prisma.plan.findUnique(includeOptions)
      : await prisma.plan.findMany(includeOptions);

    res.status(200).send(plans);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
  try {
    let { title, prices } = req.body;

    let pricesToCreate = prices.map((price) => {
      return {
        price: price.price,
        market: price.market,
        type: price.type,
        priceFeature: {
          create: {
            displayPriority: price.priceFeature.displayPriority,
            allowance: price.priceFeature.allowance,
            features: {
              create: [
                ...price.priceFeature.features.map((el) => {
                  return {
                    title: el.title,
                    categories: {
                      create: [
                        ...el.categories.map((el) => {
                          return {
                            title: el.title,
                          };
                        }),
                      ],
                    },
                  };
                }),
              ],
            },
          },
        },
      };
    });
    let createdPlan = await prisma.plan.create({
      data: {
        title: title,
        prices: {
          create: pricesToCreate,
        },
      },
      ...includeOptions,
    });
    res.status(200).send(createdPlan);
  } catch (err) {
    console.error(err);
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
      ...includeOptions
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
