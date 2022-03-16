import React from 'react';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import styles from './postDetails.module.scss';

type Props = {
  date: string;
  author: string;
  wordCount?: number;
};

export default function PostDetails({ date, author, wordCount }: Props) {
  return (
    <div className={styles.container}>
      <span>
        <FiCalendar />
        {format(new Date(date), 'dd MMM yyyy', {
          locale: ptBR,
        })}
      </span>
      <span>
        <FiUser />
        {author}
      </span>
      {wordCount && (
        <span>
          <FiClock />
          {Math.ceil(wordCount / 200)} min
        </span>
      )}
    </div>
  );
}
