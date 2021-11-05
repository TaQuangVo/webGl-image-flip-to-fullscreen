import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
          <div className={styles.itemContainer}>
              <div className={styles.item + " " + "item"} id="thor"></div>
              <div className={styles.item + " " + "item"} id="joker"></div>
          </div>
          <div className={styles.closeButton + " " + "closeBtn"} >
            <span>Close</span>
          </div>
      </main>
    </div>
  )
}
