/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "../components/Header";
import MainBox from "../components/MainBox";

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <Header />

      <main className="pt-220 staking-page">
        <div className="container">
          <MainBox title="Blazin Woodpeckers">
            <div className="link-buttons">
              <div
                className="img-button"
                onClick={() => router.push("/staking")}
              >
                <div className="img-button-content">
                  <div className="img-box">
                    <img src="/img/genesis.svg" alt="" />
                    <img
                      src="/img/genesis-hover.svg"
                      className="hover"
                      alt=""
                    />
                  </div>
                </div>
                <p>
                  Genesis
                  <br /> Collection
                </p>
              </div>
              <div
                className="img-button"
                onClick={() => router.push("/staking")}
              >
                <div className="img-button-content">
                  <div className="img-box">
                    <img src="/img/nest.svg" alt="" />
                    <img src="/img/nest-hover.svg" className="hover" alt="" />
                  </div>
                </div>
                <p>
                  Nest
                  <br /> Collection
                </p>
              </div>
            </div>
          </MainBox>

          <MainBox title="Partners" style={{ marginTop: 36, marginBottom: 80 }}>
            <div className="">
              <Link href="/">
                <a className="p-link">
                  <img src="/img/partner-1.png" alt="" />
                </a>
              </Link>
            </div>
          </MainBox>
        </div>
      </main>
    </>
  );
};

export default Home;
