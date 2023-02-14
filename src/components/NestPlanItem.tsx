import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { nestToPool, stakeNFT } from "../contexts/transaction";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { ClipLoader } from "react-spinners";
import { NFTType } from "../pages/staking";

export default function NestPlanItem(props: {
  wallet: WalletContextState;
  title: string;
  tier: number;
  selectedNest: NFTType | undefined;
  description: any;
  lockTime: number;
  selectedNfts: { mint: PublicKey }[];
  updatePage: Function;
}) {
  const {
    selectedNest,
    wallet,
    title,
    selectedNfts,
    lockTime,
    tier,
    updatePage,
  } = props;
  const [loading, setLoading] = useState(false);
  const handleStake = async () => {
    try {
      if (selectedNest) {
        await nestToPool(
          wallet,
          new PublicKey(selectedNest.mint),
          selectedNfts,
          lockTime,
          tier,
          setLoading,
          updatePage
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="plan-item">
      <h4>{props.title}</h4>
      {props.description}
      <button onClick={() => handleStake()} disabled={loading}>
        {loading ? <ClipLoader size={10} color="#fff" /> : <>Select Plan</>}
      </button>
    </div>
  );
}
