/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import { NFTType } from "../pages/staking";
import { CheckIcon } from "./svgIcons";

export default function RansackNestUnstakedCard(props: {
  id: string;
  mint: string;
  nft: NFTType;
  title: string;
  setSelectedNest: Function;
  handleNestSelect: Function;
  uri?: string;
  name?: string;
  image?: string;
  isNest?: boolean;
}) {
  const {
    id,
    name,
    title,
    image,
    nft,
    isNest,
    mint,
    setSelectedNest,
    handleNestSelect,
  } = props;

  const setSelect = () => {
    setSelectedNest(nft);
  };

  return (
    <div
      className="nft-card unstaked-card nest-unstaked-card"
      onClick={() => handleNestSelect()}
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
