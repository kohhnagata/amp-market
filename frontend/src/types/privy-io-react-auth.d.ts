// src/types/privy-io-react-auth.d.ts

declare module '@privy-io/react-auth' {
    export interface PrivyClientConfig {
      // Add any known configuration options here
    }
  
    export function usePrivy(): {
      ready: boolean;
      authenticated: boolean;
      user: any; // Replace 'any' with a more specific type if known
      login: () => Promise<void>;
      logout: () => Promise<void>;
      // Add other known properties and methods returned by usePrivy
    };
  
    export function PrivyProvider(props: { appId: string; config?: PrivyClientConfig; children: React.ReactNode }): JSX.Element;
  
    // Add other known exports from the package
  }