import type { NextPage } from "next";

import Footer from "@components/layout/Footer";

import PageWrapper from "@components/layout/PageWrapper";
import PageHero from "@components/layout/PageHero";
import FeaturePlug from "@components/FeaturePlug";
import VideoSection from "@components/VideoSection";

const Home: NextPage = () => (
  <PageWrapper>
    <PageHero />

    <main className="min-h-screen">
      <VideoSection />

      <FeaturePlug />
    </main>

    <Footer />
  </PageWrapper>
);

export default Home;
