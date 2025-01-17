# Transaction Management System

A full-stack web application for managing user accounts, balances, and transactions (deposits, withdrawals, and transfers) with a responsive design and secure user authentication.

## Features

### **User Management**
- User authentication using Clerk (e.g., Google Sign-In, ClerkID).
- Unique custom account IDs for users in the format `XXX-00000000`.

### **Transaction Management**
- Deposit, withdrawal, and transfer funds between accounts.
- Auto-updated account balances.
- Transaction history with detailed descriptions (e.g., "Transfer to XXX-00000000").

### **Frontend**
- Built with React and TypeScript.
- Responsive design using Tailwind CSS.
- UI components powered by ShadCN.
- Toast notifications for success and error alerts.

### **Backend**
- RESTful API built with Express.js.
- Database management with Prisma ORM.
- PostgreSQL for storing user and transaction data.

### **Deployment**
- Frontend hosted on **Vercel**.
- Backend API and database hosted on **Railway**.

---

## Tech Stack

### **Frontend**
- **React**: For building the UI.
- **TypeScript**: For type safety and improved development experience.
- **Tailwind CSS**: For utility-first, responsive styling.
- **ShadCN UI**: Prebuilt customizable UI components.
- **React Router**: For managing navigation.
- **Cypress**: End-to-end testing.

### **Backend**
- **Express.js**: For API routes and server-side logic.
- **Prisma**: ORM for database interactions.
- **PostgreSQL**: Relational database.
- **TypeScript**: Type-safe backend development.

### **DevOps**
- **Vercel**: Hosting for the frontend.
- **Railway**: Hosting for the backend API and database.

---

## Installation and Setup

### **Prerequisites**
- Node.js installed.
- PostgreSQL database set up.
- Environment variables configured (e.g., Clerk keys, database URL).

### **Steps**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo.git
   cd your-repo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the environment variables:**
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL=your_postgresql_url
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the backend server:**
   ```bash
   npm run start:backend
   ```

6. **Start the frontend application:**
   ```bash
   npm start
   ```

---

## API Endpoints

### **User Routes**
- `POST /api/users`: Create or fetch a user.
- `GET /api/users/:accountId/balance`: Get the balance for a specific user.

### **Transaction Routes**
- `GET /api/transactions/:accountId`: Fetch transaction history for a user.
- `POST /api/transactions`: Add a new transaction (deposit, withdrawal, or transfer).

---

## Project Structure

```
.
├── api
│   ├── routes
│   │   ├── userRoutes.ts
│   │   ├── transactionRoutes.ts
│   ├── server.mts
├── src
│   ├── components
│   │   ├── ui
│   │   │   ├── button.tsx
│   │   │   ├── toast.tsx
│   ├── contexts
│   │   ├── LoadingContext.tsx
│   ├── hooks
│   │   ├── useFetch.ts
│   │   ├── useAccountId.tsx
│   │   ├── use-toast.tsx
│   ├── pages
│   │   ├── Home.tsx
│   ├── App.tsx
│   ├── index.tsx
├── prisma
│   ├── schema.prisma
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## Deployment

### **Frontend (Vercel)**
1. Push your frontend code to a GitHub repository.
2. Connect the repository to Vercel.
3. Set the environment variables in Vercel settings (e.g., `CLERK_PUBLISHABLE_KEY`).
4. Deploy the app.

### **Backend (Railway)**
1. Push your backend code to a GitHub repository.
2. Connect the repository to Railway.
3. Set the environment variables in Railway settings (e.g., `DATABASE_URL`, `CLERK_SECRET_KEY`).
4. Deploy the API and database.

---

## Troubleshooting

- **Missing Environment Variables:** Ensure all required variables are set up in `.env`.
- **Database Issues:** Check PostgreSQL logs and Prisma migrations.
- **CORS Errors:** Update CORS configuration in the backend if accessing from a different domain.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contributing
Feel free to fork this project and submit pull requests! If you find any issues, please open an issue in the GitHub repository.

