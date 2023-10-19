// this is for data mocking - not a core functionality
const Plan = require("../database/models/Plan");
const Subscription = require("../database/models/Subscription");
const { faker } = require("@faker-js/faker");

exports.generateMockData = async (req, res, next) => {
  try {
    const plans = [
      {
        name: "Platinum",
        price: 100,
        period: "monthly",
        status: "A",
        features: {
          videos: true,
          audio: true,
          download: true,
          streaming: true,
          customize: true,
        },
      },
      {
        name: "Gold",
        price: 70,
        period: "monthly",
        status: "A",
        features: {
          videos: true,
          audio: true,
          download: false,
          streaming: true,
          customize: true,
        },
      },
      {
        name: "Silver",
        price: 50,
        period: "monthly",
        status: "A",
        features: {
          videos: true,
          audio: true,
          download: false,
          streaming: false,
          customize: true,
        },
      },
      {
        name: "Bronze",
        price: 30,
        period: "monthly",
        status: "A",
        features: {
          videos: true,
          audio: true,
          download: false,
          streaming: false,
          customize: false,
        },
      },
      {
        name: "Freemium",
        price: 0,
        period: "monthly",
        status: "A",
        features: {
          videos: false,
          audio: true,
          download: false,
          streaming: false,
          customize: false,
        },
      },
      {
        name: "Freemium",
        price: 0,
        period: "monthly",
        status: "A",
        features: {
          videos: false,
          audio: true,
          download: false,
          streaming: false,
          customize: false,
        },
      },
    ];

    const createdPlans = await Plan.insertMany(plans);

    const subscriptionCounts = {
      Freemium: 500,
      Bronze: 7000,
      Silver: 12000,
      Gold: 8000,
      Platinum: 5000,
    };

    for (const planName in subscriptionCounts) {
      if (subscriptionCounts.hasOwnProperty(planName)) {
        const plan = createdPlans.find((p) => p.name === planName);

        for (let i = 0; i < subscriptionCounts[planName]; i++) {
          const business_id = faker.string.uuid();
          const email = faker.internet.email();
          const payment_platform = {
            token: faker.string.alphanumeric(16),
            external_id: faker.string.alphanumeric(16),
            name: faker.helpers.arrayElement(["Stripe", "Paypal"]),
          };

          const subscription = new Subscription({
            business_id,
            email,
            plan_id: plan._id,
            payment_platform,
          });

          await subscription.save();
        }
      }
    }

    console.log(
      "Mock data has been successfully generated and populated into the database."
    );
    res.status(200).json({
      message: "Mock data has been generated successfully",
    });
  } catch (error) {
    console.error("Error generating and populating data:", error);
    res.status(500).json({
      message: "Something went wrong, could not generate mock data",
    });
  } finally {
  }
};
