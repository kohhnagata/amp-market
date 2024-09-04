import React, { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { PrivyProvider } from "@privy-io/react-auth";
import Header from "../components/Header";
import CautionBar from "../components/CautionBar";
import { EthPriceProvider } from "../lib/EthPriceContext";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <React.Fragment>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={{
          loginMethods: ["email", "google", "twitter"],
          appearance: {
            theme: "dark",
            accentColor: "#676FFF",
          },
          defaultChain: {
            id: 690,
            name: "Redstone Mainnet",
            rpcUrls: ["https://rpc.redstonechain.com"],
          },
          supportedChains: [
            {
              id: 690,
              name: "Redstone Mainnet",
              rpcUrls: ["https://rpc.redstonechain.com"],
            },
          ],
        }}
      >
        <EthPriceProvider>
          <Head>
            <title>Night Market</title>
            <meta property="og:title" content="Night Market" />
            <meta
              property="og:description"
              content="NightMarket is a prediction market protocol that focuses on fully onchain games."
            />
            <meta property="og:image" content="/ogp.png" />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon-16x16.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon-32x32.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="200x200"
              href="/apple-touch-icon.png"
            />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Night Market" />
            <meta
              name="twitter:description"
              content="NightMarket is a prediction market protocol that focuses on fully onchain games."
            />
            <meta name="twitter:image" content="https://0xnight.com/ogp.png" />
          </Head>
          <div className="bg-default text-default h-auto">
            {!isMobile ? (
              <>
                <CautionBar />
                <div className="mx-16">
                  <Header />
                  <Component {...pageProps} />
                </div>
              </>
            ) : (
              <div className="flex flex-col h-screen">
                <CautionBar />
                <div className="w-full h-full flex items-center justify-center">
                  <span>Unavailable on mobile</span>
                </div>
              </div>
            )}
          </div>
        </EthPriceProvider>
      </PrivyProvider>
    </React.Fragment>
  );
}

export default MyApp;
