import type { NextPage } from 'next'

import Header from '../components/Header/Header'
import SEO from '../components/SEO'
import Home from '../components/Home/Home';

const HomePage: NextPage = () => {

  return (
    <>
      <SEO title="p.$_ | Home" description="Home Page" />
      <Header />
      <Home />
    </>
  );
}

export default HomePage;
