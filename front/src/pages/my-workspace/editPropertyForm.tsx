import React, { FC, useContext, useEffect, useState, useRef } from 'react';
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
  images: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string().required('ID is required'),
        url: Yup.string().url('Invalid URL').required('URL is required'),
      })
    )
    .min(1, 'At least one image object is required'),
});

type ResponseProps = {
  status: string;
  message: string;
};

type EditPropertyFormProps = {
  workspaceID: string;
  close: () => void;
};

const EditPropertyForm: FC<EditPropertyFormProps> = ({ workspaceID, close }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { cities } = useContext(CatalogContext);
  const [properties, setProperties] = useState({
    propertyName: '',
    address: '',
    city: '',
    postalCode: '',
    price: 0,
    images: [],
  });

  const formikRef = useRef(null);

  const handleSubmit = async (values: any, actions: FormikHelpers<any>) => {
    const response = await apiRequest<ResponseProps>('PUT', `workspaces/update/${workspaceID}`, {
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
      close();
    } else {
      enqueueSnackbar(`API request failed: ${response.message}`, { variant: 'error' });
    }
  };

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await apiRequest('GET', `workspaces/byid/${workspaceID}`);
      if (response.success) {
        const propertyData = {
          propertyName: response.data.data.PropertyName,
          address: response.data.data.PropertyAddress,
          city: response.data.data.CityID,
          postalCode: response.data.data.PostalCode,
          price: response.data.data.Price,
          images: response.data.data.images.map((image) => ({
            id: image.ImageID,
            url: image.image_URL,
          })),
        };

        setProperties(propertyData);

        // Update Formik values using setValues function
        if (formikRef.current) {
          formikRef.current.setValues(propertyData);
        }
      } else {
        console.error('Failed to fetch properties:', response.message);
      }
    };

    fetchProperties();
  }, [workspaceID]);

  return (
    <Formik innerRef={formikRef} initialValues={properties} validationSchema={validationSchema} onSubmit={handleSubmit}>
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
              value={values.propertyName} // Cambiar aquí
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
              value={values.address} // Cambiar aquí
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="city">City</InputLabel>
            <Field
              as={Select}
              error={errors.city && touched.city}
              label="City"
              name="city"
              value={values.city} // Cambiar aquí
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
              value={values.postalCode} // Cambiar aquí
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
              value={values.price} // Cambiar aquí
            />
          </FormControl>
          {values.images.map((img, index) => (
            <FormControl fullWidth margin="normal" key={img.id}>
              <Field
                as={TextField}
                error={errors.images && touched.images}
                helperText={index === 0 ? <ErrorMessage name={`images[${index}].url`} /> : null}
                name={`images[${index}].url`}
                label={`Image URL ${index + 1}`}
                variant="outlined"
                value={img.url || ''}
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
              Update Workspace
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default EditPropertyForm;
