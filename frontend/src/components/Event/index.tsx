import { useState, useEffect } from "react";
import { TrophyIcon } from "@heroicons/react/20/solid";
import PredictionTable from "../Table/PredictionTable";
import Card from "../Card";
import { DarkMarketAbi } from "../../constants/DarkMarketAbi";
import { DarkMarketAddress } from "../../constants/DarkMarketAddress";
import { calculateTotalBets, formatBigInt } from "../../utils/formatters";
import { usePrivy } from "@privy-io/react-auth";
import { useEthPrice } from "../../lib/EthPriceContext";
import { ethers } from "ethers";

const Event: React.FC = () => {
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [selectedBet, setSelectedBet] = useState<"YES" | "NO">("YES");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [dataAll, setDataAll] = useState<any>(null);
  const [dataUser, setDataUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, authenticated } = usePrivy();
  const { ethPrice } = useEthPrice();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(
          "https://rpc.redstonechain.com"
        );
        const contract = new ethers.Contract(
          DarkMarketAddress,
          DarkMarketAbi,
          provider
        );

        const allInfo = await contract.getAllInfo();
        setDataAll(allInfo);

        if (authenticated && user?.wallet?.address) {
          const userBet = await contract.getUserBet(user.wallet.address);
          setDataUser(userBet);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [authenticated, user?.wallet?.address]);

  const [bettingEndTime, optionNames, totalBets] = dataAll || [];

  const predictionTableData = optionNames?.map(
    (outcome: string, index: number) => ({
      outcome,
      totalBet: formatBigInt(totalBets?.[index]),
    })
  );

  const convertBigIntToGMTString = (bigInt: bigint | undefined): string => {
    if (bigInt === undefined) {
      return "";
    }
    const timestamp = Number(bigInt) * 1000;
    const date = new Date(timestamp);
    return date.toUTCString();
  };

  const handleSelectOutcome = (outcome: string, option: number) => {
    setSelectedOutcome(outcome);
    setSelectedOption(option);
  };

  const totalBetsInEth = calculateTotalBets(totalBets);
  const totalBetsInEthNumber = Number(totalBetsInEth);
  const totalBetsInUsd =
    ethPrice !== null ? (totalBetsInEthNumber * ethPrice).toFixed(2) : null;

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ marginTop: "-10%" }}
      >
        <div className="rounded-full h-20 w-20 bg-gray-500 animate-ping"></div>
      </div>
    );
  }

  if (!dataAll) {
    return <div>No market data available</div>;
  }

  return (
    <div className="flex space-x-16">
      <div className="flex-1 space-y-4">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <TrophyIcon className="h-6 w-6 text-gray-400" />
            <p>
              {totalBetsInEth} ETH
              {totalBetsInUsd && ` ($${totalBetsInUsd} USD)`}
            </p>
          </div>
        </div>
        <h2 className="text-2xl font-bold">
          Will Agent and Cinna admit they're dating before October?
        </h2>
        <PredictionTable
          totalBetsInEth={totalBetsInEth}
          data={predictionTableData || []}
          dataUser={dataUser}
          onSelectOutcome={handleSelectOutcome}
          selectedBet={selectedBet}
          onSelectBet={setSelectedBet}
          selectedOption={selectedOption}
          betDate={convertBigIntToGMTString(bettingEndTime)}
        />
      </div>
      <Card selectedOutcome={selectedOutcome} selectedOption={selectedOption} />
    </div>
  );
};

export default Event;
