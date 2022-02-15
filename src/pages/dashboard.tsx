import React from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

const Dashboard = (): JSX.Element => {
  return (
    <h1>Dashboard</h1>
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
