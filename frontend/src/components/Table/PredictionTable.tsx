import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import PredictionTableBody from "./PredictionTableBody";
import { DarkMarketAddress } from "constants/DarkMarketAddress";
import { calculateSingleBet } from "../../utils/formatters";
import { useEthPrice } from "../../lib/EthPriceContext";

interface PredictionTableProps {
  totalBetsInEth: string;
  data: Array<{
    outcome: string;
    totalBet: string;
  }>;
  dataUser: readonly bigint[] | undefined;
  onSelectOutcome: (outcome: string, option: number) => void;
  selectedBet: "YES" | "NO";
  onSelectBet: (bet: "YES" | "NO") => void;
  selectedOption: number | null;
  betDate: string;
}

interface Activity {
  from: string;
  to: string;
  value: string;
}

const PredictionTable: React.FC<PredictionTableProps> = ({
  totalBetsInEth,
  data,
  dataUser,
  onSelectOutcome,
  selectedBet,
  onSelectBet,
  selectedOption,
  betDate,
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { ethPrice } = useEthPrice();

  useEffect(() => {
    if (data && data.length > 0 && selectedOption === null) {
      onSelectOutcome(data[0].outcome, 0);
    }
  }, [data, onSelectOutcome, selectedOption]);

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      const provider = new ethers.JsonRpcProvider(
        "https://rpc.redstonechain.com"
      );

      const blockNumber = await provider.getBlockNumber();
      const logs = await provider.getLogs({
        address: DarkMarketAddress,
        fromBlock: blockNumber - 20000,
        toBlock: "latest",
      });

      const activities = await Promise.all(
        logs.map(async (log) => {
          const transaction = await provider.getTransaction(
            log.transactionHash
          );
          if (!transaction) {
            return null;
          }

          return {
            from: transaction.from,
            to: transaction.to,
            value: ethers.formatEther(transaction.value),
            hash: transaction.hash,
          };
        })
      );
      const validActivities: Activity[] = activities.filter(
        (activity) => activity !== null
      ) as Activity[];
      setActivities(validActivities);
    };

    fetchRecentTransactions();
  }, []);

  const handleSelectBet = (index: number, bet: "YES" | "NO") => {
    onSelectBet(bet);
    onSelectOutcome(data[index]?.outcome, index);
  };

  return (
    <div>
      <table className="table-auto w-full mb-4">
        <thead>
          <tr className="border-t border-b border-gray-300">
            <th className="px-4 py-2 text-xs text-gray-500">Outcome</th>
            <th className="px-4 py-2 text-xs text-gray-500">Total Bet</th>
            <th className="px-4 py-2 text-xs text-gray-500">Odds</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <PredictionTableBody
              key={index}
              outcome={item.outcome}
              totalBet={item.totalBet}
              totalBetsInEth={totalBetsInEth}
              isSelected={selectedOption === index}
              selectedBet={selectedOption === index ? selectedBet : null}
              onSelectBet={(bet: "YES" | "NO") => handleSelectBet(index, bet)}
              option={index}
            />
          ))}
        </tbody>
      </table>

      {dataUser && dataUser.length > 0 && (
        <>
          <h3 className="mt-8 text-md font-semibold pb-1 mb-2">My Bets</h3>
          <table className="table-auto w-full mb-4">
            <thead>
              <tr className="border-t border-b border-gray-300">
                <th className="px-4 py-2 text-xs text-gray-500">My position</th>
                <th className="px-4 py-2 text-xs text-gray-500">Bet Amount</th>
              </tr>
            </thead>
            <tbody>
              {dataUser.map((betAmount, index) => {
                if (betAmount === BigInt(0)) {
                  return null;
                }
                const betInEth = calculateSingleBet(betAmount);
                const betInUsd =
                  ethPrice !== null
                    ? (parseFloat(betInEth) * ethPrice).toFixed(2)
                    : null;
                return (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-4 py-2 text-left">
                      {data[index]?.outcome}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {betInEth} ETH
                      {betInUsd && ` ($${betInUsd} USD)`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      <div className="my-8">
        <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">
          Rules
        </h3>
        <p className="text-md">
          This market will resolve to "Yes" if Twitch streamer "Agent00" (Din
          Muktar) and "Cinna" (Brittany Lynn Watts) publicly confirm they are
          dating in a live stream on any platform between September 1 and
          September 30, 2024, by 11:59 PM ET. The stream must be publicly
          accessible, and one of them must explicitly state that they are
          dating. Video calls where their confession is visible to viewers will
          qualify, but audio phone calls will not. The resolution will be based
          on the video of the stream.
          <br></br>
          Resolver:
        </p>
      </div>
      <div className="my-8">
        <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">
          Activity
        </h3>
        <div className="text-sm">
          {activities && activities.length > 0 ? (
            activities.map((activity, index) => (
              <p key={index}>
                <a
                  className="text-blue-500"
                  href={`https://explorer.redstone.xyz/address/${activity.from}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {activity.from}
                </a>{" "}
                bet {activity.value} ETH
              </p>
            ))
          ) : (
            <p>No recent activities found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionTable;
