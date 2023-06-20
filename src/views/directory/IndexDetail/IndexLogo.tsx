import TokenLogo from "@components/logo/TokenLogo";
import getTokenLogoURL from "utils/getTokenLogoURL";

const IndexLogo = ({ tokens, type = "default" }) => {
  if (type === "line") {
    return (
      <div className="flex w-fit items-center">
        {tokens.map((data, i) => (
          <TokenLogo key={i} src={getTokenLogoURL(data.address, data.chainId, data.logo)} classNames="-ml-2 w-6" />
        ))}
      </div>
    );
  } else
    switch (tokens.length) {
      case 2:
        return (
          <div className="mt-4 flex w-fit items-center md:w-[160px]">
            <TokenLogo
              src={getTokenLogoURL(tokens[0].address, tokens[0].chainId, tokens[0].logo)}
              classNames="w-[70px]"
              large
            />
            <TokenLogo
              src={getTokenLogoURL(tokens[1].address, tokens[1].chainId, tokens[1].logo)}
              classNames="-ml-3 w-[70px]"
              large
            />
          </div>
        );
      case 3:
        return (
          <div className="mt-4 w-fit items-center md:w-[160px]">
            <div className="flex justify-center">
              <TokenLogo
                src={getTokenLogoURL(tokens[0].address, tokens[0].chainId, tokens[0].logo)}
                classNames="w-[60px]"
                large
              />
              <TokenLogo
                src={getTokenLogoURL(tokens[1].address, tokens[1].chainId, tokens[1].logo)}
                classNames="-ml-3 w-[60px]"
                large
              />
            </div>
            <div className="-mt-3">
              <TokenLogo
                src={getTokenLogoURL(tokens[2].address, tokens[2].chainId, tokens[2].logo)}
                classNames="m-auto w-[60px]"
                large
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="mt-4 w-fit items-center md:w-[160px]">
            <div className="flex justify-center">
              <TokenLogo
                src={getTokenLogoURL(tokens[0].address, tokens[0].chainId, tokens[0].logo)}
                classNames="w-[60px]"
                large
              />
              <TokenLogo
                src={getTokenLogoURL(tokens[1].address, tokens[1].chainId, tokens[1].logo)}
                classNames="-ml-3 w-[60px]"
                large
              />
            </div>
            <div className="-mt-3 flex justify-center">
              <TokenLogo
                src={getTokenLogoURL(tokens[2].address, tokens[2].chainId, tokens[2].logo)}
                classNames="w-[60px]"
                large
              />
              <TokenLogo
                src={getTokenLogoURL(tokens[3].address, tokens[3].chainId, tokens[3].logo)}
                classNames="-ml-3 w-[60px]"
                large
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="mt-4 w-fit items-center md:w-[160px]">
            <div className="flex justify-center">
              <TokenLogo
                src={getTokenLogoURL(tokens[0].address, tokens[0].chainId, tokens[0].logo)}
                classNames="w-[60px]"
                large
              />
              <TokenLogo
                src={getTokenLogoURL(tokens[1].address, tokens[1].chainId, tokens[1].logo)}
                classNames="-ml-3 w-[60px]"
                large
              />
              <TokenLogo
                src={getTokenLogoURL(tokens[2].address, tokens[2].chainId, tokens[2].logo)}
                classNames="-ml-3 w-[60px]"
                large
              />
            </div>
            <div className="-mt-3 flex justify-center">
              <TokenLogo
                src={getTokenLogoURL(tokens[3].address, tokens[3].chainId, tokens[3].logo)}
                classNames="w-[60px]"
                large
              />
              <TokenLogo
                src={getTokenLogoURL(tokens[4].address, tokens[4].chainId, tokens[4].logo)}
                classNames="-ml-3 w-[60px]"
                large
              />
            </div>
          </div>
        );
      default:
        return <></>;
    }
};

export default IndexLogo;
