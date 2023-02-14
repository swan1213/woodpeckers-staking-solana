/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { useWallet } from "@solana/wallet-adapter-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import MainBox from "../components/MainBox";
import { getNetworkTime, solConnection } from "../contexts/utils";
import {
  CREATOR_ADDRESS_BLAZIN,
  CREATOR_ADDRESS_NEST,
  EMPTY_ADDRESS,
} from "../config";
import CollectionBox from "../components/CollectionBox";
import Header from "../components/Header";
import {
  getAllNFTs,
  getGlobalInfo,
  getNestPoolState,
  getRansackPoolState,
  getUserPoolInfo,
} from "../contexts/transaction";
import CollectionStakedBox from "../components/CollectionStakedBox";
import RansackBox from "../components/RansackBox";
import NestCollectionBox from "../components/NestCollectionBox";
import NestStakedCollectionBox from "../components/NestStakedCollectionBox";
import RansackStakedBox from "../components/RansackStakedBox";
import { BLAZE_TOKEN_DECIMAL, EPOCH } from "../contexts/type";

export interface NFTType {
  mint: string;
  id: string;
  uri: string;
  image: string;
  name: string;
  selected: boolean;
  tier: string;
  staked: boolean;
  isMulti: boolean;
  stakedTime: number;
  lockTime: number;
  lockLength: number;
  claimable: number;
  nested: boolean;
  ransacked: boolean;
}

export interface StakedWp {
  claimable: number;
  emission: number;
  lockTime: number;
  nest: string;
  stakedTime: number;
  mint: string;
}

