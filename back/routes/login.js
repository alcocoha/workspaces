//Modules are loaded
//The uuidv4 module generates ID's automatically.

import express from 'express';
import { querySelect } from '../db/db.js';

//middleware
const loginRoute = express.Router();

// ** To Login**
// Validate the email and password
loginRoute.post('/', (req, res) => {
  const { email, password } = req.body;
  querySelect('SELECT * FROM Users', (users) => {
    const data = JSON.parse(users).find(
      (item) => item.Password === password && item.EmailAddress === email
    );
    if (data === undefined) {
      return res.json({
        status: 'error',
        message: 'User or password incorrect',
      });
    }

    //Validate the kind of Roles:
    //There are three: regular, owner or administrator.
    querySelect('SELECT * FROM Roles', (roles) => {
      const role = JSON.parse(roles).find(
        (item) => item.RoleID === data.RoleID
      );
      res.json({
        status: 'ok',
        message: 'Success',
        data: {
          id: data.UserID,
          user: data.Name,
          email: data.EmailAddress,
          role: role.RoleName,
        },
      });
    });
  });
});

export default loginRoute;
