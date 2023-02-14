/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import { NFTType } from "../pages/staking";
import { CheckIcon } from "./svgIcons";

export default function NestUnstakedCard(props: {
  id: string;
  mint: string;
  nft: NFTType;
  title: string;
  showSelectBox: Function;
  setSelectedNest: Function;
  setIsShowWps: Function;
  uri?: string;
  name?: string;
  image?: string;
  selected?: boolean;
  isNest?: boolean;
}) {
  const {
    id,
    name,
    title,
    image,
    nft,
    selected,
    isNest,
    mint,
    showSelectBox,
    setIsShowWps,
    setSelectedNest,
  } = props;

  const setSelect = () => {
    showSelectBox();
    setSelectedNest(nft);
  };

  return (
    <div
      className="nft-card unstaked-card nest-unstaked-card"
      onClick={() => setSelect()}
    >
      <div className="nft-id">#{id}</div>
      <div className="nft-image">
        {image === "" ? (
          <div className="empty-image"></div>
        ) : (
          <img src={image} alt="" />
        )}
      </div>
      <div className="selected">
        <button className="btn-action">{title}</button>
      </div>
    </div>
  );
}
