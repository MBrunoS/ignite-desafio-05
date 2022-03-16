import React from 'react';
import Link from 'next/link';

import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header() {
  return (
    <Link href="/">
      <header className={`${styles.container} ${commonStyles.container}`}>
        <a href="">
          <img src="/logo.svg" alt="logo" />
        </a>
      </header>
    </Link>
  );
}
