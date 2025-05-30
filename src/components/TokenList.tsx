import React, { useState } from "react";
import { Token } from "@uniswap/sdk-core";
import { TokenInfo } from "../types";

interface TokenListProps {
  tokens: TokenInfo[];
  onSelect: (token: Token) => void;
  onClose: () => void;
}

export const TokenList: React.FC<TokenListProps> = ({
  tokens,
  onSelect,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase() === searchQuery.toLowerCase()
  );

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
      <div className="p-4">
        <input
          type="text"
          placeholder="Search token name or paste address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="divide-y">
        {filteredTokens.map((token) => (
          <button
            key={token.address}
            className="w-full p-4 text-left hover:bg-gray-50 flex items-center"
            onClick={() => {
              onSelect(
                new Token(
                  token.chainId,
                  token.address,
                  token.decimals,
                  token.symbol,
                  token.name
                )
              );
              onClose();
            }}
          >
            {token.logoURI && (
              <div className="relative h-[24px] me-5">
                <img
                  src={token.logoURI}
                  alt={token.symbol}
                  className="h-[24px]"
                />
              </div>
            )}
            <div>
              <div className="font-medium">
                {token.symbol === "WMATIC" ? "POL" : token.symbol}
              </div>
              <div className="text-sm text-gray-500">{token.name}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
