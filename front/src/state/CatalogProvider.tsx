import React, { useState, useEffect, PropsWithChildren, FC } from 'react';
import { CatalogContext } from './CatalogContext';
import apiRequest from '@/api/Api';

type CityProps = {
  CityID: string;
  CityName: string;
};

type RoleProps = {
  RoleID: string;
  RoleName: string;
};

export const CatalogProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [cities, setCities] = useState<CityProps[]>([]);
  const [roles, setRoles] = useState<RoleProps[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await apiRequest<Array<CityProps>>('GET', 'catalogs/cities');
        if (response.data !== undefined) {
          setCities(response.data);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await apiRequest<Array<RoleProps>>('GET', 'catalogs/roles');
        if (response.data !== undefined) {
          setRoles(response.data);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchCities();
    fetchRoles();
  }, []);

  return <CatalogContext.Provider value={{ cities, roles }}>{children}</CatalogContext.Provider>;
};
