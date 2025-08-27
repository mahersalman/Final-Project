import { useEffect, useState } from "react";
import { http } from "../api/http";

export function useMe() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    http
      .get("/me")
      .then((res) => setMe(res.data))
      .catch(() => setMe(null))
      .finally(() => setLoading(false));
  }, []);

  return { me, loading };
}
