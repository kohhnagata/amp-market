import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import styled from "styled-components";

const StyledButton = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 8px 16px;
  color: #ffffff;
  background: #1652f0;
  font-size: 16px;
  font-weight: 500;
  border-radius: 0.5rem;
  box-shadow: 0 4px 24px -6px #1652f0;

  transition: 200ms ease;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 6px 40px -6px #1652f0;
  }
  &:active {
    transform: translateY(-3px);
    box-shadow: 0 6px 32px -6px #1652f0;
  }
`;

export const ConnectWallet: React.FC<{ buttonText?: string }> = ({
  buttonText = "Log in / Sign up",
}) => {
  const { login, authenticated, user } = usePrivy();

  return (
    <StyledButton onClick={authenticated ? () => {} : login}>
      {authenticated
        ? user?.wallet?.address?.slice(0, 6) +
          "..." +
          user?.wallet?.address?.slice(-4)
        : buttonText}
    </StyledButton>
  );
};
