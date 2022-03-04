import type { NextPage } from 'next'

import Header from '../components/Header/Header'
import SEO from '../components/SEO'
import Home from '../components/Home/Home';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const HomePage: NextPage = () => {

  const { user } = useContext(AuthContext);

  return (
    <>
      <SEO title="p.$_ | Home" description="Home Page" />
      <Header logo="Money" />
      <Home />
    </>
  );
}

export default HomePage;
