import { cookieStorage, createConfig } from "@alchemy/aa-alchemy/config";
import { sepolia } from "@alchemy/aa-core";
import { QueryClient } from "@tanstack/react-query";

export const config = createConfig({
  // required
  rpcUrl: "/api/rpc",
  chain: sepolia,
  ssr: false,
  storage: cookieStorage,
});

export const uiConfig = {
  auth: {
    sections: [[{ type: "email" }], [{ type: "passkey" }]],
    addPasskeyOnSignup: true,
  },
};

export const queryClient = new QueryClient();
