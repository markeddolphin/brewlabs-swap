import PageHeader from "components/layout/PageHeader";
import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import WordHighlight from "components/text/WordHighlight";
import { useState } from "react";
import PairList from "./PairList";

export default function Info() {
  const [criteria, setCriteria] = useState("");
  return (
    <PageWrapper>
      <PageHeader
        title={
          <>
            Exchange tokens at the <WordHighlight content="best" /> rate on the market.
          </>
        }
      />
      <Container>
        <input
          type={"text"}
          placeholder="Search pair, token, symbol..."
          className="primary-shadow leading-1.2 focusShadow w-full rounded border-none bg-[#29292C] p-2.5 font-roboto text-sm font-bold text-white"
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
        />
        <div className="mt-5 mb-10">
          <PairList />
        </div>
      </Container>
    </PageWrapper>
  );
}
