import React, { useState, useEffect, FC } from 'react';
import { Container, Box, Grid, Card, CardContent, CardMedia, Typography, TextField, Button } from '@mui/material';
import apiRequest from '@/api/Api';
import { convertToDollars } from '@/utils/formats';
import { Modal } from '@/components';

interface Workspace {
  imageUrl: string;
  price: number;
  description: string;
  address: string;
}

const Home: FC = () => {
  const [search, setSearch] = useState<string>('');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [filteredWorkspaces, setFilteredWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const response = await apiRequest<Workspace[]>('GET', 'workspaces/all');

      if (response.success) {
        setWorkspaces(response.data);
        setFilteredWorkspaces(response.data);
      } else {
        console.error('Failed to fetch workspaces:', response.message);
      }
    };

    fetchWorkspaces();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSearch = () => {
    if (Array.isArray(workspaces.data)) {
      const filtered = workspaces.data.filter((workspace: any) => workspace.PropertyName.toLowerCase().includes(search.toLowerCase()));
      setFilteredWorkspaces({ ...workspaces, data: filtered });
    }
  };

  const handleWorkspaceClick = (workspace) => {
    setSelectedWorkspace(workspace);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Container>
      <Modal open={openModal} handleClose={handleCloseModal}>
        {selectedWorkspace && (
          <Box>
            <Grid container spacing={1}>
              {selectedWorkspace.imagesWorkspace.map((image, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <CardMedia component="img" image={image.image_URL} />
                </Grid>
              ))}
            </Grid>
            <Box mt={2}>
              <Typography variant="h5">{selectedWorkspace.PropertyName}</Typography>
              <Typography variant="body1">{selectedWorkspace.PropertyAddress}</Typography>
              <Typography variant="h4">{convertToDollars(selectedWorkspace.Price)}</Typography>
            </Box>
          </Box>
        )}
      </Modal>
      <Box my={4}>
        <Box
          sx={{
            position: 'relative',
            height: 400,
            width: '100%',
            backgroundSize: 'cover',
            backgroundPosition: 0,
            backgroundImage: 'url(https://www.wework.com/ideas/wp-content/uploads/sites/4/2017/06/Collab1-1120x630.jpg)',
          }}
        >
          <div className="browser">
            <TextField
              label="Buscar"
              variant="outlined"
              value={search}
              onChange={handleChange}
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '10%',

                backgroundColor: 'white',
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '28%',
                marginLeft: '1rem',
              }}
            >
              Buscar
            </Button>
          </div>
        </Box>
        <Grid container spacing={4} marginTop={1}>
          {Array.isArray(filteredWorkspaces?.data) &&
            filteredWorkspaces?.data.map((workspace, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card onClick={() => handleWorkspaceClick(workspace)}>
                  <CardMedia component="img" height="140" image={workspace.imagesWorkspace[0].image_URL} alt="Workspace" />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {convertToDollars(workspace.Price)}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {workspace.PropertyName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {workspace.PropertyAddress}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
