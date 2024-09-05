import dynamic from 'next/dynamic';
import CallToAction from './_components/call-to-action';
import DashboardSnippet from './_components/dashboard-snippet';

const Pricing = dynamic(
  () => import('./_components/pricing').then((component) => component.default),
  { ssr: true }
);

const Home = () => {
  return (
    <main className="md:px-10 py-20 flex flex-col gap-36">
      <div className='gap-5'>
        <CallToAction />
        <DashboardSnippet />
      </div>
      <Pricing />
    </main>
  );
};

export default Home;
