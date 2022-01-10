import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from './components/Header/Header'
import SEO from './components/SEO'

const Home: NextPage = () => {
  return (
    <>
      <SEO title="p.$_ | Home" description="Home Page" />
      <Header />
    </>
  );
}

export default Home;
