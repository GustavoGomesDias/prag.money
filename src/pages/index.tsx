import React from 'react';
import type { NextPage } from 'next';

import Header from '../components/Header/Header';
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
