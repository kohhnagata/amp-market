import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ConnectWallet } from "components/Button/ConnectWallet";
import { usePrivy } from "@privy-io/react-auth";

const Header: React.FC = () => {
  const { ready } = usePrivy();

  return (
    <header className="py-4">
      <div className="flex justify-between items-center">
        <Link href="/">
          <Image
            src="/svg/titleLogo.svg"
            alt="Your App Name"
            width={350}
            height={50}
          />
        </Link>
        <nav className="flex items-center space-x-8">
          <Link
            href="https://kohei-eth.notion.site/NightMarket-Wiki-d6765d4c1c0e4bcc892a45e05da1f5aa"
            target="_blank"
            className="hover:underline"
          >
            Watch AMP
          </Link>
          <Link
            href="https://www.primodium.com/"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Suggest Market
          </Link>
          {ready && <ConnectWallet />}
        </nav>
      </div>
    </header>
  );
};

export default Header;
