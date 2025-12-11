# Libera - A Modern Library Management System


Libera is a comprehensive library management system designed to streamline the process of borrowing and managing books. It features a powerful backend API built with Laravel and a user-friendly frontend web application built with React.

## Features

- **User Management:** Secure user registration and authentication.
- **Book Catalog:** Easily browse and search for available books.
- **Borrowing System:** Simple and efficient book borrowing and returning process.
- **Admin Dashboard:** A powerful dashboard for librarians to manage books, users, and transactions.
- **Notifications:** Keep users informed about their borrowing activities.

## Project Structure

The project is organized into two main directories:

- `/backend`: Contains the Laravel-based backend API.
- `/frontend`: Contains the React-based frontend application.

## Installation Guide

To get the Libera project up and running on your local machine, please follow the steps below.

### Prerequisites

- [PHP](https://www.php.net/downloads.php) >= 8.1
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) >= 18.x
- [NPM](https://www.npmjs.com/)

### 1. Backend Setup (Laravel)

First, set up the backend API:

```bash
# Navigate to the backend directory
cd backend

# Install PHP dependencies
composer install

# Create a copy of the .env file
cp .env.example .env

# Generate an application key
php artisan key:generate

# Run the database migrations and seed the database
# (Make sure you have a database configured in your .env file)
php artisan migrate --seed
```

### 2. Frontend Setup (React)

Next, set up the frontend application:

```bash
# Navigate to the frontend directory from the root
cd frontend

# Install JavaScript dependencies
npm install
```

## Running the Application

### Backend

To start the Laravel development server, run the following command from the `/backend` directory:

```bash
php artisan serve
```

The API will be available at `http://127.0.0.1:8000`.

### Frontend

To start the React development server, run the following command from the `/frontend` directory:

```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173`.

## Contributing

We welcome contributions to the Libera project. Please feel free to fork the repository, make your changes, and submit a pull request.
