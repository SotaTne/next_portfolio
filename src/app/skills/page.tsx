"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto flex h-screen w-4/5 flex-col content-center items-center justify-center pt-[86px] md:flex-row md:justify-around">
          <h1>使える技術</h1>
        </section>
      </main>
      <Footer />
    </>
  );
}
