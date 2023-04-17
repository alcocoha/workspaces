import React, { FC } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { TextField, Button, Box, FormControl } from '@mui/material';
import { useAuthContext } from '@/state/AuthContext';
import apiRequest from '@/api/Api';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Must be at least 8 characters').required('Required'),
});

type LoginData = {
  id: number;
  user: string;
  email: string;
  role: string;
};

type ErrorResponse = {
  status: string;
  message: string;
};

type LoginFormProps = {
  closeModal: () => void;
};

const LoginForm: FC<LoginFormProps> = ({ closeModal }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { setLoggedIn } = useAuthContext();
  const router = useRouter();

  const handleSubmit = async (values: { email: string; password: string }) => {
    const response = await apiRequest<LoginData | ErrorResponse>('POST', 'login', {
      email: values.email,
      password: values.password,
    });
    if (response.data !== undefined && 'status' in response.data && response.data.status === 'error') {
      enqueueSnackbar(`${response.data.message}`, { variant: 'error' });
    } else if (response.success) {
      enqueueSnackbar('API request succeeded!', { variant: 'success' });
      sessionStorage.setItem('sessionInfo', JSON.stringify(response?.data?.data));
      setLoggedIn(true);
      closeModal();
      router.push('/my-workspace');
    } else {
      enqueueSnackbar(`API request failed: ${response.message}`, { variant: 'error' });
    }
  };

  return (
    <Formik initialValues={{ email: '', password: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ errors, touched }) => (
        <Form>
          <FormControl fullWidth>
            <Field
              as={TextField}
              error={errors.email && touched.email}
              helperText={<ErrorMessage name="email" />}
              name="email"
              label="Email"
              variant="outlined"
              margin="normal"
            />
          </FormControl>
          <FormControl fullWidth>
            <Field
              as={TextField}
              error={errors.password && touched.password}
              helperText={<ErrorMessage name="password" />}
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
            />
          </FormControl>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 2,
            }}
          >
            <Button type="submit">Enter</Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
