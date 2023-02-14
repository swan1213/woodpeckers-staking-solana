import { useState } from "react";
import { NFTType } from "../pages/staking";
import Skeleton from "@mui/material/Skeleton";
import UnstakedCard from "./UnstakedCard";
import { CircleClose } from "./svgIcons";
import { PublicKey } from "@solana/web3.js";
import PlanItem from "./PlanItem";
import { WalletContextState } from "@solana/wallet-adapter-react";

export default function CollectionBox(props: {
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
    setForceRender(!forceRender);
  };

  const handleIsReady = (type: string) => {
    setIsReady(true);
    setIsOverlay(true);
  };

  const update = () => {
    updatePage();
    closeOverlay();
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
        {isOverlay && isReady && (
          <div className="box-overlay">
            <button
              className="box-icon-button corner-button"
              onClick={closeOverlay}
            >
              <CircleClose />
            </button>
            <div className="overlay-content">
              <h3>{title}</h3>
              <p className="p-text-1">Select a Staking Plan</p>
              <div className="plans-box">
                <PlanItem
                  wallet={wallet}
                  title="Unlocked"
                  description={
                    <p>
                      You get: <br /> 2.5 $BLAZE a day
                    </p>
                  }
                  lockTime={0}
                  selectedNfts={selectedNfts}
                  updatePage={update}
                />
                <PlanItem
                  wallet={wallet}
                  title="10 Days"
                  description={
                    <p>
                      Lock in 100 $BLAZE <br /> 7 $BLAZE a day
                    </p>
                  }
                  lockTime={10}
                  selectedNfts={selectedNfts}
                  updatePage={update}
                />
                <PlanItem
                  wallet={wallet}
                  title="20 Days"
                  description={
                    <p>
                      Lock in 200 $BLAZE <br /> 10 $BLAZE a day
                    </p>
                  }
                  lockTime={20}
                  selectedNfts={selectedNfts}
                  updatePage={update}
                />
                <PlanItem
                  wallet={wallet}
                  title="35 Days"
                  description={
                    <p>
                      Lock in 300 $BLAZE <br /> 15 $BLAZE a day
                    </p>
                  }
                  lockTime={35}
                  selectedNfts={selectedNfts}
                  updatePage={update}
                />
              </div>
            </div>
          </div>
        )}
        {!(isOverlay && isReady) && (
          <>
            <h3>{title}</h3>
            <div className="action-buttons">
              <button
                className="btn-action"
                disabled={selectedNfts.length === 5}
                onClick={() => handleIsReady("single")}
              >
                stake
              </button>
              <button
                className="btn-action"
                onClick={() => handleIsReady("all")}
              >
                stake all
              </button>
            </div>
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
              <div className="nft-gallery">
                {nftList &&
                  nftList.length !== 0 &&
                  nftList.map(
                    (item, key) =>
                      !item.staked && (
                        <UnstakedCard
                          id={item.id}
                          mint={item.mint}
                          uri={item.uri}
                          key={key}
                          image={item.image}
                          selected={item.selected}
                          handleSelect={handleSelect}
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
