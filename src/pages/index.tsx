import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';

import { parseCookies } from 'nookies';
import Header from '../components/UI/Header/Header';
import SEO from '../components/SEO';
import Home from '../components/Home/Home';

const HomePage: NextPage = () => (
  <>
    <SEO title="p.$_ | Home" description="Home Page" />
    <Header logo="Money" />
    <Home />
  </>
);

export default HomePage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { authToken } = parseCookies(ctx);
  if (authToken) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
