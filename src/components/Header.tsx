import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CloseIcon, DiscordIcon, MenuIcon, TwitterIcon } from "./svgIcons";

export default function Header() {
  const wallet = useWallet();
  const router = useRouter();
  const [routerName, setRouterName] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Link href="/">
            <a>
              {/* eslint-disable-next-line */}
              <img src="/img/logo.svg" alt="" />
            </a>
          </Link>
        </div>
        <div className="header-right">
          <WalletModalProvider>
            <WalletMultiButton />
          </WalletModalProvider>
          <div className="mobile-menu">
            <button onClick={() => setOpen(!open)}>
              {open ? <CloseIcon color="#fff" /> : <MenuIcon color="#fff" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
