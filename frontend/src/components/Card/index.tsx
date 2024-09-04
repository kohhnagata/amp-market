import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { DarkMarketAbi } from "constants/DarkMarketAbi";
import { DarkMarketAddress } from "constants/DarkMarketAddress";

interface CardProps {
  selectedOutcome: string | null;
  selectedOption: number | null;
}

const Card: React.FC<CardProps> = ({ selectedOutcome, selectedOption }) => {
  const [betAmount, setBetAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user, authenticated, login } = usePrivy();

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!authenticated) {
      login();
      return;
    }

    if (!selectedOption) {
      alert("Please select an outcome before placing a bet.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Updated for ethers.js v6
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        DarkMarketAddress,
        DarkMarketAbi,
        signer
      );

      const tx = await contract.placeBet(selectedOption, {
        value: ethers.parseEther(betAmount),
      });

      await tx.wait();
      alert("Bet placed successfully!");
      setBetAmount("");
    } catch (error) {
      console.error("Error placing bet:", error);
      alert("Error placing bet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-sm">
      <h2 className="text-xl font-bold mb-4">Place Your Bet</h2>
      <p className="mb-4">
        Selected Outcome: {selectedOutcome || "None selected"}
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="betAmount"
            className="block text-sm font-medium text-gray-700"
          >
            Bet Amount (ETH)
          </label>
          <input
            type="number"
            id="betAmount"
            value={betAmount}
            onChange={handleBetAmountChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="0.1"
            step="0.01"
            min="0"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !selectedOutcome}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            (isSubmitting || !selectedOutcome) &&
            "opacity-50 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Placing Bet..." : "Place Bet"}
        </button>
      </form>
    </div>
  );
};

export default Card;
