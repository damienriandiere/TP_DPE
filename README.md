# TP_DPE

This project is freely inspired by the COO application (https://www.cooapp.fr/)

The aim is to: 

 - To meet the same constraints of folder architecture and architectural division as in previous subjects;

 - each collection created on the DB must be prefixed by your trigram.

 - Produce the server to answer the following requests:

 The purpose of this new server is to offer an API allowing a user to make geolocation searches of home for sale using only the DPE GES (Diagnostic of Energy Performance/ Greenhouse Gas) and a postal code.

Each user will be able to: 

 - create an account with name, email and password.
 - log in with email and password, to then use all other APIs secured by a JWT
 - search for the geolocation (latitude ,longitude ) of a property for sale by providing the postal code of the municipality where the property is located and the two values DPE and GES.( see below, for lat/lon search algo).
    You will have to limit the number of results, or add search criteria to limit the number of results.
    The search criterion on the surface must be provided with a precise value ( 153m2 for example rounding to the unit) or between terminals ( 150m2< X < 200m2 ).
    The search for dates must also be done on a specific date or on terminals. Dates must be searched on all three dates (at least one date must match).

 - retrieve all the results of previous searches: the user’s searches must be saved.
 - delete a search result
 - relaunch a search already carried out

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Tests](#tests)
- [Project structure](#project-structure)
- [License](#license)

## Installation

1. Clone the repository

```bash	
git clone https://github.com/damienriandiere/TP_DPE.git
```
2. Navigate to the project directory

```bash
cd TP_DPE
```

3. Install dependencies

```bash
npm install
```

4. Rename `sample.env` to `.env` and fix the variables.
```bash
mv sample.env .env
```


## Usage

```bash
npm run dev
```

## Tests

> To run the tests, use :

```bash
npm run test
```

## Project structure

```
|── __test__ # Tests
│   ├── services # Services tests
├── src # Source code
│   ├── controllers # Controllers for each route
│   ├── interfaces # Interfaces for each entity
│   ├── middlewares # Middlewares like error handler or auth
│   ├── models # Models for each entity
│   ├── routes # Routes for requests
│   ├── services # Services for data manipulation and logic
│   ├── types # Types for each entity
│   ├── utils # Utils for common functions
│   └── app.ts # App entry point
|── .env # Environment variables
|── jest.config.js # Jest config
|── package.json # Package.json
|── package-lock.json # Package-lock.json
|── README.md # Readme
|── tsconfig.json # Typescript config
```

## License

This project is licensed under the terms of the

[MIT](https://choosealicense.com/licenses/mit/)