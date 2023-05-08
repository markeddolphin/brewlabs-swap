import Container from "@components/layout/Container";
import CardVideo from "@components/cards/CardVideo";

const VideoSection = () => (
  <section className="bg-gradient-to-b from-zinc-800 to-zinc-900 pb-16 pt-44">
    <Container>
      <div className="grid grid-cols-4 gap-16">
        <div className="col-span-4 sm:mr-24 md:col-span-2">
          <h2 className="font-brand text-lg font-semibold leading-8 tracking-widest text-dark dark:text-brand">
            Smart tech for smart people
          </h2>
          <p className="mt-2 font-brand text-4xl font-bold tracking-widest text-gray-900">Investment suite</p>

          <p className="mt-4 dark:text-gray-300">
            All of our staking and farming contracts are audited by a third party vendor, Certik. Safety and security
            are our priority.
          </p>

          <p className="mt-2 dark:text-gray-300">
            Staking is a great way to earn passive income or if you are the contract owner it&apos;s a great way to
            reward your community.
          </p>

          <a className="btn-primary btn-sm btn mt-4" href="https://skynet.certik.com/projects/brewlabs" target="_blank">
            <img src="./images/certik-logo.svg" alt="certik logo" className="mr-4 h-6 w-6" /> View our Certik audit
          </a>
        </div>
        <div className="col-span-4 max-w-md md:col-span-2">
          <CardVideo cardId="1" youtubeId="ZJgpQ9EpVvo" />
        </div>
      </div>
    </Container>
  </section>
);

export default VideoSection;
