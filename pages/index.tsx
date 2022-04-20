import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import Banner from '../components/Banner'
import { sanityClient, urlFor } from '../sanity'
import {Post} from '../types'
import Posts from '../components/Posts'
import Link from 'next/link'

interface Props {
  posts: [Post]
}

const Home: NextPage<Props, {} > = ({ posts }: Props) => {
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Medium</title>
      </Head>
      <Header />
      <Banner />
      <Posts posts={posts} />
    </div>
  )
}

export default Home

export const getServerSideProps = async () => {
  const query = `*[_type == 'post']{
    _id,
    slug,
    title,
    author-> {
       name,
       image
  }
    ,
    description,
    mainImage,
  }`

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
}
