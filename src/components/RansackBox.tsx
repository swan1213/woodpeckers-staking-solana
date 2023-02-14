/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { WalletContextState } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { NFTType } from "../pages/staking";
import NestUnstakedCard from "./NestUnstakedCard";
import RansackNestUnstakedCard from "./RansackNestUnstakedCard";
import RansackPlanItem from "./RansackPlanItem";
import { BoxBackIcon, CircleClose } from "./svgIcons";
import { errorAlert } from "./toastGroup";
import UnstakedCardAtNest from "./UnstakedCardAtNest";

export default function RansackBox(props: {
  wallet: WalletContextState;
  isOverlay: boolean;
  setIsOverlay: Function;
  wpNfts: NFTType[] | undefined;
  nestNfts: NFTType[] | undefined;
  updatePage: Function;
}) {
  const { wallet, isOverlay, updatePage, setIsOverlay, nestNfts, wpNfts } =
    props;
  const [isReady, setIsReady] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isMissionSelect, setIsMissionSelect] = useState(false);
  const [missionId, setMissionId] = useState(-1);
  const [planId, setPlanId] = useState(-1);
  const [endProgress, setEndProgress] = useState(false);
  const [isChoosePlan, setIsChoosePlan] = useState(false);

  const [missionCost, setMissionCost] = useState(0);
  const [startLoading, setStartLoading] = useState(false);

  const [nftType, setNftType] = useState(1);
  const [blazins, setBlazins] = useState<NFTType[]>();
  const [forceRender, setForceRender] = useState(false);
  const [selectedWpNfts, setSelectedWpNfts] = useState<{ mint: PublicKey }[]>(
    []
  );
  const [selectedNest, setSelectedNest] = useState<NFTType | undefined>();
  const [maxWpCnt, setMaxWpCnt] = useState(1);

  const [tier, setTier] = useState(1);
  const [selectedMainWpNfts, setSelectedMainWpNfts] = useState<
    { mint: PublicKey }[]
  >([]);

  const [isShowNfts, setIsShowNfts] = useState(false);

  const update = () => {
    setIsEmpty(false);
    setIsMissionSelect(false);
    setMissionId(-1);
    setPlanId(-1);
    setEndProgress(false);
    setIsChoosePlan(false);
    setSelectedNest(undefined);
    setSelectedWpNfts([]);
    updatePage();
  };

  const handleSelect = (mint: string) => {
    let nfts = blazins;
    let selected: { mint: PublicKey }[] = [];
    if (nfts) {
      for (let i = 0; i < nfts.length; i++) {
        if (nfts[i].mint === mint) {
          nfts[i].selected = !nfts[i].selected;
        }
        if (nfts[i].selected) {
          selected.push({ mint: new PublicKey(nfts[i].mint) });
        }
      }
      setSelectedWpNfts(selected);
      // console.log(selected);
    }
    setForceRender(!forceRender);
  };

  const handleSetEmpty = (plan: number) => {
    setIsEmpty(true);
    setMissionId(plan);
  };

  const handleNestSelect = (nft: NFTType) => {
    setSelectedNest(nft);
    setIsShowNfts(false);
  };

  const closeOverlay = () => {
    setIsReady(false);
    setIsOverlay(false);
  };

  const closeNftModal = () => {
    setIsShowNfts(false);
  };

  const resetMission = () => {
    setEndProgress(false);
    setIsMissionSelect(false);
    setMissionId(-1);
    setPlanId(-1);
    setIsChoosePlan(false);
    setSelectedWpNfts([]);
    setSelectedMainWpNfts([]);
    setSelectedNest(undefined);
  };

  const closeIsShowWps = () => {
    if (selectedWpNfts.length <= maxWpCnt) {
      setIsShowNfts(false);
      setSelectedWpNfts(selectedWpNfts);
      setSelectedMainWpNfts(selectedWpNfts);
    } else {
      errorAlert(`Max WP amount should be ${maxWpCnt}`);
    }
  };

  const openNFtsModal = (type: number) => {
    setIsShowNfts(true);
    setNftType(type);
  };

  useEffect(() => {
    if (wpNfts) {
      let newWps: NFTType[] = wpNfts;
      for (let i = 0; i < wpNfts.length; i++) {
        newWps[i].selected = false;
      }
      setBlazins(newWps);
    }
    if (selectedNest) {
      switch (selectedNest.tier) {
        case "1":
          setTier(1);
          setMaxWpCnt(2);
          break;
        case "2":
          setTier(2);
          setMaxWpCnt(5);
          break;
        case "3":
          setTier(3);
          setMaxWpCnt(8);
          break;
        default:
          setTier(1);
          setMaxWpCnt(2);
          break;
      }
    }
    switch (missionId) {
      case 1:
        setMissionCost(50);
        break;
      case 2:
        setMissionCost(250);
        break;
      case 3:
        setMissionCost(500);
        break;
      case 4:
        setMissionCost(1000);
        break;
    }
  }, [selectedNest, wpNfts, missionId]);
  return (
    <div
      className="main-box collection-box ransack"
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
          <div className="box-overlay ransack-overlay">
            <button
              className="box-icon-button corner-button"
              onClick={closeOverlay}
            >
              <BoxBackIcon />
            </button>
            <div className="overlay-content">
              <h3>Blazin Woodpeckers Genesis Collection</h3>
            </div>
          </div>
        )}
        <h3 className="box-title">
          Ransack <span>This will only be available only while nesting.</span>
        </h3>

        {!isChoosePlan && (
          <>
            {/* Step 1 ~ 3 */}
            {!isShowNfts && (
              <>
                {/* Step 1: Start Mission */}
                {!isMissionSelect && missionId < 0 && (
                  <div className="select-mission">
                    <h4>Select a mission</h4>
                    <p>
                      You need at least: <br />
                      X1 woodpecker and X1 nest <br />
                      To Start a mission
                    </p>
                    <button
                      className="btn-action"
                      onClick={() => setIsMissionSelect(true)}
                    >
                      ransack now
                    </button>
                  </div>
                )}
                {/* Step 2: Select Game Station */}
                {isMissionSelect && missionId < 0 && (
                  <div className="mission-box">
                    <button
                      className="back-btn box-icon-button"
                      onClick={() => setIsMissionSelect(false)}
                    >
                      <BoxBackIcon />
                    </button>
                    <div className="mission-item">
                      <h5>Intermediate</h5>
                      <h4>Birdcamp</h4>
                      <button
                        className="btn-action"
                        onClick={() => handleSetEmpty(0)}
                      >
                        50 $Balze
                      </button>
                    </div>
                    <div className="mission-item">
                      <h5>Normal</h5>
                      <h4>Downtown</h4>
                      <button
                        className="btn-action"
                        onClick={() => handleSetEmpty(1)}
                      >
                        250 $Balze
                      </button>
                    </div>
                    <div className="mission-item">
                      <h5>Hard</h5>
                      <h4>Hunted Pier</h4>
                      <button
                        className="btn-action"
                        onClick={() => handleSetEmpty(2)}
                      >
                        500 $Balze
                      </button>
                    </div>
                    <div className="mission-item">
                      <h5>Impossible</h5>
                      <h4>Sewer</h4>
                      <button
                        className="btn-action"
                        onClick={() => handleSetEmpty(3)}
                      >
                        1000 $Balze
                      </button>
                    </div>
                  </div>
                )}
                {/* Step 3: Match Couple NFT */}
                {missionId > -1 && (
                  <div className="ransack-empty">
                    <div className="ransack-empty-content">
                      <button
                        className="back-btn box-icon-button"
                        onClick={() => setMissionId(-1)}
                      >
                        <BoxBackIcon />
                      </button>
                      <h6>Intermediate</h6>
                      <h2>Birdcamp</h2>
                      <p className="d">
                        You need at least
                        <br />
                        1x Woodpecker and 1x nest
                        <br />
                        for this mission
                      </p>
                      <div className="double-group">
                        <div className="left one-item">
                          {selectedNest ? (
                            <>
                              <div
                                className="simple-nft-card"
                                onClick={() => openNFtsModal(1)}
                              >
                                <div className="id">#{selectedNest.id}</div>
                                <div className="label">multiplier</div>
                                <img src={selectedNest.image} alt="" />
                              </div>
                              <h4>Tier {selectedNest.tier}</h4>
                              <p className="nest-p">
                                Nest Tier {selectedNest.tier}
                              </p>
                            </>
                          ) : (
                            <>
                              <div
                                className="empty-box"
                                onClick={() => openNFtsModal(1)}
                              >
                                <p>Select Nest</p>
                              </div>
                              <h4>Empty</h4>
                              <p className="nest-p">Select a Nest</p>
                            </>
                          )}
                        </div>
                        <div className="x">X</div>
                        <div
                          className="right one-item"
                          style={{
                            pointerEvents: selectedNest ? "all" : "none",
                          }}
                        >
                          {selectedMainWpNfts.length === 0 ? (
                            <div
                              className="empty-box"
                              onClick={() => openNFtsModal(2)}
                            >
                              <p>
                                Select
                                <br />
                                Woodpecker NFT
                              </p>
                            </div>
                          ) : (
                            <div
                              className="multi-nfts"
                              onClick={() => openNFtsModal(2)}
                            >
                              <img src="/img/wp-image.png" alt="" />
                            </div>
                          )}
                          <h4>
                            {selectedMainWpNfts.length === 0
                              ? "Empty"
                              : selectedMainWpNfts.length + " WP"}
                          </h4>
                          <p className="nest-p">
                            {selectedMainWpNfts.length === 0
                              ? "Select a Woodpecker"
                              : `Max. x${maxWpCnt} Woodpecker for Tier ${selectedNest?.tier}`}
                          </p>
                        </div>
                      </div>
                      <h3>
                        Mission cost:
                        <br />
                        <span>{missionCost} $BLAZE</span>
                      </h3>
                      <button
                        className="start-mission"
                        onClick={() => setIsChoosePlan(true)}
                      >
                        <>Start Mission</>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Step 4: Select Nest/WP NFT */}
            {isShowNfts && (
              <div className="selectable-nft-box">
                <h2 className="title">
                  {nftType === 1
                    ? "Nest Collection"
                    : "Blazin Woodpeckers Genesis Collection"}
                </h2>
                <button
                  className="box-icon-button corner-button"
                  onClick={closeNftModal}
                >
                  <BoxBackIcon />
                </button>
                {nftType === 1 && (
                  <div className="ransack-nft-modal">
                    {nestNfts &&
                      nestNfts.length !== 0 &&
                      nestNfts.map(
                        (item, key) =>
                          !item.staked && (
                            <RansackNestUnstakedCard
                              id={item.id}
                              nft={item}
                              title="Select"
                              mint={item.mint}
                              uri={item.uri}
                              key={key}
                              image={item.image}
                              handleNestSelect={() => handleNestSelect(item)}
                              setSelectedNest={setSelectedNest}
                            />
                          )
                      )}
                  </div>
                )}
                {nftType === 2 && (
                  <div className="ransack-nft-modal">
                    {blazins &&
                      blazins.length !== 0 &&
                      blazins.map(
                        (item, key) =>
                          !item.staked && (
                            <UnstakedCardAtNest
                              key={key}
                              handleSelect={handleSelect}
                              id={item.id}
                              mint={item.mint}
                              name={item.name}
                              image={item.image}
                              selected={item.selected}
                            />
                          )
                      )}
                  </div>
                )}
                {nftType === 2 && (
                  <div className="select-nft" onClick={() => closeIsShowWps()}>
                    <button>Select NFT</button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        {/* Step 5: Ended Progress */}
        {endProgress && (
          <div className="progressendbox">
            <div className="progressendbox-content">
              <h5>Intermediate</h5>
              <h4>Mission Started</h4>
              <p>Click to continue and go back to your dashboard</p>
              <button className="start-mission" onClick={() => resetMission()}>
                Start Mission
              </button>
            </div>
          </div>
        )}
        {!endProgress && (
          <>
            {isChoosePlan && (
              <>
                <div className="ransack-plan-box">
                  <h3 className="box-title">Choose your Staking Plan</h3>
                  <button
                    className="back-btn box-icon-button"
                    onClick={() => setIsChoosePlan(false)}
                  >
                    <BoxBackIcon />
                  </button>
                  <div className="plans-box">
                    <RansackPlanItem
                      wallet={wallet}
                      missionId={missionId}
                      title="10 days"
                      description={
                        <p>
                          Lock 100 $BLAZE <br />7 $BLAZE a day
                        </p>
                      }
                      updatePage={update}
                      lockTime={10}
                      selectedNest={selectedNest}
                      selectedWpNfts={selectedMainWpNfts}
                      setPlanId={() => setPlanId(1)}
                      setEndProgress={setEndProgress}
                    />
                    <RansackPlanItem
                      wallet={wallet}
                      missionId={missionId}
                      title="20 days"
                      description={
                        <p>
                          Lock 200 $BLAZE <br />
                          10 $BLAZE a day
                        </p>
                      }
                      updatePage={update}
                      lockTime={20}
                      selectedNest={selectedNest}
                      selectedWpNfts={selectedMainWpNfts}
                      setPlanId={() => setPlanId(2)}
                      setEndProgress={setEndProgress}
                    />
                    <RansackPlanItem
                      wallet={wallet}
                      missionId={missionId}
                      title="35 days"
                      description={
                        <p>
                          Lock 300 $BLAZE <br />
                          15 $BLAZE a day
                        </p>
                      }
                      updatePage={update}
                      lockTime={35}
                      selectedNest={selectedNest}
                      selectedWpNfts={selectedMainWpNfts}
                      setPlanId={() => setPlanId(3)}
                      setEndProgress={setEndProgress}
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
