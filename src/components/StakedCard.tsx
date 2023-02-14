/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { CheckIcon } from "./svgIcons";
import EndTimeCountdown from "./EndTimeCountdown";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { claimReward, withdrawNft } from "../contexts/transaction";
import { PublicKey } from "@solana/web3.js";
import { ClipLoader } from "react-spinners";
import { getNetworkTime } from "../contexts/utils";
import { NFTType } from "../pages/staking";

export default function StakedCard(props: {
  wallet: WalletContextState;
  id: string;
  handleSelect: Function;
  nft: NFTType;
  lockTime: number;
  lockLength: number;
  mint: string;
  updatePage: Function;
  nested: boolean;
  uri?: string;
  name?: string;
  image?: string;
  selected?: boolean;
  isNest?: boolean;
}) {
  const {
    wallet,
    id,
    nft,
    name,
    image,
    selected,
    lockTime,
    nested,
    handleSelect,
    mint,
    lockLength,
    updatePage,
  } = props;

  const [loading, setLoading] = useState(false);
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const [now, setNow] = useState(new Date().getTime());
  const handleCollect = async () => {
    try {
      await claimReward(wallet, setLoading, updatePage, new PublicKey(mint));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnstake = async () => {
    try {
      await withdrawNft(
        wallet,
        [{ mint: new PublicKey(mint) }],
        setUnstakeLoading,
        () => updatePage()
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getNowTime = async () => {
    const now = (await getNetworkTime()) as number;
    setNow(now);
  };

  useEffect(() => {
    getNowTime();
  }, []);

  return (
    <div
      className={`staked-card ${lockTime < now ? "ended-card" : ""} ${
        nested ? "nested-card" : ""
      }`}
      style={{
        pointerEvents:
          lockLength === 0 && !nft.nested
            ? "all"
            : lockTime < now
            ? "all"
            : "none",
      }}
    >
      <div
        className="staked-overlay"
        style={{ display: loading ? "flex !important" : "none" }}
      >
        <div className="mark">ended</div>
        <img src="/img/genesis-hover.svg" alt="" />
        <button
          className="overlay-collect"
          disabled={loading}
          onClick={() => handleCollect()}
        >
          {loading ? (
            <ClipLoader size={10} color="#fff" />
          ) : (
            <>Collect Rewards</>
          )}
        </button>{" "}
        <button
          className="overlay-collect"
          disabled={unstakeLoading}
          onClick={() => handleUnstake()}
          style={{ marginTop: 10 }}
        >
          {unstakeLoading ? (
            <ClipLoader size={10} color="#fff" />
          ) : (
            <>Unstake</>
          )}
        </button>
      </div>
      <div className="nft-card" onClick={() => handleSelect(mint)}>
        <div className="nft-id">#{id}</div>
        <div className="staked-label">
          {!nft.nested
            ? lockLength === 0
              ? "Unlocked"
              : "Locked"
            : "Multiplier"}
        </div>
        <div className="nft-image">
          {image === "" ? (
            <div className="empty-image"></div>
          ) : (
            <img src={image} alt="" />
          )}
        </div>
        <div className="staked-content">
          <div className="content-head">
            <h3>0.5 $BLAZE</h3>
            <span className="reward-mark">Daily</span>
          </div>
          <div className="box">
            {nft.nested ? (
              <>{lockTime < now ? <h4>Time Ended</h4> : <h4>Time Left</h4>}</>
            ) : (
              <>
                {lockLength === 0 ? (
                  <h4>No Timer</h4>
                ) : (
                  <>
                    {lockTime < now ? <h4>Time Ended</h4> : <h4>Time Left</h4>}
                  </>
                )}
              </>
            )}
            <EndTimeCountdown
              endTime={lockTime * 1000}
              duration={lockLength}
              nested={nft.nested}
              endAction={() => console.log("ended!")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
