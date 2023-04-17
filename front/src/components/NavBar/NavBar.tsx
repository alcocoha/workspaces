import React, { useState, FC, MouseEvent, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AdbIcon from '@mui/icons-material/Adb';
import Button from '@mui/material/Button';
import { Modal, RegisterForm, LoginForm } from '@/components';
import { useAuthContext } from '@/state/AuthContext';
import { useRouter } from 'next/router';

interface NavBarProps {
  pageTitle: string;
  showCreate?: boolean;
  showTable?: boolean;
}

const NavBar: FC<NavBarProps> = ({ pageTitle }) => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [openRegisterForm, setOpenRegisterForm] = useState<boolean>(false);
  const [openLoginForm, setOpenLoginForm] = useState<boolean>(false);
  const { isLoggedIn, setLoggedIn } = useAuthContext();
  const router = useRouter();

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleLogin = () => {
    // Aquí puedes agregar la lógica de inicio de sesión
    // setLoggedIn(true);
  };

  const handleLogout = () => {
    // Aquí puedes agregar la lógica de cierre de sesión
    sessionStorage.removeItem('sessionInfo');
    setLoggedIn(false);
  };

  const handleOpenRegisterForm = () => {
    setOpenRegisterForm(true);
  };

  const handleCloseRegisterForm = () => {
    setOpenRegisterForm(false);
  };

  const handleOpenLoginForm = () => {
    setOpenLoginForm(true);
  };

  const handleCloseLoginForm = () => {
    setOpenLoginForm(false);
  };

  const handleCloseModal = () => {
    setOpenLoginForm(false);
  };

  const handleProfile = () => {
    router.push('/my-workspace');
  };

  const redirectHome = () => {
    router.push('/');
  };

  useEffect(() => {}, [isLoggedIn]);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Modal open={openRegisterForm} handleClose={handleCloseRegisterForm}>
          <RegisterForm />
        </Modal>
        <Modal open={openLoginForm} handleClose={handleCloseLoginForm}>
          <LoginForm closeModal={handleCloseModal} />
        </Modal>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={redirectHome}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            My Workspace
          </Typography>

          <Box sx={{ flexGrow: 1 }}></Box>

          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {pageTitle}
          </Typography>
          {!isLoggedIn ? (
            <>
              <Button color="inherit" onClick={handleOpenLoginForm}>
                Login
              </Button>
              <Button color="inherit" onClick={handleOpenRegisterForm}>
                Register
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={handleProfile}>
                Profile
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
