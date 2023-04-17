import React from 'react';
import { AppProps } from 'next/app';
import MainLayout from '@/layouts/MainLayout';
import { SnackbarProvider } from 'notistack';
import { CatalogProvider } from '@/state/CatalogProvider';
import { AuthProvider } from '@/state/AuthProvider';
import '@/styles/globals.scss';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <SnackbarProvider maxSnack={3}>
      <AuthProvider>
        <CatalogProvider>
          <MainLayout pageTitle="Gestor de medidores">
            <Component {...pageProps} />
          </MainLayout>
        </CatalogProvider>
      </AuthProvider>
    </SnackbarProvider>
  );
};

export default MyApp;
