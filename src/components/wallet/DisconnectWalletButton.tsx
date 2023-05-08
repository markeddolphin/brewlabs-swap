import { useDisconnect } from "wagmi";
import { useGlobalState } from "../../state";

const DisconnectWalletButton = () => {
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useGlobalState("userSidebarOpen");

  return (
    <button
      className="btn"
      onClick={() => {
        disconnect(), setIsOpen(0);
      }}
    >
      Disconnect wallet
    </button>
  );
};

export default DisconnectWalletButton;
