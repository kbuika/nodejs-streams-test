const fs = require("fs");
const { Transform } = require("stream");
const Subscription = require("../database/models/Subscription");
const Plan = require("../database/models/Plan");

exports.generateCSV = async (req, res, next) => {
  const filterStream = new Transform({
    objectMode: true,
    async transform(chunk, encoding, callback) {
      try {
        console.log("chunks", chunk);
        const plan = await Plan.findOne({ _id: chunk.plan_id }).exec();
        console.log(plan, "plan");
        if (plan && plan.price < 50) {
          this.push(chunk);
        }
        callback();
      } catch (error) {
        callback(error);
      }
    },
  });

  const writeStream = fs.createWriteStream(
    "subscriptions_over_or_equal_to_50.csv"
  );

  // Define CSV header
  writeStream.write("business_id,email,plan_id,payment_platform_name\n");

  Subscription.find({})
    .cursor()
    .pipe(filterStream)
    .on("data", (subscription) => {
      writeStream.write(
        `${subscription.business_id},${subscription.email},${subscription.plan_id},${subscription.payment_platform.name}\n`
      );
    })
    .on("end", () => {
      writeStream.end();
      console.log("CSV file writing completed.");
      // Set the response headers to indicate a downloadable file
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=subscriptions_over_or_equal_to_50.csv"
      );
      res.setHeader("Content-Type", "text/csv");

      const file = fs.createReadStream("subscriptions_over_or_equal_to_50.csv");
      file.pipe(res);
    })
    .on("error", (error) => {
      console.error("Error writing to the CSV file:", error);
      res.status(500).send("Internal Server Error");
    });
};
