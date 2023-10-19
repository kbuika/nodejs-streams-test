const Plan = require("../database/models/Plan");

exports.planWithSubscriptions = async (req, res) => {
  try {
    const plansWithSubscriptions = await Plan.aggregate([
      {
        $match: { status: "A" },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "plan_id",
          as: "subscriptions",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          subscriptionCount: { $size: "$subscriptions" },
        },
      },
    ]);

    res.status(200).json(plansWithSubscriptions);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};
