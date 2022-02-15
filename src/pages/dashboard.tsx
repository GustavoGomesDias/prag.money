import React, { useContext } from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import Header from '../components/Header/Header';
import SEO from '../components/SEO';
import { AuthContext } from '../context/AuthContext';

const Dashboard = (): JSX.Element => {
  const {} = useContext(AuthContext);

  return (
    <>
      <SEO title="p.$ | Dashboard" description="Dashboard page" />
      <Header logo="Dash" />
    </>
  )
}

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { authToken } = parseCookies(ctx);

  if (!authToken || authToken === undefined || authToken === null) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}
