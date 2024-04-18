import Footer from "@/components/Footer";
import Header from "@/components/Header";
import My_Logo from "@/components/images/My_Logo";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto flex h-screen w-4/5 flex-col content-center items-center justify-center pt-[86px] md:flex-row md:justify-around">
          <ul className="flex flex-col md:flex-row">
            <li>
              <My_Logo size={360} />
            </li>
            <li>
              <ul>
                <li>
                  <h1 className=" text-6xl">Sota Tsunemine</h1>
                </li>
                <li>
                  <p>私は主に</p>
                </li>
              </ul>
            </li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
