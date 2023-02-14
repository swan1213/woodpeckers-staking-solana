import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { stakeNFT } from "../contexts/transaction";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { ClipLoader } from "react-spinners";

export default function PlanItem(props: {
  wallet: WalletContextState;
  title: string;
  description: any;
  lockTime: number;
  selectedNfts: { mint: PublicKey }[];
  updatePage: Function;
}) {
  const [loading, setLoading] = useState(false);
  const handleStake = async () => {
    try {
      await stakeNFT(
        props.wallet,
        props.selectedNfts,
        props.lockTime,
        setLoading,
        props.updatePage
      );
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
