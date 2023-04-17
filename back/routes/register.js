//Modules are loaded
//The uuidv4 module generates ID's automatically.

import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db, { queryInsert, querySelect } from '../db/db.js';

//middleware
const registersRoute = express.Router();

/**
 * Method: POST
 * Create a register
 */
registersRoute.post('/create', function (req, res) {
  const { name, lastName, email, password, phone, city, owner, coworker } =
    req.body;

  // Here we need to get roles
  querySelect('SELECT * FROM Users', (users) => {
    const userExist = JSON.parse(users).find(
      (item) => item.EmailAddress === email
    );
    if (userExist) {
      return res.json({
        status: 'error',
        message: 'This email is already created',
      });
    }
    querySelect('SELECT * FROM Roles', (roles) => {
      let role;
      if (owner) {
        role = JSON.parse(roles).find((item) => item.RoleName === 'Owner');
      } else if (!owner && coworker) {
        role = JSON.parse(roles).find((item) => item.RoleName === 'Coworker');
      }

      // Insert data to create a new user
      queryInsert({
        table: 'Users',
        columns: [
          'UserID',
          'CityID',
          'PaymentID',
          'RoleID',
          'Name',
          'Password',
          'EmailAddress',
          'Phone',
          'Active',
        ],
        columnsValue: [
          uuidv4(),
          city,
          null,
          role.RoleID,
          `${name} ${lastName}`,
          password,
          email,
          phone,
          1,
        ],
      });

      res.json({
        status: 'ok',
        message: 'User created successfully',
      });
    });
  });
});

/**
 * Method: GET
 * To get all the users registered
 */
registersRoute.get('/users', (req, res) => {
  querySelect('SELECT * FROM Users', (users) => {
    const data = JSON.parse(users).map((item) => ({
      ...item,
      Password: 'Not available to view',
    }));
    res.json({
      status: 'ok',
      data,
    });
  });
});

export default registersRoute;
