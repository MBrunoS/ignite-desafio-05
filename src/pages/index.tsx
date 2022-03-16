import { GetStaticProps } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';
import Link from 'next/link';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useState } from 'react';
import PostDetails from '../components/PostDetails';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [nextPageLink, setnextPageLink] = useState(postsPagination.next_page);
  const [postsList, setPostsList] = useState(postsPagination.results);

  async function loadMorePosts() {
    const response: PostPagination = await fetch(nextPageLink).then(res =>
      res.json()
    );

    setnextPageLink(response.next_page);
    setPostsList([...postsList, ...response.results]);
  }

  return (
    <>
      <Head>
        <title>spacetraveling | Início</title>
      </Head>

      <Header />

      <main className={commonStyles.container}>
        {postsList.map(post => (
          <div className={styles.postItem} key={post.uid}>
            <Link href={`/post/${post.uid}`}>
              <a>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>

                <PostDetails
                  date={post.first_publication_date}
                  author={post.data.author}
                />
              </a>
            </Link>
          </div>
        ))}

        {nextPageLink && (
          <button className={styles.loadButton} onClick={loadMorePosts}>
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 2,
    }
  );

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    }),
  };

  return {
    props: {
      postsPagination,
    },
  };
};
