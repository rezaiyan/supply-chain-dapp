import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import { injected } from './connectors';
import { Provider } from './provider';

export function useEagerConnect(): boolean {
  const { activate, active } = useWeb3React<Provider>();

  const [tried, setTried] = useState(false);

  const tryActivate = useCallback(async (): Promise<void> => {
    const isAuthorized = await injected.isAuthorized();

    if (isAuthorized) {
      try {
        await activate(injected, undefined, true);
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    setTried(true);
  }, [activate]);

  useEffect(() => {
    tryActivate();
  }, [tryActivate]);

  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    } else if (!active && tried) {
      setTried(false);
    }
  }, [tried, active]);

  return tried;
}

export function useInactiveListener(suppress: boolean = false): void {
  const { active, error, activate } = useWeb3React<Provider>();

  useEffect(() => {
    const { ethereum } = window as any;

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = async (): Promise<void> => {
        console.log("Handling 'connect' event");
        try {
          await activate(injected);
        } catch (error: any) {
          console.error('Error during reconnection:', error);
        }
      };

      const handleDisconnect = (): void => {
        console.log("Handling 'disconnect' event");
        // You can perform cleanup or reset state on disconnect if needed
      };

      ethereum.on('connect', handleConnect);
      ethereum.on('disconnect', handleDisconnect);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect);
          ethereum.removeListener('disconnect', handleDisconnect);
        }
      };
    }
  }, [active, error, suppress, activate]);
}
