import {
  useWeb3React,
  MouseEvent,
  ReactElement,
  Provider,
  StyledButton,
  StyledLabel,
} from './Base';



export function SignMessage(): ReactElement {
  const context = useWeb3React<Provider>();
  const { account, active, library } = context;

  function handleSignMessage(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    if (!library || !account) {
      window.alert('Wallet not connected');
      return;
    }

    async function signMessage(
      library: Provider,
      account: string
    ): Promise<void> {
      try {
        const signature = await library.getSigner(account).signMessage('👋');
        window.alert(`Success!\n\n${signature}`);
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    signMessage(library, account);
  }

  return (
    <div>
      <StyledButton
        disabled={!active ? true : false}
        style={{
          cursor: !active ? 'not-allowed' : 'pointer',
          borderColor: !active ? 'unset' : 'blue'
        }}
        onClick={handleSignMessage}
      >
        Sign Message
      </StyledButton>
    </div>


  );
}
