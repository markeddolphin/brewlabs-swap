import React, { useEffect, useState } from "react";
import Link from "next/link";

import Modal from "components/Modal";
import { useClaimableTransfers } from "hooks/bridge/useClaimableTransfers";
import LoadingModal from "./LoadingModal";
import Button from "components/Button";

const DONT_SHOW_CLAIMS = "dont-show-claims";

const ClaimTokensModal = () => {
  const { transfers, loading } = useClaimableTransfers();
  const [isOpen, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
    window.localStorage.setItem(DONT_SHOW_CLAIMS, "true");
  };

  useEffect(() => {
    const dontShowClaims = window.localStorage.getItem(DONT_SHOW_CLAIMS) === "true";
    setOpen(!!transfers && transfers.length > 0 && !dontShowClaims);
  }, [transfers]);

  if (loading) return <LoadingModal />;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="p-8">
        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Claim Your Tokens</h3>
          <div className="mx-auto mt-2 max-w-sm">
            <p className="text-sm text-gray-500">
              {`You have `}
              <b>{transfers ? transfers.length : 0}</b>
              {` not claimed transactions `}
            </p>
          </div>
        </div>
        <div className="mt-3 flex justify-center">
          <Button onClick={onClose}>Cancel</Button>
          <Link
            href={"/history"}
            onClick={() => {
              window.localStorage.setItem("dont-show-claims", "false");
            }}
            passHref
          >
            <Button>Claim</Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default ClaimTokensModal;
