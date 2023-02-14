/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { WalletContextState } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import { getRansackPoolState } from "../contexts/transaction";
import { NFTType } from "../pages/staking";
import MissionItem from "./MissionItem";

export interface MissionedType {
  claimable: number;
  emission: number;
  lockTime: number;
  stakedTime: number;
  nest: NFTType;
  woodpecker: NFTType[];
  style: number;
  rewardAmount: number;
  rewardStyle: number;
}

export default function RansackStakedBox(props: {
  wallet: WalletContextState;
  isOverlay: boolean;
  setIsOverlay: Function;
  wpNfts: NFTType[] | undefined;
  nestNfts: NFTType[] | undefined;
  updatePage: Function;
}) {
  const { wallet, isOverlay, updatePage, setIsOverlay, nestNfts, wpNfts } =
    props;

  const [forceRender, setForceRender] = useState(false);
  const [missionNfts, setMissionNfts] = useState<MissionedType[]>();
  const getMissionItems = async () => {
    if (wallet.publicKey === null) return;
    if (nestNfts === undefined) return;
    if (wpNfts === undefined) return;
    const missions = await getRansackPoolState(wallet.publicKey);
    console.log(missions, "!!!!=>!!!");
    let list: MissionedType[] = [];

    if (missions) {
      for (let i = 0; i < missions.stakedCount.toNumber(); i++) {
        let wps: NFTType[] = [];
        const nest = nestNfts.filter(
          (nft) => nft.mint === missions.staking[i].nest.toBase58()
        )[0];
        for (let j = 0; j < 8; j++) {
          const wp = wpNfts.filter(
            (nft) => nft.mint === missions.staking[i].woodpecker[j].toBase58()
          )[0];
          if (wp) {
            wps.push(wp);
          }
        }
        list.push({
          claimable: missions.staking[i].claimable.toNumber(),
          emission: missions.staking[i].emission.toNumber(),
          lockTime: missions.staking[i].lockTime.toNumber(),
          stakedTime: missions.staking[i].stakedTime.toNumber(),
          nest: nest,
          style: missions.staking[i].style.toNumber(),
          rewardAmount: missions.staking[i].rewardAmount.toNumber(),
          rewardStyle: missions.staking[i].rewardStyle.toNumber(),
          woodpecker: wps,
        });
      }
    }
    setMissionNfts(list);
    console.log(list);
    setForceRender(!forceRender);
  };
  useEffect(() => {
    getMissionItems();
  }, [
    wallet.publicKey,
    wallet.connected,
    JSON.stringify(nestNfts),
    JSON.stringify(wpNfts),
  ]);
  return (
    <div className="main-box collection-box ransack">
      <div className="main-box-content">
        <h3 className="box-title">
          Mission Ongoing{" "}
          <span>This will only be available only while nesting.</span>
        </h3>
        <div className="missions-box">
          {missionNfts &&
            missionNfts.map((item, key) => (
              <MissionItem
                key={key}
                updatePage={updatePage}
                wallet={wallet}
                lockTime={item.lockTime}
                nest={item.nest}
                style={item.style}
                rewardAmount={item.rewardAmount}
                rewardStyle={item.rewardStyle}
                isEnd={key === 4}
                wpNfts={item.woodpecker}
                stakedTime={item.stakedTime}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
