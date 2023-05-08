import { PAGE_SUPPORTED_CHAINS } from "config/constants/networks";
import Bridge from "views/bridge";

const BridgePage = () => <Bridge />;

BridgePage.chains = PAGE_SUPPORTED_CHAINS["bridge"];

export default BridgePage;
