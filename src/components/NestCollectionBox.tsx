/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { NFTType } from "../pages/staking";
import Skeleton from "@mui/material/Skeleton";
import { WalletContextState } from "@solana/wallet-adapter-react";
import NestUnstakedCard from "./NestUnstakedCard";
import { BoxBackIcon, CircleClose } from "./svgIcons";
import UnstakedCardAtNest from "./UnstakedCardAtNest";
import { PublicKey } from "@solana/web3.js";
import { errorAlert } from "./toastGroup";
import NestPlanItem from "./NestPlanItem";
import { getNestPoolState, getRansackPoolState } from "../contexts/transaction";

export default function NestCollectionBox(props: {
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
  const [selectedNest, setSelectedNest] = useState<NFTType>();
  const [maxWpCnt, setMaxWpCnt] = useState(1);
  const [isShowWps, setIsShowWps] = useState(false);
  const [isStakingPlan, setIsStakingPlan] = useState(false);
  const [tier, setTier] = useState(1);

  const [blazins, setBlazins] = useState<NFTType[]>();
  const [selectedNfts, setSelectedNfts] = useState<{ mint: PublicKey }[]>([]);
  const [selectedMainNfts, setSelectedMainNfts] = useState<
    { mint: PublicKey }[]
  >([]);

  const update = () => {
    updatePage();
    closeOverlay();
  };

  const closeOverlay = () => {
    setIsReady(false);
    setIsOverlay(false);
    setIsStakingPlan(false);
    setSelectedMainNfts([]);
  };

  const closeIsShowWps = () => {
    if (selectedNfts.length <= maxWpCnt) {
      setIsShowWps(false);
      setSelectedMainNfts(selectedNfts);
    } else {
      errorAlert(`Max WP amount should be ${maxWpCnt}`);
    }
  };

  const closeClerIsShowWps = () => {
    setIsShowWps(false);
  };

  const showSelectBox = () => {
    setIsOverlay(true);
    setIsReady(true);
  };

  const getStakedNests = async () => {
    if (wallet.publicKey === null) return;
    if (nestNftList === undefined) return;
    let nests = nestNftList;
    const nested = await getNestPoolState(wallet.publicKey);
    const missioned = await getRansackPoolState(wallet.publicKey);
    console.log(nested, "==> nested");
    console.log(missioned, "==> missioned");
    if (missioned) {
      for (let i = 0; i < missioned.stakedCount.toNumber(); i++) {}
    }
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
      setSelectedNfts(selected);
      // console.log(selected);
    }
    setForceRender(!forceRender);
  };

  useEffect(() => {
    if (wpNftList) {
      let newWps: NFTType[] = wpNftList;
      for (let i = 0; i < wpNftList.length; i++) {
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
    // getStakedNests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedNest,
    wpNftList,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(nestNftList),
    wallet.publicKey,
    wallet.connected,
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
        {isOverlay && isReady && (
          <div className="box-overlay">
            {!isShowWps ? (
              <button
                className="box-icon-button corner-button"
                onClick={closeOverlay}
              >
                <CircleClose />
              </button>
            ) : (
              <button
                className="box-icon-button corner-button"
                onClick={() => closeClerIsShowWps()}
              >
                <BoxBackIcon />
              </button>
            )}
            <div className="overlay-content">
              <h3>Nesting Woodpeckers</h3>
            </div>
            {!isStakingPlan ? (
              <>
                {selectedNest && !isShowWps && (
                  <div className="nest-group">
                    <div className="nest-group-content">
                      <div className="item-group">
                        <div className="id">#{selectedNest.id}</div>
                        <div className="label">multiplier</div>
                        <img src={selectedNest.image} alt="" />
                        <p className="item-dec">Tier {selectedNest.tier}</p>
                      </div>
                      <p className="x">X</p>
                      <div className="item-group">
                        {selectedMainNfts.length === 0 ? (
                          <div
                            className="multi-pre-box"
                            onClick={() => setIsShowWps(true)}
                          >
                            <p className="t">
                              Select
                              <br />
                              Woodpecker
                              <br />
                              NFT
                            </p>
                          </div>
                        ) : (
                          <div
                            className="multi-nfts"
                            onClick={() => setIsShowWps(true)}
                          >
                            <img src="/img/wp-image.png" alt="" />
                            <div className="multi-nfst-overlay">
                              <h2>X{selectedMainNfts.length}</h2>
                              <p>WP</p>
                            </div>
                          </div>
                        )}
                        <p className="item-dec">
                          Max. x{maxWpCnt} Woodpecker
                          <br />
                          for Tier {selectedNest.tier}
                        </p>
                      </div>
                    </div>
                    {selectedMainNfts.length === 0 ? (
                      <button
                        className="btn-action"
                        onClick={() => closeOverlay()}
                      >
                        get in the nest
                      </button>
                    ) : (
                      <button
                        className="btn-action"
                        onClick={() => setIsStakingPlan(true)}
                      >
                        choose your staking plan
                      </button>
                    )}
                  </div>
                )}

                {selectedNest && isShowWps && (
                  <div className="nest-group">
                    <div className="nest-box-list">
                      {blazins &&
                        blazins.length !== 0 &&
                        blazins.map(
                          (item, key) =>
                            !item.staked && (
                              <UnstakedCardAtNest
                                key={key}
                                id={item.id}
                                handleSelect={handleSelect}
                                mint={item.mint}
                                name={item.name}
                                image={item.image}
                                selected={item.selected}
                              />
                            )
                        )}
                    </div>
                    <button
                      className="btn-action"
                      onClick={() => closeIsShowWps()}
                    >
                      Select Woodpecker
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="nest-plan-box">
                <h2>Choose your Staking Plan</h2>
                <button
                  className="box-icon-button corner-button"
                  onClick={() => setIsStakingPlan(false)}
                >
                  <CircleClose />
                </button>
                <div className="nest-plan-box-content">
                  <NestPlanItem
                    wallet={wallet}
                    selectedNest={selectedNest}
                    title={"Unlocked"}
                    description={
                      <p>
                        You get:
                        <br />4 $Blazin a day
                      </p>
                    }
                    tier={tier}
                    lockTime={0}
                    selectedNfts={selectedMainNfts}
                    updatePage={update}
                  />
                  <NestPlanItem
                    wallet={wallet}
                    selectedNest={selectedNest}
                    title={"10 days"}
                    description={
                      <p>
                        Lock in 100 $BLAZE
                        <br />7 $BLAZE a day
                      </p>
                    }
                    tier={tier}
                    lockTime={10}
                    selectedNfts={selectedMainNfts}
                    updatePage={update}
                  />
                  <NestPlanItem
                    wallet={wallet}
                    selectedNest={selectedNest}
                    title={"20 days"}
                    description={
                      <p>
                        Lock in 200 $BLAZE <br />
                        10 $BLAZE a day
                      </p>
                    }
                    tier={tier}
                    lockTime={20}
                    selectedNfts={selectedMainNfts}
                    updatePage={update}
                  />
                  <NestPlanItem
                    wallet={wallet}
                    selectedNest={selectedNest}
                    title={"35 days"}
                    description={
                      <p>
                        Lock in 300 $BLAZE
                        <br />
                        15 $BLAZE a day
                      </p>
                    }
                    tier={tier}
                    lockTime={35}
                    selectedNfts={selectedMainNfts}
                    updatePage={update}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {!(isOverlay && isReady) && (
          <>
            <h3>{title}</h3>
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
                {nestNftList &&
                  nestNftList.length !== 0 &&
                  nestNftList.map(
                    (item, key) =>
                      !item.staked && (
                        <NestUnstakedCard
                          id={item.id}
                          nft={item}
                          title="Nest"
                          mint={item.mint}
                          uri={item.uri}
                          key={key}
                          image={item.image}
                          selected={item.selected}
                          showSelectBox={showSelectBox}
                          setSelectedNest={setSelectedNest}
                          setIsShowWps={setIsShowWps}
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
