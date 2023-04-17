import React, { FC, useState, useEffect } from 'react';
import { Box, Card, CardContent, CardMedia, Grid, Typography, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import apiRequest from '@/api/Api';
import { getSessionData } from '@/utils/AuthManager';
import { convertToDollars } from '@/utils/formats';
import { Modal } from '@/components';
import EditPropertyForm from './editPropertyForm';

type Property = {
  id: number;
  title: string;
  price: number;
  address: string;
  images: string[];
};

const CurrentProperties: FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [workspaceIDSelected, setWorkspaceIDSelected] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleCloseEditForm = () => {
    setOpenEditForm(false);
    fetchProperties();
  };

  const handleOpenEditForm = (workspaceID: string) => {
    setWorkspaceIDSelected(workspaceID);
    setOpenEditForm(true);
  };

  const handleDelete = async (workspaceID: string) => {
    const response = await apiRequest('DELETE', `workspaces/delete/${workspaceID}`);

    if (response.success) {
      enqueueSnackbar('Workspace deleted successfully', { variant: 'success' });
      fetchProperties();
    } else {
      enqueueSnackbar(`Workspace delete failed: ${response.message}`, { variant: 'error' });
    }
  };

  const fetchProperties = async () => {
    const userId = getSessionData().id;
    const response = await apiRequest<Property[]>('GET', `workspaces/byuser/${userId}`);

    if (response.success) {
      setProperties(response.data);
    } else {
      console.error('Failed to fetch properties:', response.message);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [properties]);

  return (
    <Grid container spacing={2}>
      <Modal open={openEditForm} handleClose={handleCloseEditForm}>
        {workspaceIDSelected !== '' && <EditPropertyForm workspaceID={workspaceIDSelected} close={handleCloseEditForm} />}
      </Modal>
      {Array.isArray(properties.data) &&
        properties.data.map((property: any) => (
          <Grid item xs={12} md={6} key={property.WorkspaceID}>
            <Card>
              <CardContent>
                <Typography variant="h5">{convertToDollars(property.Price)}</Typography>
                <Typography variant="h5">{property.PropertyName}</Typography>
                <Typography variant="body1">{property.PropertyAddress}</Typography>
                <Box mt={2}>
                  <Grid container spacing={1}>
                    {property.imagesWorkspace.map(
                      (image: any, index: number) =>
                        image.image_URL !== '' && (
                          <Grid item xs={6} sm={3} key={index}>
                            <CardMedia component="img" image={image.image_URL} />
                          </Grid>
                        )
                    )}
                  </Grid>
                </Box>
                <Box mt={2}>
                  <Button variant="contained" color="primary" onClick={() => handleOpenEditForm(property.WorkspaceID)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" sx={{ ml: 1 }} onClick={() => handleDelete(property.WorkspaceID)}>
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
};

export default CurrentProperties;
