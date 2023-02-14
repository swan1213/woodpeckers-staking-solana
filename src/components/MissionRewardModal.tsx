/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { Dialog, Skeleton } from "@mui/material";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import {
  getRansackData,
  getRansackedDetail,
  withdrawRansackft,
} from "../contexts/transaction";
import { BLAZE_TOKEN_DECIMAL, WOOD_TOKEN_DECIMAL } from "../contexts/type";
import { NFTType } from "../pages/staking";
import { BoxBackIcon, CircleClose } from "./svgIcons";

export default function MissionRewardModal(props: {
  wallet: WalletContextState;
  opened: boolean;
  onClose: Function;
  nest: NFTType | undefined;
  updatePage: Function;
  //   style: number;
  //   rewardAmount: number;
  //   rewardStyle: number;
}) {
  const { wallet, opened, onClose, nest, updatePage } = props;
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  // 1: $BLAZE, 2: WOOD_TOKEN, 3:
  const [rewardStyle, setRewardStyle] = useState(1);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [rewardText, setRewardText] = useState("Bronze chest");
  const [loading, setLoading] = useState(true);

  const getMissionData = async () => {
    if (nest === undefined) return;
    if (wallet.publicKey === null) return;
    setLoading(true);
    const mission = await getRansackedDetail(
      wallet.publicKey,
      new PublicKey(nest.mint)
    );
    console.log(mission);
    if (mission) {
      if (mission.style.toNumber() === 1) {
        const amount = mission.rewardAmount.toNumber() / BLAZE_TOKEN_DECIMAL;
        if (amount < 100) {
          if (amount !== 50) {
            setRewardText("Bronze chest");
          } else {
            setRewardText("Small Pouch");
          }
        } else if (amount === 150) {
          setRewardText("Mid size Pounch");
        } else if (amount === 500) {
          setRewardText("Large Pouch");
        }
      } else if (mission.style.toNumber() === 2) {
        const amount = mission.rewardAmount.toNumber() / WOOD_TOKEN_DECIMAL;
        if (amount < 100) {
          if (amount !== 50) {
            setRewardText("Bronze chest");
          } else {
            setRewardText("Small wood Bundle");
          }
        } else if (amount === 100) {
          setRewardText("Medium wood Bundle");
        } else if (amount === 200) {
          setRewardText("Large wood Bundle");
        }
      }
    }
    setLoading(false);
  };

  const handleClose = () => {
    setIsEnd(false);
    onClose();
    updatePage();
  };

  const handleDiscover = async () => {
    if (nest === undefined) return;
    try {
      await withdrawRansackft(
        wallet,
        [{ nestMint: new PublicKey(nest.mint) }],
        setDiscoverLoading,
        () => handleClose()
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMissionData();
  }, [opened, nest]);

  return (
    <Dialog open={opened} maxWidth="lg">
      <div className="mission-claim-modal">
        <div
          className="main-box collection-box ransack"
          style={{ marginTop: 0 }}
        >
          <div className="main-box-content">
            <h3 className="box-title">
              Claim Rewards
              <span>This will only be available only while nesting.</span>
            </h3>
            <button
              className="back-btn box-icon-button"
              onClick={() => onClose()}
            >
              <CircleClose />
            </button>
            {!isEnd && (
              <div className="modal-content">
                <div className="question-mark">?</div>
                <button
                  className="discorver-rewards"
                  onClick={() => setIsEnd(true)}
                >
                  <>Discover Reward</>
                </button>
              </div>
            )}
            {isEnd && (
              <div className="end-content">
                {rewardStyle === 1 && (
                  <div className="pounch-rewrad">
                    {!loading ? (
                      <>
                        <div className="icon">
                          <img src="/img/genesis-hover.svg" alt="" />
                        </div>
                        <p>
                          You win a <span>“{rewardText}”</span>
                        </p>
                        <button className="" onClick={() => handleDiscover()}>
                          {discoverLoading ? (
                            <ClipLoader size={12} color="#fff" />
                          ) : (
                            <>claim rewards</>
                          )}
                        </button>
                      </>
                    ) : (
                      <>
                        <Skeleton
                          variant="rectangular"
                          width={140}
                          height={140}
                          style={{
                            borderRadius: "50%",
                            backgroundColor: "#ffffff08",
                          }}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={200}
                          height={20}
                          style={{
                            backgroundColor: "#ffffff08",
                            marginTop: 14,
                            marginBottom: 28,
                          }}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={150}
                          height={40}
                          style={{
                            backgroundColor: "#ffffff08",
                            borderRadius: 30,
                          }}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
