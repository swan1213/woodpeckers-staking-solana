/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import { CheckIcon } from "./svgIcons";

export default function UnstakedCardAtNest(props: {
  id: string;
  handleSelect: Function;
  mint: string;
  uri?: string;
  name?: string;
  image?: string;
  selected?: boolean;
  isNest?: boolean;
}) {
  const { id, name, image, selected, isNest, handleSelect, mint } = props;
  return (
    <div className="nft-card unstaked-card" onClick={() => handleSelect(mint)}>
      <div className="nft-id">#{id}</div>
      <div className="nft-image">
        {image === "" ? (
          <div className="empty-image"></div>
        ) : (
          <img src={image} alt="" />
        )}
      </div>
      {selected && (
        <div className="selected">
          <CheckIcon />
          <p>
            Ready for <br />
            staking
          </p>
        </div>
      )}
    </div>
  );
}
