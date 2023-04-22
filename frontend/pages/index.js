import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Header from "./components/header";
import Search from "./components/search";
import HeroSection from "./components/heroSection";
export default function Home() {
  return (
    <>
      <Head>
        <title>Atherscan</title>
      </Head>
      <section className={styles.main}>
        <Header></Header>
        <Search></Search>
        <HeroSection></HeroSection>
      </section>
    </>
  );
}
