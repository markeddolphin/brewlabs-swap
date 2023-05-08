import { ReactNode } from "react";
import Container from "./Container";

// TIP: If you want words to be highlighted use JSX in the prop
// and wrap the word in <mark> tags
const PageHeader = ({ title, summary, children }: PageHeaderProps) => (
  <section>
    <Container className="pt-20 pb-16">
      <header className="max-w-md font-brand sm:pr-0">
        <h1 className="text-3xl text-slate-700 dark:text-slate-400 sm:text-4xl">{title}</h1>
        {summary && <p className="mt-4 text-slate-800">{summary}</p>}
      </header>
      {children}
    </Container>
  </section>
);

type PageHeaderProps = {
  children?: ReactNode;
  title: string | ReactNode;
  summary?: string | ReactNode;
};

export default PageHeader;
