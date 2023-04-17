// components/RegisterForm.tsx
import React, { FC, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';
import apiRequest from '@/api/Api';
import { CatalogContext } from '@/state/CatalogContext';
import * as Yup from 'yup';

const initialValues = {
  name: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  city: '',
  rentOwnWorkspace: false,
  bookWorkspace: false,
};

const validationSchema = Yup.object()
  .shape({
    name: Yup.string().required('Required'),
    lastname: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(8, 'Must be at least 8 characters').required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Required'),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, 'Invalid phone number')
      .required('Required'),
    city: Yup.string().required('Required'),
    rentOwnWorkspace: Yup.boolean(),
    bookWorkspace: Yup.boolean(),
  })
  .test('checkboxTest', 'Select at least one option', (value) => {
    return value.rentOwnWorkspace || value.bookWorkspace;
  });

type ResponseProps = {
  status: string;
  message: string;
};

const RegisterForm: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { cities } = useContext(CatalogContext);

  const handleSubmit = async (values: typeof initialValues, actions: FormikHelpers<any>) => {
    const response = await apiRequest<ResponseProps>('POST', 'registers/create', {
      name: values.name,
      lastName: values.lastname,
      email: values.email,
      password: values.password,
      phone: values.phoneNumber,
      city: values.city,
      owner: values.rentOwnWorkspace,
      coworker: values.bookWorkspace,
    });

    if (response.success) {
      enqueueSnackbar('API request succeeded!', { variant: 'success' });
      actions.resetForm();
    } else {
      enqueueSnackbar(`API request failed: ${response.message}`, { variant: 'error' });
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ errors, touched }) => (
        <Form>
          <Field as={TextField} name="name" label="Name" fullWidth error={errors.name && touched.name} helperText={<ErrorMessage name="name" />} />
          <Field
            as={TextField}
            name="lastname"
            label="Lastname"
            fullWidth
            error={errors.lastname && touched.lastname}
            helperText={<ErrorMessage name="lastname" />}
          />
          <Field
            as={TextField}
            name="email"
            label="Email"
            fullWidth
            error={errors.email && touched.email}
            helperText={<ErrorMessage name="email" />}
          />
          <Field
            as={TextField}
            name="password"
            label="Password"
            type="password"
            fullWidth
            error={errors.password && touched.password}
            helperText={<ErrorMessage name="password" />}
          />
          <Field
            as={TextField}
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            fullWidth
            error={errors.confirmPassword && touched.confirmPassword}
            helperText={<ErrorMessage name="confirmPassword" />}
          />
          <Field
            as={TextField}
            name="phoneNumber"
            label="Phone Number"
            fullWidth
            error={errors.phoneNumber && touched.phoneNumber}
            helperText={<ErrorMessage name="phoneNumber" />}
          />
          <FormControl fullWidth>
            <InputLabel htmlFor="city">City</InputLabel>
            <Field
              as={Select}
              name="city"
              label="City"
              fullWidth
              error={errors.city && touched.city}
              inputProps={{
                id: 'city',
              }}
            >
              {Array.isArray(cities?.data) &&
                cities?.data.map((city: any) => (
                  <MenuItem key={city.CityID} value={city.CityID}>
                    {city.CityName}
                  </MenuItem>
                ))}
            </Field>
          </FormControl>
          <ErrorMessage name="city" />
          <FormControl component="fieldset">
            <FormGroup>
              <FormControlLabel control={<Field as={Checkbox} name="rentOwnWorkspace" />} label="I want to rent my own work space" />
              <FormControlLabel control={<Field as={Checkbox} name="bookWorkspace" />} label="I want to book a workspace" />
            </FormGroup>
          </FormControl>
          <ErrorMessage name="checkboxTest" />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 2,
            }}
          >
            <Button type="submit">Create new user</Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
