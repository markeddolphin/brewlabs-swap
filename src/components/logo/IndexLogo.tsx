import getTokenLogoURL from "utils/getTokenLogoURL";
import TokenLogo from "./TokenLogo";

const IndexLogo = ({ tokens, type = "default", appId = undefined, classNames = "mr-3" }) => {
  if (type === "line") {
    return (
      <div className={`flex w-fit items-center ${classNames}`}>
        {tokens.map((data, i) => (
          <TokenLogo
            key={i}
            src={getTokenLogoURL(data.address, data.chainId, data.logo, appId)}
            classNames="w-7 -ml-2"
          />
        ))}
      </div>
    );
  }

  switch (tokens.length) {
    case 2:
      return (
        <div className={classNames}>
          <div className="flex">
            <TokenLogo
              src={getTokenLogoURL(tokens[0].address, tokens[0].chainId, tokens[0].logo, appId)}
              classNames="w-7"
            />
            <TokenLogo
              src={getTokenLogoURL(tokens[1].address, tokens[1].chainId, tokens[1].logo, appId)}
              classNames="-ml-3 w-7"
            />
          </div>
        </div>
      );
    case 3:
      return (
        <div className={classNames}>
          <div className="flex">
            <TokenLogo
              src={getTokenLogoURL(tokens[0].address, tokens[0].chainId, tokens[0].logo, appId)}
              classNames="w-6"
            />
            <TokenLogo
              src={getTokenLogoURL(tokens[1].address, tokens[1].chainId, tokens[1].logo, appId)}
              classNames="-ml-2 w-6"
            />
          </div>
          <div className="-mt-2">
            <TokenLogo
              src={getTokenLogoURL(tokens[2].address, tokens[2].chainId, tokens[2].logo, appId)}
              classNames="m-auto w-6"
            />
          </div>
        </div>
      );
    case 4:
      return (
        <div className={classNames}>
          <div className="flex">
            <TokenLogo
              src={getTokenLogoURL(tokens[0].address, tokens[0].chainId, tokens[0].logo, appId)}
              classNames="w-6"
            />
            <TokenLogo
              src={getTokenLogoURL(tokens[1].address, tokens[1].chainId, tokens[1].logo, appId)}
              classNames="-ml-2 w-6"
            />
          </div>
          <div className="-mt-2 flex">
            <TokenLogo
              src={getTokenLogoURL(tokens[2].address, tokens[2].chainId, tokens[2].logo, appId)}
              classNames="w-6"
            />
            <TokenLogo
              src={getTokenLogoURL(tokens[3].address, tokens[3].chainId, tokens[3].logo, appId)}
              classNames="-ml-2 w-6"
            />
          </div>
        </div>
      );
    case 5:
      return (
        <div className={classNames}>
          <div className="flex">
            <TokenLogo
              src={getTokenLogoURL(tokens[0].address, tokens[0].chainId, tokens[0].logo, appId)}
              classNames="w-6"
            />
            <TokenLogo
              src={getTokenLogoURL(tokens[1].address, tokens[1].chainId, tokens[1].logo, appId)}
              classNames="-ml-2 w-6"
            />
            <TokenLogo
              src={getTokenLogoURL(tokens[2].address, tokens[2].chainId, tokens[2].logo, appId)}
              classNames="-ml-2 w-6"
            />
          </div>
          <div className="-mt-2 flex justify-center">
            <TokenLogo
              src={getTokenLogoURL(tokens[3].address, tokens[3].chainId, tokens[3].logo, appId)}
              classNames="w-6"
            />
            <TokenLogo
              src={getTokenLogoURL(tokens[4].address, tokens[4].chainId, tokens[4].logo, appId)}
              classNames="-ml-2 w-6"
            />
          </div>
        </div>
      );
    default:
      return <></>;
  }
};

export default IndexLogo;
