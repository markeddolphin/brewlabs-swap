import styled from "styled-components";

type HambugerProps = {
  open: boolean;
  onClick: () => void;
  className?: string;
};

const Hambuger = ({ open, onClick, className }: HambugerProps) => {
  return (
    <HambugerButton className={className} open={open} onClick={onClick}>
      <span></span>
      <span></span>
      <span></span>
    </HambugerButton>
  );
};

const HambugerButton = styled.div<{ open: boolean }>`
  position: relative;
  > span {
    position: absolute;
    display: block;
    width: 20px;
    height: 1px;
    margin-bottom: 6.5px;
    position: relative;

    background: rgb(238, 187, 25);

    z-index: 1;

    transform-origin: 4px 0px;

    transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1), background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
      opacity 0.55s ease;

    opacity: 1;

    :nth-child(1) {
      opacity: ${({ open }) => (open ? 0 : 1)};
      transform: ${({ open }) => (open ? "rotate(0deg) scale(0.2, 0.2)" : "none")};
    }
    :nth-child(2) {
      transform-origin: 0% 0%;
      transform: ${({ open }) => (open ? "translate(0px, 8px) rotate(-45deg)" : "none")};
    }
    :nth-child(3) {
      transform-origin: 0% 100%;
      transform: ${({ open }) => (open ? "translate(0px, -13px) rotate(45deg)" : "none")};
    }
  }
`;

export default Hambuger;
