import React, { FC } from 'react';
import { Grid, Typography } from '@mui/material';

import AddPropertyForm from './addPropertyForm';
import CurrentProperties from './currentProperties';
import withAuth from '@/hocs/withAuth';

const MyWorkspace: FC = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography variant="h4" gutterBottom>
          Add Property
        </Typography>
        <AddPropertyForm />
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h4" gutterBottom>
          Current Properties
        </Typography>
        <CurrentProperties />
      </Grid>
    </Grid>
  );
};

export default withAuth(MyWorkspace);
