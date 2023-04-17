import { createContext } from 'react';

interface City {
  CityID: string;
  CityName: string;
}

interface Role {
  RoleID: string;
  RoleName: string;
}

interface Catalogs {
  cities: City[];
  roles: Role[];
}

export const CatalogContext = createContext<Catalogs>({
  cities: [],
  roles: [],
});