const StakingPage: NextPage = () => {
  const router = useRouter();
  const wallet = useWallet();
  const [blazins, setBlazins] = useState<NFTType[]>();
  const [nests, setNests] = useState<NFTType[]>();
  const [loading, setLoading] = useState(false);
  const [isOverlay, setIsOverlay] = useState(false);

  const [totalStakedCount, setTotalStakedCount] = useState(0);
  const [totalRewardDistributed, setTotalRewardDistributed] = useState(0);
  const [accumulatedReward, setAccumulatedReward] = useState(0);

  const getWalletNfts = async () => {
    if (wallet.publicKey === null) {
      setBlazins([]);
      setNests([]);
      return;
    }
    setLoading(true);
    // get block time no global time
    const now = await getNetworkTime();
    const stakedNfts = await getUserPoolInfo(wallet.publicKey);
    const nestedState = await getNestPoolState(wallet.publicKey);
    const missionState = await getRansackPoolState(wallet.publicKey);

    let normalStakedWps: {
      claimable: number;
      lockTime: number;
      mint: string;
      stakedTime: number;
    }[] = [];
    let nestedWps: StakedWp[] = [];
    let missionedWps: StakedWp[] = [];

    if (stakedNfts) {
      let data = stakedNfts.staking;
      for (let i = 0; i < stakedNfts.stakedCount; i++) {
        normalStakedWps.push({
          claimable: stakedNfts.staking[i].claimable,
          lockTime: stakedNfts.staking[i].lockTime,
          mint: stakedNfts.staking[i].mint,
          stakedTime: stakedNfts.staking[i].stakedTime,
        });
      }
    }

    if (nestedState) {
      const stakedCount = nestedState.stakedCount.toNumber();
      for (let i = 0; i < stakedCount; i++) {
        for (let j = 0; j < 8; j++) {
          if (nestedState.staking[i].woodpecker[j].toBase58() !== EMPTY_ADDRESS)
            nestedWps.push({
              claimable: nestedState.staking[i].claimable.toNumber(),
              emission: nestedState.staking[i].emission.toNumber(),
              lockTime: nestedState.staking[i].lockTime.toNumber(),
              nest: nestedState.staking[i].nest.toBase58(),
              stakedTime: nestedState.staking[i].stakedTime.toNumber(),
              mint: nestedState.staking[i].woodpecker[j].toBase58(),
            });
        }
      }
    }

    if (missionState) {
      const stakedCount = missionState.stakedCount.toNumber();
      for (let i = 0; i < stakedCount; i++) {
        for (let j = 0; j < 8; j++) {
          if (
            missionState.staking[i].woodpecker[j].toBase58() !== EMPTY_ADDRESS
          )
            missionedWps.push({
              claimable: missionState.staking[i].claimable.toNumber(),
              emission: missionState.staking[i].emission.toNumber(),
              lockTime: missionState.staking[i].lockTime.toNumber(),
              nest: missionState.staking[i].nest.toBase58(),
              stakedTime: missionState.staking[i].stakedTime.toNumber(),
              mint: missionState.staking[i].woodpecker[j].toBase58(),
            });
        }
      }
    }

    const nftList = await getParsedNftAccountsByOwner({
      publicAddress: wallet.publicKey.toBase58(),
      connection: solConnection,
    });

    let blazinList: NFTType[] = [];
    let nestsList: NFTType[] = [];

    for (let item of nftList) {
      if (
        item.data.creators &&
        item.data.creators[0].address === CREATOR_ADDRESS_BLAZIN
      ) {
        blazinList.push({
          mint: item.mint,
          id: item.data.name.split("#")[1],
          uri: item.data.uri,
          image: "",
          name: item.data.name,
          selected: false,
          tier: "0",
          staked: false,
          isMulti: false,
          stakedTime: now as number,
          lockTime: now as number,
          claimable: 0,
          lockLength: 0,
          nested: false,
          ransacked: false,
        });
      } else if (
        item.data.creators &&
        item.data.creators[0].address === CREATOR_ADDRESS_NEST
      ) {
        nestsList.push({
          mint: item.mint,
          id: item.data.name.split("#")[1],
          uri: item.data.uri,
          image: "",
          name: item.data.name,
          selected: false,
          tier: "0",
          staked: false,
          isMulti: false,
          stakedTime: now as number,
          lockTime: now as number,
          claimable: 0,
          lockLength: 0,
          nested: false,
          ransacked: false,
        });
      }
    }

    let blazinMetaList: { image: string; name: string }[] = await Promise.all(
      blazinList.map((nft) =>
        fetch(nft.uri)
          .then((resp) => resp.json())
          .then((json) => {
            return {
              image: json.image as string,
              name: json.name as string,
            };
          })
          .catch((error) => {
            console.log(error);
            return {
              image: "",
              name: "",
            };
          })
      )
    );
    let nestMetaList: { image: string; name: string; tier: string }[] =
      await Promise.all(
        nestsList.map((nft) =>
          fetch(nft.uri)
            .then((resp) => resp.json())
            .then((json) => {
              return {
                image: json.image as string,
                name: json.name as string,
                tier: json.attributes.filter(
                  (item: any) => item.trait_type.toLowerCase() === "tier"
                )[0].value,
              };
            })
            .catch((error) => {
              console.log(error);
              return {
                image: "",
                name: "",
                tier: "0",
              };
            })
        )
      );

    for (let i = 0; i < blazinList.length; i++) {
      blazinList[i].image = blazinMetaList[i].image;
      const normaled = normalStakedWps.find(
        (nft) => nft.mint === blazinList[i].mint
      );
      const nested = nestedWps.find((nft) => nft.mint === blazinList[i].mint);
      const missined = missionedWps.find(
        (nft) => nft.mint === blazinList[i].mint
      );

      if (normaled) {
        blazinList[i].staked = true;
        blazinList[i].claimable = normaled.claimable;
        blazinList[i].lockTime = normaled.lockTime;
        blazinList[i].mint = normaled.mint;
        blazinList[i].stakedTime = normaled.stakedTime;
      }
      if (nested) {
        blazinList[i].staked = true;
        blazinList[i].claimable = nested.claimable;
        blazinList[i].lockTime = nested.lockTime;
        blazinList[i].mint = nested.mint;
        blazinList[i].stakedTime = nested.stakedTime;
        blazinList[i].nested = true;
      }
      if (missined) {
        blazinList[i].staked = true;
        blazinList[i].claimable = missined.claimable;
        blazinList[i].lockTime = missined.lockTime;
        blazinList[i].mint = missined.mint;
        blazinList[i].nested = true;
      }
    }
    for (let i = 0; i < nestsList.length; i++) {
      nestsList[i].image = nestMetaList[i].image;
      nestsList[i].tier = nestMetaList[i].tier;

      const nested = nestedWps.find((nft) => nft.nest === nestsList[i].mint);
      const missined = missionedWps.find(
        (nft) => nft.nest === nestsList[i].mint
      );

      if (nested) {
        nestsList[i].staked = true;
        nestsList[i].claimable = nested.claimable;
        nestsList[i].lockTime = nested.lockTime;
        nestsList[i].stakedTime = nested.stakedTime;
        nestsList[i].nested = true;
      }
      if (missined) {
        nestsList[i].staked = true;
        nestsList[i].claimable = missined.claimable;
        nestsList[i].lockTime = missined.lockTime;
        nestsList[i].ransacked = true;
      }
    }
    setBlazins(blazinList);
    setNests(nestsList);
    setLoading(false);
  };

  const getAllGlobalData = async () => {
    const data = await getGlobalInfo();
    if (data) {
      setTotalStakedCount(data.totalStakedCount);
      setTotalRewardDistributed(
        data.totalRewardDistributed / BLAZE_TOKEN_DECIMAL
      );
    }
  };

  const getUserData = async () => {
    if (wallet.publicKey === null) return;
    let accumuated = 0;
    const userStakedData = await getUserPoolInfo(wallet.publicKey);
    const userNestData = await getNestPoolState(wallet.publicKey);
    const userMissionData = await getRansackPoolState(wallet.publicKey);
    if (userStakedData) {
      accumuated = accumuated + userStakedData.accumulatedReward;
    }
    if (userNestData) {
      accumuated = accumuated + userNestData.accumulatedReward.toNumber();
    }
    if (userMissionData) {
      accumuated = accumuated + userMissionData.accumulatedReward.toNumber();
    }
    setAccumulatedReward(accumuated / BLAZE_TOKEN_DECIMAL);
  };

  const updatePage = () => {
    getWalletNfts();
    getAllGlobalData();
    getUserData();
  };

  useEffect(() => {
    updatePage();
  }, [wallet.publicKey, wallet.connected]);

  return (
    <>
      <Header />
      <main className="pt-220">
        <div className="container">
          <div className="top-value-banner">
            <MainBox>
              <div className="total-values">
                <p>Supply</p>
                <h2>5555</h2>
              </div>
            </MainBox>
            <MainBox>
              <div className="total-values">
                <p>Total Staked</p>
                <h2>{((totalStakedCount / 5555) * 100).toFixed(2)}%</h2>
              </div>
            </MainBox>
            <MainBox>
              <div className="total-values">
                <p>Rewards Distributed</p>
                <h2 style={{ fontWeight: 400 }}>
                  <span>{totalRewardDistributed.toLocaleString()} </span>$BLAZE
                </h2>
              </div>
            </MainBox>
          </div>
          {wallet.publicKey !== null && (
            <>
              <div className="top-value-banner-two">
                <h1>Your a rewards</h1>
                <button className="collect-rewards">collect rewards</button>
                <div className="two-content">
                  <MainBox>
                    <div className="total-values">
                      <p>Live Rewards</p>
                      <h2 style={{ fontWeight: 400 }}>
                        <span>0</span>$BLAZE
                      </h2>
                    </div>
                  </MainBox>
                  <MainBox>
                    <div className="total-values">
                      <p>Accumulated Rewards</p>
                      <h2 style={{ fontWeight: 400 }}>
                        <span>+{accumulatedReward.toLocaleString()}</span>
                        $BLAZE
                      </h2>
                    </div>
                  </MainBox>
                </div>
              </div>

              <CollectionBox
                wallet={wallet}
                title="Blazin Woodpeckers Genesis Collections"
                nftList={blazins}
                loading={loading}
                setNfts={setBlazins}
                isOverlay={isOverlay}
                setIsOverlay={setIsOverlay}
                updatePage={updatePage}
              />

              {blazins?.filter((nft) => nft.staked).length !== 0 && (
                <CollectionStakedBox
                  wallet={wallet}
                  title="Blazin Woodpeckerz Staked"
                  nftList={blazins}
                  loading={loading}
                  setNfts={setBlazins}
                  isOverlay={isOverlay}
                  setIsOverlay={setIsOverlay}
                  updatePage={updatePage}
                />
              )}

              <NestCollectionBox
                wallet={wallet}
                title="Nest Collections"
                wpNftList={blazins}
                nestNftList={nests}
                loading={loading}
                setNfts={setNests}
                isOverlay={isOverlay}
                setIsOverlay={setIsOverlay}
                updatePage={updatePage}
              />

              <NestStakedCollectionBox
                wallet={wallet}
                title="Nesting"
                wpNftList={blazins}
                nestNftList={nests}
                loading={loading}
                setNfts={setNests}
                isOverlay={isOverlay}
                setIsOverlay={setIsOverlay}
                updatePage={updatePage}
              />
              <RansackBox
                wallet={wallet}
                isOverlay={isOverlay}
                setIsOverlay={setIsOverlay}
                wpNfts={blazins}
                nestNfts={nests}
                updatePage={updatePage}
              />
              <RansackStakedBox
                wallet={wallet}
                isOverlay={isOverlay}
                setIsOverlay={setIsOverlay}
                wpNfts={blazins}
                nestNfts={nests}
                updatePage={updatePage}
              />
            </>
          )}
          {isOverlay && <div className="overlay-back"></div>}
        </div>
      </main>
    </>
  );
};

export default StakingPage;
