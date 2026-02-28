import {
  HomePageBackground,
  HeroCopy,
  SearchPreviewCard,
  HomePageFooter,
} from "@/components/home";

export default function Home() {
  return (
    <HomePageBackground>
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pt-20 pb-24 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:pt-28">
        <HeroCopy />
        <SearchPreviewCard />
      </main>
      <HomePageFooter />
    </HomePageBackground>
  );
}
