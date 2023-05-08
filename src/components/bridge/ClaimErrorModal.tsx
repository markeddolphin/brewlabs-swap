import React from "react";
import Button from "components/Button";
import Modal from "components/Modal";

import { BridgeToken } from "config/constants/types";
import { useBridgeDirection } from "hooks/bridge/useBridgeDirection";
import { getNetworkLabel } from "lib/bridge/helpers";

type ClaimErrorModalProps = {
  open: boolean;
  token?: BridgeToken;
  onClose: () => void;
};

const ClaimErrorModal = ({ open, token, onClose }: ClaimErrorModalProps) => {
  const { foreignChainId } = useBridgeDirection();

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-8">
        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Transfer done already</h3>
          <div className="mx-auto mt-2 max-w-sm">
            <p className="text-sm text-gray-500">
              The tokens were already claimed. Check your
              {token ? ` ${token.symbol} ` : " "}
              token balance in <strong>{getNetworkLabel(foreignChainId)}</strong>.
            </p>
          </div>
        </div>
        <div className="mt-5 text-center">
          <Button onClick={onClose}>Understand</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ClaimErrorModal;
