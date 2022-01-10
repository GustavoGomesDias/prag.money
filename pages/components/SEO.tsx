import React from 'react';
import Head from 'next/head';

export interface SEOProps {
  title: string
  description?: string
}

const SEO = ({ title, description }: SEOProps): JSX.Element => {
  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
    </Head>
  );
}

export default SEO;
