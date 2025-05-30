import { useEffect, useState } from "react";
import { TokenInfo } from "../types";
import { PolTokenInfo, UsdcTokenInfo, UsdtTokenInfo } from "../constants";

export function useTokenList() {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTokens() {
      try {
        setTokens(
          [
            PolTokenInfo,
            UsdtTokenInfo,
            UsdcTokenInfo,
          ]
        );
      } catch (err: unknown) {
        console.log(err);
        setError("Failed to load Polygon tokens");
      } finally {
        setLoading(false);
      }
    }

    fetchTokens();
  }, []);

  return { tokens, loading, error };
}
