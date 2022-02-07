import type { NextPage } from 'next'
import { Flex, Box, chakra } from '@chakra-ui/react';
import { FaWallet } from 'react-icons/fa';

import Header from './components/Header/Header'
import SEO from './components/SEO'
import Section from './components/Home/Section';
import Home from './components/Home/Home';

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
