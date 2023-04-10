import Image from "next/image";
import Link from "next/link";
import type { FunctionComponent } from "react";
import Header from "../../components/Header";
import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "../../server/auth";

const HelpCenter = () => {
  return (
    <div className="min-h-screen">
      <Header></Header>
      <div id="" className="my-10 flex flex-col items-center">
        <div className="w-[85vw] max-w-4xl">
          <h1 className="text-[50px] font-extrabold text-[#173554]">
            Help Center
          </h1>

          <p className="mb-6 text-[#6f768c]">
            Unhappy about something ? You&apos;ve come to the right place
          </p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <HelpMenuCard
              linkURL={"/help/reports/new"}
              iconUrl={"/help_pencil.png"}
              bgColor={"rgb(142, 108, 240)"}
              borderColor={"#5b21b6"}
              headerText={"New Report"}
              subText={[
                "Found something off ?",
                "Submit a new problem report to our admins, we'll get back to you in less than a week",
              ]}
            />
            <HelpMenuCard
              linkURL={"/help/reports"}
              iconUrl={"/help_barchart.png"}
              bgColor={"#D95BD1"}
              borderColor={"#c026d3"}
              headerText={"View My Reports"}
              subText={[
                "So you’ve submitted a report earlier ?",
                "Now it’s time to see how our admins response to you. Make sure to read them la.",
              ]}
            />
            <HelpMenuCard
              linkURL={"/help/contactAdmin"}
              iconUrl={"/help_people.png"}
              bgColor={"#F07F6C"}
              borderColor={"#ea580c"}
              headerText={"Contact Admin"}
              subText={[
                "I don’t know what this feature does.",
                "But let’s keep it here for now. Tell us if you know something we don’t.",
              ]}
            />
            <HelpMenuCard
              linkURL={"/help/faq"}
              iconUrl={"/help_book.png"}
              bgColor={"#eab308"}
              borderColor={"#a16207"}
              headerText={"FAQ"}
              subText={[
                "Browse through the answers to some frequently asked questions.",
                "Currently, we have zero users and zero questions though.",
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface HelpMenuCardProps {
  iconUrl: string;
  bgColor: string;
  headerText: string;
  subText: string[];
  linkURL: string;
  borderColor: string;
}

const HelpMenuCard: FunctionComponent<HelpMenuCardProps> = ({
  iconUrl,
  bgColor,
  headerText,
  subText,
  linkURL,
  borderColor,
}) => {
  return (
    <Link
      className="flex h-min min-h-[13rem] flex-col rounded-lg border-red-500 p-5 text-white opacity-90 duration-100 hover:scale-[1.01] hover:opacity-100 hover:shadow-lg hover:shadow-slate-400"
      style={{
        background: bgColor,

        borderStyle: "solid",
        borderColor: borderColor,
        borderWidth: "2px",
      }}
      href={linkURL}
    >
      <div id="" className="mb-2 flex justify-between">
        <p className="text-xl font-bold drop-shadow-lg md:text-3xl">
          {headerText}
        </p>
        <Image src={iconUrl} width={45} height={45} alt={iconUrl}></Image>
      </div>

      <div id="" className="my-4 flex flex-col gap-2 text-[1rem] font-light">
        {subText.map((text, idx) => (
          <p key={idx}>{text}</p>
        ))}
      </div>
    </Link>
  );
};

export default HelpCenter;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  console.log("in server side props woiiii");

  if (!session || !session.user) {
    console.log("redirecting wooooooiiii");

    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  console.log("normally render pagee no redirect woiii");

  return {
    props: { session }, // prefetched session on the serverside, no loading on the front
  };
};
