import { useEffect, useState } from "react";
import { getUserEmail } from "thirdweb/wallets/in-app";

export const useActiveAccountEmail = (client: any) => {
  const [email, setEmail] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getUserEmail({ client: client })
      .then(setEmail)
      .finally(() => setLoading(false));
  }, []);

  return { email, loading };
};
