# Angry Nerds Server

Angry Nerds project Server that will interact through CRUD(create, read, update, delete) services on a Postgres database.

* [Angery Nerds Frontend](https://github.com/CPSC349-Angry-Nerds/Angery-Nerds-FE)
* [Angery Nerds Backend](https://github.com/CPSC349-Angry-Nerds/Angry-Nerds-BE)

## Live Application

* [Angery Nerds](https://angry-nerds.vercel.app/)

## Getting Started

These instructions will get you a copy of the Angry Nerds Server up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Install Node Package Manager and Visual Studio Code

### Installing

Copy git respository to local machine

```
git clone https://github.com/CPSC349-Angry-Nerds/Angry-Nerds-BE.git angry-backend
```
`cd` into the cloned repository

```
cd angry-backend
```
Make a fresh start of the git history for this project with 
```
rm -rf .git && git init
```

Install the node dependencies 

```
npm install
```

Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
then fill out postgres database information in the `.env` file.

Migrate schema into database with 
```
npm run migrate 1
```


## Running the server

The server can be ran with 
```
npm run dev
```

## Built With

* [Express](https://expressjs.com/) - Web Framework
* [NodeJS](https://nodejs.org/) - Javascript Library
* [knex](https://knexjs.org/) - Query Builder
* [Postgres](https://www.postgresql.org/) - SQL Database

## Deployment

* [Heroku](https://www.heroku.com/) - Deployment

## Authors

* **Robin Khiv**
* **Uyen Le**
* **Jose Arce**
* **Kevin Tu**
