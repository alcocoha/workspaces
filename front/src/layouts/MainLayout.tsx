import React, { FC, PropsWithChildren } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { NavBar } from '@/components';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { orange } from '@mui/material/colors';

type LayoutProps = PropsWithChildren<{
  pageTitle: string;
}>;

const theme = createTheme({
  palette: {
    primary: {
      main: orange[500],
    },
  },
});

const MainLayout: FC<LayoutProps> = ({ pageTitle, children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <NavBar pageTitle={pageTitle} />
        <Container maxWidth="xl">
          <Box my={4}>{children}</Box>
        </Container>
        <Box mt="auto">
          <Container maxWidth="xl">
            <Box py={2} borderTop={1} borderColor="divider">
              <Typography variant="body2" color="text.secondary" align="center">
                © {new Date().getFullYear()} Jorge Alberto Hurtado Ortega. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;
