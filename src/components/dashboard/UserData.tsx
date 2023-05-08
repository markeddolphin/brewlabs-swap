import { InformationCircleIcon } from "@heroicons/react/24/outline";
import BrewlabsBalance from "components/dashboard/BrewlabsBalance";

const WalletData = () => {
  return (
    <div>
      <BrewlabsBalance />

      <div className="alert shadow-lg">
        <div>
          <InformationCircleIcon className="h-6 w-6" />
          <div>
            <h3 className="font-bold">Stay tuned!</h3>
            <div className="text-sm">We are developing a dashboard to help you makes sense of your investments.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletData;
