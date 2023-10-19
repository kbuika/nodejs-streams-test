const fs = require("fs")
const Subscription = require("../database/models/Subscription")
const Plan = require("../database/models/Plan")
const { faker } = require("@faker-js/faker")

exports.generateCSV = async (req, res) => {
  const writeStream = fs.createWriteStream(
    "subscriptions_over_or_equal_to_50.csv"
  )

  // Define CSV header
  writeStream.write(
    "business_id,email,plan_id,plan_name,plan_price,payment_platform_name\n"
  )

  const aggregationPipeline = [
    {
      $lookup: {
        from: "plans",
        localField: "plan_id",
        foreignField: "_id",
        as: "planDetails",
      },
    },
    {
      $unwind: "$planDetails",
    },
    {
      $match: {
        "planDetails.price": { $gte: 50 },
      },
    },
    {
      $project: {
        business_id: 1,
        email: 1,
        plan_id: 1,
        plan_name: "$planDetails.name",
        plan_price: "$planDetails.price",
        payment_platform: 1,
      },
    },
  ]

  const cursor = Subscription.aggregate(aggregationPipeline).cursor()

  cursor.on("data", (subscription) => {
    // console.log("Streaming subscription:", subscription);
    writeStream.write(
      `${subscription.business_id},${subscription.email},${subscription.plan_id},${subscription.plan_name},${subscription.plan_price},${subscription.payment_platform.name}\n`
    )
  })

  cursor.on("end", () => {
    writeStream.end()
    console.log("CSV file writing completed.")
    const csvFile = "subscriptions_over_or_equal_to_50.csv"

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=subscriptions_over_or_equal_to_50.csv"
    )
    res.setHeader("Content-Type", "text/csv")

    const fileStream = fs.createReadStream(csvFile)
    fileStream.pipe(res)
  })

  cursor.on("error", (error) => {
    console.error("Error streaming data:", error)
    res.status(500).json({
      message: "An error occured while generating csv file",
      error: error,
    })
  })
}

exports.generateMockData = async (req, res) => {
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
    ]

    const createdPlans = await Plan.insertMany(plans)

    const subscriptionCounts = {
      Freemium: 500,
      Bronze: 7000,
      Silver: 12000,
      Gold: 8000,
      Platinum: 5000,
    }

    for (const planName in subscriptionCounts) {
      if (Object.prototype.hasOwnProperty.call(subscriptionCounts, planName)) {
        const plan = createdPlans.find((p) => p.name === planName)

        for (let i = 0; i < subscriptionCounts[planName]; i++) {
          const business_id = faker.string.uuid()
          const email = faker.internet.email()
          const payment_platform = {
            token: faker.string.alphanumeric(16),
            external_id: faker.string.alphanumeric(16),
            name: faker.helpers.arrayElement(["Stripe", "Paypal"]),
          }

          const subscription = new Subscription({
            business_id,
            email,
            plan_id: plan._id,
            payment_platform,
          })

          await subscription.save()
        }
      }
    }

    console.log(
      "Mock data has been successfully generated and populated into the database."
    )
    res.status(200).json({
      message: "Mock data has been generated successfully",
    })
  } catch (error) {
    console.error("Error generating and populating data:", error)
    res.status(500).json({
      message: "Something went wrong, could not generate mock data",
    })
  }
}
