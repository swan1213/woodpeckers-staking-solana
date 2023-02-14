import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { ClipLoader } from "react-spinners";
import { NFTType } from "../pages/staking";
import { ransackToPool } from "../contexts/transaction";

export default function RansackPlanItem(props: {
  wallet: WalletContextState;
  missionId: number;
  title: string;
  description: any;
  lockTime: number;
  updatePage: Function;
  selectedNest: NFTType | undefined;
  setPlanId: Function;
  setEndProgress: Function;
  selectedWpNfts: {
    mint: PublicKey;
  }[];
}) {
  const {
    wallet,
    missionId,
    title,
    description,
    lockTime,
    updatePage,
    selectedNest,
    setPlanId,
    setEndProgress,
    selectedWpNfts,
  } = props;
  const [loading, setLoading] = useState(false);

  const update = () => {
    updatePage();
  };

  const handleStake = async () => {
    // setPlanId();
    // setEndProgress(true);
    if (selectedNest === undefined) return;
    if (selectedWpNfts.length === 0) return;
    try {
      await ransackToPool(
        wallet,
        new PublicKey(selectedNest.mint),
        selectedWpNfts,
        missionId,
        lockTime,
        parseInt(selectedNest.tier),
        setLoading,
        () => update()
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="plan-item">
      <h4>{title}</h4>
      {description}
      <button onClick={() => handleStake()} disabled={loading}>
        {loading ? <ClipLoader size={10} color="#fff" /> : <>Select Plan</>}
      </button>
    </div>
  );
}
