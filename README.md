<h1 align="center">MongoDB + NodeJS Streams</h1>

<div align="center">
  <h3>
    <a href="https://kudo.kibuika.com" target="_blank">
      Live Demo
    </a>
    
  </h3>
</div>

<p align="center">Please note the API is running on a free tier and so the request may take longer than expected</p>

## Project Structure

This is a Nodejs project that is responsible for data handling ( reading subscription plans and writing the data to a csv file )

It is organised in a typical Nodejs structure with the `src` directory as the main directory that holds the breadth of the application.

Within the `src`, there are other directories

    - app  - this is where the entry point of the application is

    - config - contains common configurations that can be reused

    - tests - this directory contains all the tests for the application

    - routes - contains all the API routes ( There are 3 routes, 2 are for generation functions ``mock-data`` and ``csv``, the other route if for plan functions ``breakdown`` to provide a breakdown of plans ).

Within the root of the directory, there are configuration files and:

    - .github/workflow - contains the main github actions file

#### The API routes

- POST "/api/v1/generate/mock-data" - This route generates mock data in your MongoDB database. It'll generate `5 Plans` and `32500 Subscriptions` - The request will take a while, so hopefully you have Netflix :).

- GET "/api/v1/generate/csv" - The main action was to generate a csv of all subscriptions that cost $50 and above. This route achieves that by utilizing MongoDB's aggregation operations, cursor method and NodeJS's streams.

- GET "/api/v1/plans/breakdown" - This route returns a breakdown of all plans and the number of subscriptions under each plan.

## Getting Started

To run the application here are some major prerequisites

    - Nodejs

#### Installing dependencies

run:

```bash
    npm install
```

#### Running the application

run:

```bash
    npm start
```

#### Environment variables

This project makes use of environment variables. See the `.env.example` files in each main directory to see the required environment values. Create a `.env` file and add the approprite variables and their values.

##### Viola! Happy Hacking!
