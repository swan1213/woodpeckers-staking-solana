import { useState } from "react";
import { NFTType } from "../pages/staking";
import Skeleton from "@mui/material/Skeleton";
import { PublicKey } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import StakedCard from "./StakedCard";

export default function CollectionStakedBox(props: {
  wallet: WalletContextState;
  loading: boolean;
  title: string;
  nftList: NFTType[] | undefined;
  setNfts: Function;
  isOverlay: boolean;
  setIsOverlay: Function;
  updatePage: Function;
}) {
  const {
    loading,
    nftList,
    title,
    setNfts,
    isOverlay,
    setIsOverlay,
    updatePage,
    wallet,
  } = props;
  const [forceRender, setForceRender] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [selectedNfts, setSelectedNfts] = useState<{ mint: PublicKey }[]>([]);

  const handleSelect = (mint: string) => {
    let nfts = nftList;
    let selected: { mint: PublicKey }[] = [];
    if (nfts) {
      for (let i = 0; i < nfts.length; i++) {
        if (nfts[i].mint === mint) {
          nfts[i].selected = !nfts[i].selected;
        }
        if (nfts[i].selected)
          selected.push({ mint: new PublicKey(nfts[i].mint) });
      }
    }
    setNfts(nfts);
    setSelectedNfts(selected);
    console.log(selected);
    setForceRender(!forceRender);
  };

  const handleIsReady = (type: string) => {
    setIsReady(true);
    setIsOverlay(true);
  };

  const closeOverlay = () => {
    setIsReady(false);
    setIsOverlay(false);
  };

  return (
    <div
      className="main-box collection-box"
      style={{ zIndex: isOverlay && isReady ? 10 : 2 }}
    >
      <div
        className="main-box-content"
        style={{
          minHeight: isOverlay && isReady ? 320 : 2,
          background:
            isOverlay && isReady
              ? "#1e1e1e"
              : "linear-gradient(92.79deg, #373737 0%, #2b2b2b 100%)",
        }}
      >
        <h3>{title}</h3>
        <div className="action-buttons">
          {/* <button
            className="btn-action"
            disabled={selectedNfts.length === 0}
            onClick={() => handleIsReady("single")}
          >
            unstake
          </button> */}
          <button
            className="btn-action"
            disabled={selectedNfts.length === 0}
            onClick={() => handleIsReady("all")}
          >
            collect rewards
          </button>
          {/* <button
            className="btn-action"
            disabled={selectedNfts.length === 0}
            onClick={() => handleIsReady("single")}
          >
            unstake
          </button>
          <button className="btn-action" onClick={() => handleIsReady("all")}>
            unstake all
          </button> */}
        </div>
        {!(isOverlay && isReady) && (
          <>
            {loading ? (
              <div className="nft-gallery">
                {[1, 2, 3, 4, 5].map((item, key) => (
                  <Skeleton
                    variant="rectangular"
                    width={128}
                    height={128}
                    key={key}
                    style={{ borderRadius: 15 }}
                  />
                ))}
              </div>
            ) : (
              <div className="nft-gallery staked-gallery">
                {nftList &&
                  nftList.length !== 0 &&
                  nftList.map(
                    (item, key) =>
                      item.staked && (
                        <StakedCard
                          wallet={wallet}
                          id={item.id}
                          nft={item}
                          mint={item.mint}
                          uri={item.uri}
                          lockTime={item.lockTime}
                          lockLength={item.lockLength}
                          key={key}
                          image={item.image}
                          nested={item.nested}
                          selected={item.selected}
                          handleSelect={handleSelect}
                          updatePage={updatePage}
                        />
                      )
                  )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
