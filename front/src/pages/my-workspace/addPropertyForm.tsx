import React, { FC, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import apiRequest from '@/api/Api';
import { useSnackbar } from 'notistack';
import { TextField, Button, Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { getSessionData } from '@/utils/AuthManager';
import { CatalogContext } from '@/state/CatalogContext';

const validationSchema = Yup.object().shape({
  propertyName: Yup.string().required('Required'),
  address: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  postalCode: Yup.string().required('Required'),
  price: Yup.number().required('Required'),
  images: Yup.array().of(Yup.string().url('Invalid URL')).min(1, 'At least one image URL is required'),
});

type ResponseProps = {
  status: string;
  message: string;
};

const AddPropertyForm: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { cities } = useContext(CatalogContext);

  const handleSubmit = async (values: any, actions: FormikHelpers<any>) => {
    const response = await apiRequest<ResponseProps>('POST', 'workspaces/create', {
      property: values.propertyName,
      address: values.address,
      city: values.city,
      postCode: values.postalCode,
      price: values.price,
      images: values.images,
      id: getSessionData().id,
    });

    if (response.success) {
      enqueueSnackbar('API request succeeded!', { variant: 'success' });
      actions.resetForm();
    } else {
      enqueueSnackbar(`API request failed: ${response.message}`, { variant: 'error' });
    }
  };

  return (
    <Formik
      initialValues={{
        propertyName: '',
        address: '',
        city: '',
        postalCode: '',
        price: '',
        images: Array(4).fill(''),
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, values, setFieldValue }) => (
        <Form>
          <FormControl fullWidth margin="normal">
            <Field
              as={TextField}
              error={errors.propertyName && touched.propertyName}
              helperText={<ErrorMessage name="propertyName" />}
              name="propertyName"
              label="Property Name"
              variant="outlined"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Field
              as={TextField}
              error={errors.address && touched.address}
              helperText={<ErrorMessage name="address" />}
              name="address"
              label="Address"
              variant="outlined"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="city">City</InputLabel>
            <Field
              as={Select}
              error={errors.city && touched.city}
              label="City"
              name="city"
              inputProps={{
                name: 'city',
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
            <ErrorMessage name="city" />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Field
              as={TextField}
              error={errors.postalCode && touched.postalCode}
              helperText={<ErrorMessage name="postalCode" />}
              name="postalCode"
              label="Postal Code"
              variant="outlined"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Field
              as={TextField}
              error={errors.price && touched.price}
              helperText={<ErrorMessage name="price" />}
              name="price"
              label="Price"
              type="number"
              variant="outlined"
            />
          </FormControl>
          {Array.from({ length: 4 }, (_, i) => i).map((i) => (
            <FormControl fullWidth margin="normal" key={i}>
              <Field
                as={TextField}
                error={errors.images && touched.images && touched.images[i]}
                helperText={i === 0 ? <ErrorMessage name="images" /> : null}
                name={`images[${i}]`}
                label={`Image URL ${i + 1}`}
                variant="outlined"
                value={values.images[i]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue(`images[${i}]`, e.target.value)}
              />
            </FormControl>
          ))}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 2,
            }}
          >
            <Button type="submit" variant="contained" color="primary">
              Add Workspace
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AddPropertyForm;
