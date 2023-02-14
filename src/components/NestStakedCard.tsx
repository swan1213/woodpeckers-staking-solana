/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { claimNestReward, withdrawNestNft } from "../contexts/transaction";
import { NFTType } from "../pages/staking";
import NestEndTimeCountdown from "./NestEndTimeCountdown";
import { ClipLoader } from "react-spinners";
import { getNetworkTime } from "../contexts/utils";
import { infoAlert } from "./toastGroup";
import { EPOCH } from "../contexts/type";

export default function NestStakedCard(props: {
  nest: NFTType;
  wallet: WalletContextState;
  wpNfts: NFTType[];
  stakedTime: number;
  lockTime: number;
  emission: number;
  claimable: number;
  updatePage: Function;
}) {
  const {
    nest,
    wallet,
    wpNfts,
    stakedTime,
    lockTime,
    emission,
    claimable,
    updatePage,
  } = props;

  const [loading, setLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);

  const [now, setNow] = useState(new Date().getTime());
  const [plan, setPlan] = useState(0);
  const update = () => {
    updatePage();
    infoAlert("Updating page data...");
  };

  const unstake = async () => {
    try {
      await withdrawNestNft(
        wallet,
        [{ nestMint: new PublicKey(nest.mint) }],
        setLoading,
        updatePage
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleClaim = async () => {
    try {
      await claimNestReward(
        wallet,
        setClaimLoading,
        updatePage,
        new PublicKey(nest.mint)
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
    if (nest) {
      const duration = (nest.stakedTime - nest.lockTime) / EPOCH;
      setPlan(duration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(wpNfts), nest]);

  return (
    <div className="nest-staked-card">
      {nest && wpNfts && (
        <div className="content">
          <div className="content-top">
            <div className="staked-detail">
              <div className="simple-nft-card">
                <div className="id">#{nest.id}</div>
                <div className="label">multiplier</div>
                <img src={nest.image} alt="" />
              </div>
              <div className="multiplier">
                <img src={"/img/wp-image.png"} alt="" />
                <div className="multiplier-overlay">
                  <h2>X{wpNfts.length}</h2>
                  <p>Staked</p>
                </div>
              </div>
              <div className="detail-content">
                <div className="label">staked</div>
                <h2>Nested</h2>
                <div className="texts">
                  <div className="text-item">
                    <h5>Nest</h5>
                    <h6>Tier {nest.tier}</h6>
                  </div>
                  <div className="text-item">
                    <h5>Woodpeckers</h5>
                    <h6>{wpNfts.length}</h6>
                  </div>
                  <div className="text-item">
                    <h5>$BLAZE x day</h5>
                    <h6>5 $BLAZE</h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="detail-right">
              <div className="l">
                <div className="label">multiplier</div>
                <h2>X{emission}</h2>
              </div>
              <div className="r">
                <h5>Rewards</h5>
                <p>{100 * emission} $BLAZE</p>
              </div>
            </div>
          </div>
          <div className="staked-action">
            <div className="staking-progressbar">
              {plan === 0 ? (
                <h4>No Timer</h4>
              ) : (
                <>{lockTime < now ? <h4>Time Ended</h4> : <h4>Time Left</h4>}</>
              )}
              <NestEndTimeCountdown
                endAction={() => update()}
                endTime={new Date(lockTime * 1000)}
                duration={35}
              />
            </div>
            <div className="action">
              <button
                className="btn-action"
                onClick={() => unstake()}
                disabled={lockTime > now}
              >
                {loading ? <ClipLoader size={10} color="#fff" /> : <>unstake</>}
              </button>
              <button className="btn-action" onClick={() => handleClaim()}>
                {claimLoading ? (
                  <ClipLoader size={10} color="#fff" />
                ) : (
                  <>claim</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
