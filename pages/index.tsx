import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import queryString from "query-string";
import { Script } from "@prisma/client";
import Link from "next/link";

const Home: NextPage = () => {
  const [scripts, setScripts] = useState<Script[]>([]);
  useEffect(() => {
    fetch("api/scripts", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((body) => setScripts(body));
  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Link href={"/add-script"}>
          <button className={styles.addScriptBtn}>add script</button>
        </Link>
        <div className={styles.titleContainer}>
          {" "}
          {scripts.map((script) => (
            <Link
              key={script.id}
              href={`/view-script?${queryString.stringify({ id: script.id })}`}
            >
              {script.title}
            </Link>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://www.linkedin.com/in/job-a-villamil/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by s<span className={styles.logo}>Your Baby</span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
