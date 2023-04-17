//Modules are loaded
//The uuidv4 module generates ID's automatically.

import express from 'express';
import { querySelect } from '../db/db.js';

//middleware
const catalogsRoute = express.Router();

/**
 * Method: GET
 * To get all roles
 */
catalogsRoute.get('/roles', (req, res) => {
  querySelect('SELECT * FROM Roles', (roles) => {
    res.json({
      status: 'ok',
      data: JSON.parse(roles),
    });
  });
});

/**
 * Method: GET
 * To get all cities
 */
catalogsRoute.get('/cities', (req, res) => {
  querySelect('SELECT * FROM Cities', (cities) => {
    res.json({
      status: 'ok',
      data: JSON.parse(cities),
    });
  });
});

/**
 * Method: GET
 * To get all leaseTeam
 */
catalogsRoute.get('/leaseTeam', (req, res) => {
  querySelect('SELECT * FROM Lease_team', (leasesTeam) => {
    res.json({
      status: 'ok',
      data: JSON.parse(leasesTeam),
    });
  });
});

/**
 * Method: GET
 * To get all types
 */
catalogsRoute.get('/types', (req, res) => {
  querySelect('SELECT * FROM Types', (types) => {
    res.json({
      status: 'ok',
      data: JSON.parse(types),
    });
  });
});

export default catalogsRoute;
