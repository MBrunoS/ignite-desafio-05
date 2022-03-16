import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import PrismicDOM from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';
import Head from 'next/head';
import Header from '../../components/Header';
import PostDetails from '../../components/PostDetails';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useRouter } from 'next/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const wordCount = post.data.content.reduce((acc, section) => {
    const headingWords = section.heading.split(' ').length;
    const bodyWords = PrismicDOM.RichText.asText(section.body).split(
      ' '
    ).length;

    return acc + headingWords + bodyWords;
  }, 0);

  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Head>
        <title>spacetraveling | {post.data.title}</title>
      </Head>

      <Header />
      <div className={styles.hero}>
        <img src={post.data.banner.url} />
      </div>
      <main className={commonStyles.container}>
        <article className={styles.post}>
          <h1>{post.data.title}</h1>

          <PostDetails
            date={post.first_publication_date}
            author={post.data.author}
            wordCount={wordCount}
          />

          {post.data.content.map((section, index) => (
            <div className={styles.postSection} key={index}>
              <h2>{section.heading}</h2>
              <p
                dangerouslySetInnerHTML={{
                  __html: PrismicDOM.RichText.asHtml(section.body),
                }}
              />
            </div>
          ))}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts'),
  ]);

  return {
    paths: posts.results.map(post => {
      return { params: { slug: post.uid } };
    }),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  return {
    props: {
      post: {
        uid: response.uid,
        first_publication_date: response.first_publication_date,
        data: response.data,
      },
    },
  };
};
