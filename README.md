# Groovz-Client 

<p align="center">
  <img src="https://res.cloudinary.com/dnvhmjaoc/image/upload/c_fit,h_300,w_900/v1692269864/Groovz_srodcp.png" alt="Logo">
</p>

Welcome to the Groovz client repository! This project is an e-commerce application designed for headphones and speakers enthusiasts. Beyond being a virtual store, it serves as a practical example of full-stack development. As you explore, please be aware that while you can conduct "purchases" within the platform, all transactions are in test mode (courtesy of Stripe) and no real purchases will be processed.
#### Link to the website [Groovz](https://groovz.netlify.app/)
#### Link to the client side [Groovz-client](https://github.com/Jogopin/Groovz-client)
## Tech Stack
MongoDB, Express.js, Node.js, Stripe, Nodemailer, Cloudinary
## Endpoints
### Auth Routes

| Method | URL            | Description                                                    |
|--------|----------------|----------------------------------------------------------------|
| POST   | /auth/signup   | Creates a new user in the database                              |
| POST   | /auth/login    | Verifies username and password and returns a JWT                |
| GET    | /auth/verify   | Verifies the JWT stored on the client                          |
| GET    | /auth/user/:id | Retrieves details of a user based on their ID                   |
| PUT    | /auth/user/:id | Updates details of a user based on their ID                     |

### Order Routes

| Method | URL           | Description                                       |
|--------|---------------|---------------------------------------------------|
| GET    | /orders/:id   | Retrieves orders for a user based on their ID      |

### Payment Routes

| Method | URL           | Description                                              |
|--------|---------------|----------------------------------------------------------|
| POST   | /checkout     | Initiates a Stripe checkout session for the products      |
| POST   | /webhook      | Handles Stripe Webhook events                             |

### Product Routes

| Method | URL           | Description                                               |
|--------|---------------|-----------------------------------------------------------|
| POST   | /products     | Creates a new product in the database (admin only)        |
| POST   | /upload       | Uploads an image to Cloudinary and returns the image URL   |
| GET    | /products     | Retrieves a list of all products                           |
| GET    | /products/:id | Retrieves a single product by its ID                       |

### Review Routes

| Method | URL               | Description                                              |
|--------|-------------------|----------------------------------------------------------|
| POST   | /reviews          | Creates a new review in the database  |
| GET    | /reviews/:productId | Retrieves a list of all reviews for a specific product   |

Note: The `:id` and `:productId` in the URLs are placeholders for actual IDs, which must be valid MongoDB ObjectId formats.

## Installation & Setup
1. To install the project, please fork the repository and run npm install in the terminal.
2. Create a `.env` file in the root directory and set the next environment variable
    
    - PORT: The port on which the server will run (e.g., 5005).
    - ORIGIN: The origin allowed to make requests to this server (e.g., http://localhost:5173).
    - TOKEN_SECRET: Secret key used for JWT token generation and verification.
    - CLOUDINARY_NAME: Cloudinary cloud name for image hosting.
    - CLOUDINARY_KEY: Cloudinary API key.
    - CLOUDINARY_SECRET: Cloudinary API secret.
    - PUBLISHABLE_KEY: Stripe publishable key for payment handling.
    - STRIPE_SECRET_KEY: Stripe secret key for payment handling.    
    - WEBHOOK_ENDPOINT_SECRET: Stripe webhook secret for handling web events.
    - CONTACT_EMAIL: The email address from which order confirmation and other notifications are sent.
    - CONTACT_EMAIL_PASSWORD: The password for the contact email.

3. To run the application, please use npm run dev in the terminal.

## Disclaimer
Please remember that Groovz is a demo project. The Stripe integration is in test mode, and no real transactions will be processed.

Thank you for checking out Groovz-server! If you'd like to see the client-side implementation, head over to the [Groovz-client repository](https://github.com/Jogopin/Groovz-client).

© 2023 Jonnathan Gomez Pineda. All rights reserved.