import { useEffect, useState } from "react";
import { TokenInfo } from "../types";
import { SolaceTokenInfo, VritualProtocolTokenInfo } from "../constants";

export function useTokenList() {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTokens() {
      try {
        setTokens(
          [
            SolaceTokenInfo,
            VritualProtocolTokenInfo,
          ]
        );
      } catch (err: unknown) {
        console.log(err);
        setError("Failed to load tokens");
      } finally {
        setLoading(false);
      }
    }

    fetchTokens();
  }, []);

  return { tokens, loading, error };
}
