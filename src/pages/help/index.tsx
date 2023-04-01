import Image from "next/image";
import Link from "next/link";
import type { FunctionComponent } from "react";
import Header from "../../components/Header";

const HelpCenter = () => {
  return (
    <>
      <Header></Header>
      <div id="" className="my-10 flex flex-col items-center">
        <div className="w-[85vw] max-w-4xl">
          <h1 className="text-[50px] font-extrabold text-[#173554]">
            Help Center
          </h1>
          <p className="mb-6 text-[#6f768c]">
            Unhappy about something ? You&apos;ve come to the right place
          </p>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <HelpMenuCard
              linkURL={"/help/reports/new"}
              iconUrl={"/help_pencil.png"}
              bgColor={"#8E6CF0"}
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
              headerText={"Contact Admin"}
              subText={[
                "I don’t know what this feature does.",
                "But let’s keep it here for now. Tell us if you know something we don’t.",
              ]}
            />
            <HelpMenuCard
              linkURL={"/help/faq"}
              iconUrl={"/help_book.png"}
              bgColor={"#DEA44D"}
              headerText={"FAQ"}
              subText={[
                "Browse through the answers to some frequently asked questions.",
                "Currently, we have zero users and zero questions though.",
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

interface HelpMenuCardProps {
  iconUrl: string;
  bgColor: string;
  headerText: string;
  subText: string[];
  linkURL: string;
}

const HelpMenuCard: FunctionComponent<HelpMenuCardProps> = ({
  iconUrl,
  bgColor,
  headerText,
  subText,
  linkURL,
}) => {
  return (
    <Link
      className="flex h-56 flex-col rounded-lg p-5 text-white duration-100 hover:shadow-lg hover:shadow-slate-400"
      style={{ background: bgColor }}
      href={linkURL}
    >
      <div id="" className="flex justify-between">
        <p className="text-3xl font-bold drop-shadow-lg">{headerText}</p>
        <Image src={iconUrl} width={45} height={45} alt={iconUrl}></Image>
      </div>

      <div
        id=""
        className="mt-10 mb-2 flex flex-col gap-2 text-[16px] font-light"
      >
        {subText.map((text, idx) => (
          <p key={idx}>{text}</p>
        ))}
      </div>
    </Link>
  );
};

export default HelpCenter;
