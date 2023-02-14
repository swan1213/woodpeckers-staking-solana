/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { NFTType } from "../pages/staking";
import Skeleton from "@mui/material/Skeleton";
import { WalletContextState } from "@solana/wallet-adapter-react";
import NestPlanItem from "./NestPlanItem";
import NestStakedCard from "./NestStakedCard";
import { getNestPoolState } from "../contexts/transaction";

export interface NestedType {
  claimable: number;
  emission: number;
  lockTime: number;
  stakedTime: number;
  nest: NFTType;
  woodpecker: NFTType[];
}

export default function NestStakedCollectionBox(props: {
  wallet: WalletContextState;
  loading: boolean;
  title: string;
  wpNftList: NFTType[] | undefined;
  nestNftList: NFTType[] | undefined;
  setNfts: Function;
  isOverlay: boolean;
  setIsOverlay: Function;
  updatePage: Function;
}) {
  const {
    loading,
    wpNftList,
    nestNftList,
    title,
    setNfts,
    isOverlay,
    setIsOverlay,
    updatePage,
    wallet,
  } = props;

  const [forceRender, setForceRender] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [nestedNfts, setNestedNfts] = useState<NestedType[]>();

  const [boxLoading, setBoxLoading] = useState(false);

  const update = () => {
    updatePage();
    closeOverlay();
  };

  const closeOverlay = () => {
    setIsReady(false);
    setIsOverlay(false);
  };

  const getNestedNfts = async () => {
    if (wallet.publicKey === null) return;
    if (wpNftList === undefined) return;
    if (nestNftList === undefined) return;
    setBoxLoading(true);
    const nestedData = await getNestPoolState(wallet.publicKey);
    let list: NestedType[] = [];

    if (nestedData) {
      for (let i = 0; i < nestedData.stakedCount.toNumber(); i++) {
        let wps: NFTType[] = [];
        const nest = nestNftList.find(
          (nft) => nft.mint === nestedData.staking[i].nest.toBase58()
        );
        if (nest) {
          for (let j = 0; j < 8; j++) {
            const wp = wpNftList.find(
              (nft) =>
                nft.mint === nestedData.staking[i].woodpecker[j].toBase58()
            );
            if (wp) {
              wps.push(wp);
            }
          }
          list.push({
            claimable: nestedData.staking[i].claimable.toNumber(),
            emission: nestedData.staking[i].emission.toNumber(),
            lockTime: nestedData.staking[i].lockTime.toNumber(),
            stakedTime: nestedData.staking[i].stakedTime.toNumber(),
            nest: nest,
            woodpecker: wps,
          });
        }
      }
    }
    setNestedNfts(list);
    setForceRender(!forceRender);
    setBoxLoading(false);
  };

  useEffect(() => {
    getNestedNfts();
    if (wallet.publicKey === null) {
      setNestedNfts([]);
    }
  }, [
    wallet.publicKey,
    wallet.connected,
    JSON.stringify(wpNftList),
    JSON.stringify(nestNftList),
  ]);

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
        {loading && boxLoading ? (
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
          <div className="nest-staked-gallery">
            {nestedNfts &&
              nestedNfts.length !== 0 &&
              nestedNfts.map((item, key) => (
                <NestStakedCard
                  key={key}
                  wallet={wallet}
                  nest={item.nest}
                  wpNfts={item.woodpecker}
                  stakedTime={item.stakedTime}
                  lockTime={item.lockTime}
                  emission={item.emission}
                  claimable={item.claimable}
                  updatePage={update}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
