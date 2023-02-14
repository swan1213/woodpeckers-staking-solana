/* eslint-disable @next/next/no-img-element */
import { WalletContextState } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { claimRansack } from "../contexts/transaction";
import { EPOCH } from "../contexts/type";
import { getNetworkTime } from "../contexts/utils";
import { NFTType } from "../pages/staking";
import MissionRewardModal from "./MissionRewardModal";
import RansackEndTimeCountdown from "./RansackEndTimeCountdown";

export default function MissionItem(props: {
  wallet: WalletContextState;
  nest: NFTType | undefined;
  wpNfts: NFTType[];
  updatePage: Function;
  lockTime: number;
  stakedTime: number;
  isEnd: boolean;
  style: number;
  rewardAmount: number;
  rewardStyle: number;
}) {
  const {
    wallet,
    nest,
    wpNfts,
    lockTime,
    stakedTime,
    isEnd,
    updatePage,
    style,
    rewardAmount,
    rewardStyle,
  } = props;
  const [now, setNow] = useState(Math.floor(new Date().getTime() / 1000));
  const [styleText, setStyleText] = useState("Birdcamp");
  const [rewardPerDay, setRewardPerDay] = useState(7);
  const [styleSubText, setStyleSubText] = useState("Intermediate");
  const [stakedDays, setStakedDays] = useState(0);

  const [opened, setOpened] = useState(false);
  const handleModalClose = () => {
    setOpened(false);
  };

  const getNowTime = async () => {
    const now = (await getNetworkTime()) as number;
    console.log(now);
    setNow(now);
  };

  const [loading, setLoading] = useState(false);

  const handleClaimRansack = async () => {
    if (nest) {
      try {
        await claimRansack(wallet, new PublicKey(nest.mint), setLoading, () =>
          setOpened(true)
        );
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    getNowTime();
    switch (style) {
      case 0:
        setStyleText("Birdcamp");
        setStyleSubText("Intermediate");
        break;
      case 1:
        setStyleText("Downtown");
        setStyleSubText("Normal");
        break;
      case 2:
        setStyleText("Hunted Pier");
        setStyleSubText("Hard");
        break;
      case 3:
        setStyleText("Sewer");
        setStyleSubText("Impossible");
        break;
    }
    const lockDays = (lockTime - stakedTime) / EPOCH;
    setStakedDays(lockDays);
    switch (lockDays) {
      case 10:
        setRewardPerDay(7);
        break;
      case 20:
        setRewardPerDay(10);
        break;
      case 35:
        setRewardPerDay(15);
        break;
    }
  }, [props.nest, style, stakedTime, lockTime]);

  return (
    <div className={`one-mission ${now > lockTime ? "ended" : ""}`}>
      {nest && (
        <>
          <div className="content">
            <div className="simple-nft-card">
              <div className="id">#{nest.id}</div>
              <div className="label">multiplier</div>
              <img src={nest.image} alt="" />
            </div>
            <div className="detail">
              <div className="label">staked</div>
              <h4>{styleSubText}</h4>
              <h3>{styleText}</h3>
              <div className="title-box">
                <div className="title-item">
                  <h5>Woodpeckers</h5>
                  <span>{wpNfts.length}</span>
                </div>
                <div className="title-item">
                  <h5>Staked</h5>
                  <span>{stakedDays} Days</span>
                </div>
                <div className="title-item">
                  <h5>$Blaze x day</h5>
                  <span>{rewardPerDay} $BLAZE</span>
                </div>
              </div>
            </div>
          </div>
          {!(now > lockTime) && (
            <RansackEndTimeCountdown
              endAction={updatePage}
              duration={(nest.stakedTime - nest.lockTime) / EPOCH}
              endTime={new Date(nest.lockTime * 1000)}
            />
          )}
          {now > lockTime && (
            <div className="ransack-time-ended">
              <p>Time Ended</p>
              <button className="" onClick={() => handleClaimRansack()}>
                {loading ? (
                  <ClipLoader size={12} color="#fff" />
                ) : (
                  <>claim rewards</>
                )}
              </button>
            </div>
          )}
        </>
      )}
      <MissionRewardModal
        wallet={wallet}
        opened={opened}
        // opened={true}
        onClose={() => handleModalClose()}
        nest={nest}
        updatePage={updatePage}
        // style={style}
        // rewardAmount={rewardAmount}
        // rewardStyle={rewardStyle}
      />
    </div>
  );
}
