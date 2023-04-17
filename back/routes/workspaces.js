//Modules are loaded
//The uuidv4 module generates ID's automatically.
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  queryInsert,
  querySelect,
  querySelectAsync,
  queryUpdate,
  queryDelete,
} from '../db/db.js';

//middlewares express.Router().
const workspacesRoute = express.Router();

/**
 * Method: GET
 * To get all workspaces
 * End-point to see all Workspaces created.
 */
workspacesRoute.get('/all', async (req, res) => {
  const workspaces = await querySelectAsync('SELECT * FROM Workspaces');
  const workspacesImages = await querySelectAsync(
    'SELECT * FROM Workspaces_Image'
  );
  const images = await querySelectAsync('SELECT * FROM Images');

  const result = workspaces.map((item) => {
    const imagesIDs = workspacesImages
      .filter((img) => img.WorkspaceID === item.WorkspaceID)
      .map((img) => img.ImageID);

    const imagesWorkspace = images
      .filter((img) => imagesIDs.includes(img.ImageID))
      .filter((img) => img.image_URL !== '');
    return { ...item, imagesWorkspace };
  });

  res.json({
    status: 'ok',
    data: result,
  });
});

/**
 * Method: GET
 * To get the properties for a specific user.
 * End point to see the workspace by an user.
 */
workspacesRoute.get('/byuser/:id', async (req, res) => {
  const workspaces = await querySelectAsync(
    `SELECT * FROM Workspaces WHERE UserID = '${req.params.id}'`
  );
  const workspacesImages = await querySelectAsync(
    'SELECT * FROM Workspaces_Image'
  );

  const images = await querySelectAsync('SELECT * FROM Images');

  const result = workspaces.map((item) => {
    const imagesIDs = workspacesImages
      .filter((img) => img.WorkspaceID === item.WorkspaceID)
      .map((img) => img.ImageID);
    const imagesWorkspace = images.filter((img) =>
      imagesIDs.includes(img.ImageID)
    );
    return { ...item, imagesWorkspace };
  });

  res.json({
    status: 'ok',
    data: result,
  });
});

/**
 * Method: GET
 * To get all workspaces images
 */
workspacesRoute.get('/images', (req, res) => {
  querySelect('SELECT * FROM Images', (workspacesImages) => {
    res.json({
      status: 'ok',
      data: JSON.parse(workspacesImages),
    });
  });
});

/**
 * Method: POST
 * Create a workspace with all their attributes.
 */
workspacesRoute.post('/create', function (req, res) {
  const { property, address, city, postCode, price, images, id } = req.body;

  const workspaceID = uuidv4();
  queryInsert({
    table: 'Workspaces',
    columns: [
      'WorkspaceID',
      'PropertyName',
      'PropertyAddress',
      'CityID',
      'PostalCode',
      'GoogleMap',
      'TypeID',
      'Size',
      'NoOfCoworker',
      'Parking',
      'Smoking',
      'DateAvailable',
      'LeaseID',
      'Price',
      'UserID',
      'Availability',
      'BookingStartDate',
      'BookingEndDate',
      'ReachTransp',
    ],
    columnsValue: [
      workspaceID,
      property,
      address,
      city,
      postCode,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      price,
      id,
      null,
      null,
      null,
      null,
    ],
  });
  images.forEach((item) => {
    const imgID = uuidv4();
    queryInsert({
      table: 'Images',
      columns: ['ImageID', 'image_URL'],
      columnsValue: [imgID, item],
    });
    queryInsert({
      table: 'Workspaces_Image',
      columns: ['Workspace_ImageID', 'ImageID', 'WorkspaceID'],
      columnsValue: [uuidv4(), imgID, workspaceID],
    });
  });

  res.json({
    status: 'ok',
    message: 'workspace created successfully',
  });
});

// Function that Select the workspaces by ID.
async function workspaceByID(id) {
  const workspace = await querySelectAsync(
    `SELECT * FROM Workspaces WHERE WorkspaceID = '${id}'`
  );
  const workspacesImages = await querySelectAsync(
    'SELECT * FROM Workspaces_Image'
  );
  const images = await querySelectAsync('SELECT * FROM Images');
  const result = workspace.map((item) => {
    const imagesIDs = workspacesImages
      .filter((img) => img.WorkspaceID === item.WorkspaceID)
      .map((img) => img.ImageID);
    const newImages = imagesIDs.map((item) =>
      images.find((img) => img.ImageID === item)
    );
    return { ...item, images: newImages };
  });
  return result[0];
}

workspacesRoute.get('/byid/:id', async (req, res) => {
  const result = await workspaceByID(req.params.id);
  res.json({
    status: 'ok',
    data: result,
  });
});

/**
 * Method: PUT
 * To update the workspaces by an ID.
 * End point to update the workspace by an ID. .
 */

workspacesRoute.put('/update/:id', async (req, res) => {
  const { property, city, postCode, address, price, images } = req.body;
  console.log('req.body', req.body);
  const workspacesImages = await querySelectAsync(
    `SELECT * FROM Workspaces_Image WHERE WorkspaceID = '${req.params.id}'`
  );
  queryUpdate({
    table: 'Workspaces',
    fields: [
      'PropertyName',
      'CityID',
      'PostalCode',
      'PropertyAddress',
      'Price',
    ],
    fieldsValue: [property, city, postCode, address, price],
    whereCondition: `WorkspaceID = '${req.params.id}'`,
  });
  images.forEach((item) => {
    if (item.id === null && workspacesImages.length <= 4 && item.url !== '') {
      const imgID = uuidv4();
      queryInsert({
        table: 'Images',
        columns: ['ImageID', 'image_URL'],
        columnsValue: [imgID, item.url],
      });
      queryInsert({
        table: 'Workspaces_Image',
        columns: ['Workspace_ImageID', 'ImageID', 'WorkspaceID'],
        columnsValue: [uuidv4(), imgID, req.params.id],
      });
    } else {
      queryUpdate({
        table: 'Images',
        fields: ['image_URL'],
        fieldsValue: [item.url],
        whereCondition: `ImageID = '${item.id}'`,
      });
    }
  });
  res.json({
    status: 'ok',
    data: 'data updated successfully',
  });
});

/**
 * Method: DELETE
 * To delete a workspace by ID.
 * End point to delete a workspace by ID.
 */

workspacesRoute.delete('/delete/:id', async (req, res) => {
  const workspace = await workspaceByID(req.params.id);
  workspace.images.forEach((img) => {
    if (img !== undefined) {
      queryDelete(img.ImageID, 'Workspaces_Image', 'ImageID');
      queryDelete(img.ImageID, 'Images', 'ImageID');
    }
  });
  queryDelete(req.params.id, 'Workspaces', 'WorkspaceID');
  res.json({
    status: 'ok',
    data: 'Workspace deleted!',
  });
});
export default workspacesRoute;
