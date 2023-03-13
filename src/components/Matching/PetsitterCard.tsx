import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
interface PetSitterCardProps {
  name: string;
  typeTagText: string;
  typeTagColor: string;
  username: string;
  address: string | null;
  startPrice: number | null;
  endPrice: number | null;
  petTypes: string[];
  profileImageUri: string | null;
  avgRating: number | null;
  reviewCount: number;
}

const PetsitterCard: React.FunctionComponent<PetSitterCardProps> = ({
  name,
  typeTagText,
  typeTagColor,
  username,
  address,
  startPrice,
  endPrice,
  petTypes,
  profileImageUri,
  avgRating,
  reviewCount,
}) => {
  // sanitize the props
  if (address == null) address = "this sitter location is a mystery";
  if (startPrice == null) startPrice = 0;
  if (endPrice == null) endPrice = 10000000; // FIXME: fix this hardcoding
  if (profileImageUri == null) profileImageUri = "/profiledummy.png";

  // convert price range to logos
  const getPriceLogo = (price: number): string => {
    if (price < 500) return "฿";
    if (price < 1000) return "฿฿";
    if (price < 5000) return "฿฿฿";
    return "฿฿฿฿";
  };
  const startPriceSign = getPriceLogo(startPrice);
  const endPriceSign = getPriceLogo(endPrice);

  const profile_link = "/user/" + username + "/profile";
  const booking_link = "/user/" + username + "/booking";

  // handle Review Display
  const getReviewStatus = (review: number | null): string => {
    if (review == null) return "No Reviews";
    if (review >= 4) return "Very Positive";
    if (review >= 2) return "Mixed";
    return "Bad";
  };

  const reviewColors: { [key: string]: string } = {
    "Very Positive": "#1F61A4",
    Mixed: "#B19B4B",
    Bad: "#A7233B",
    "No Reviews": "#8e8e8e",
  };

  const router = useRouter();

  return (
    <Link href={profile_link}>
      <div
        id="card"
        className="relative flex h-[189px] animate-showing flex-row border border-t-[#ecececc2] border-l-[#ecececc2] border-b-[#cbcbcbc2] border-r-[#cbcbcbc2] bg-[#f6f6f6] opacity-0 shadow-xl drop-shadow-sm transition-all duration-150 hover:border-[1.5px] hover:border-[#2094D6] hover:bg-[#eeeeee] max-md:h-[115px] max-md:drop-shadow-md md:hover:scale-[1.01]"
      >
        <div
          className="absolute -left-4 top-3 z-10 px-2 py-1 text-xs font-bold text-white max-md:py-0.5 max-md:text-[10px]"
          style={{ backgroundColor: typeTagColor }}
        >
          {typeTagText}
        </div>
        <div
          id="profile-image-part"
          className="w-[168px] p-[10.5px] max-md:w-[111px]"
        >
          <div className="relative h-full w-full">
            <Image
              alt="Pet Sitter Profile Picture"
              src={profileImageUri}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div
          id="center-part"
          className="flex grow flex-col justify-center pl-[19px] max-md:pl-0 max-md:pr-2"
        >
          {/* desktop */}
          <div className="max-md:hidden">
            <div className="mb-2 flex flex-col">
              <div>
                <span className="mr-2 text-[27px] font-semibold text-[#213951] hover:underline">
                  {name}
                </span>
                <span className="text-[20px] font-normal text-[#bfbfbf]">
                  {`${startPriceSign}-${endPriceSign}`}
                </span>
              </div>
              <div className="text-[14px] font-semibold text-[#8E8E8E]">
                Laem Thong Rd, Thung Sukhla, Si Racha, Chon Buri 20110
              </div>
            </div>
            <div className="flex flex-row gap-2">
              {petTypes.map((petType) => (
                <div
                  key={petType}
                  className="rounded-md border bg-[#a3a3a3] px-3 text-[14px] text-white shadow-sm"
                >
                  {petType}
                </div>
              ))}
            </div>
          </div>
          {/* end of desktop */}

          {/* mobile */}
          <div className="flex flex-col border-b-2 pb-2 pt-3 md:hidden">
            <div className="text-[14px] font-medium leading-3 text-[#213951]">
              Flash Coffee - Bangkok
            </div>
            <div className="flex flex-row justify-end">
              <div className="flex grow flex-col  gap-2">
                <div className="text-[10px] font-normal text-[#8e8e8e]">
                  Pattaya, Chonburi
                </div>

                <div className="flex flex-row gap-1 ">
                  <div className="rounded-md bg-[#a3a3a3] px-2 text-[10px] font-normal text-white">
                    Hippopotamus
                  </div>
                  <div className="rounded-md bg-[#a3a3a3] px-2 text-[10px] font-normal text-white">
                    ...
                  </div>
                </div>
              </div>
              <div className=" flex flex-col justify-end">
                <p className="text-[16px] font-normal text-[#bfbfbf]">฿฿฿฿</p>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-0.5 pt-1 md:hidden">
            <p className="text-[10px] font-normal text-[#8e8e8e]">No Reviews</p>
            <p className="text-[10px] font-normal text-[#8e8e8e]">(0)</p>
          </div>
          {/* end of mobile */}
        </div>

        <div
          id="book-and-review-part"
          className="ml-10 w-[168px] pr-[18px] max-md:hidden"
        >
          <div className="flex h-full flex-col justify-center gap-1">
            <div className="text-[18px] font-normal">
              {/* TODO: add link to review page*/}
              <span
                className="mr-1 hover:underline"
                style={{ color: reviewColors[getReviewStatus(avgRating)] }}
              >
                {getReviewStatus(avgRating)}
              </span>
              <span className="font-light text-[#8e8e8e]">({reviewCount})</span>
            </div>
            <button
              className="font-mono text-[30px]"
              onClick={() => router.push(booking_link)}
            >
              <div className="w-[119px] bg-[#2a4764] py-1 text-center text-white duration-150 hover:bg-[#213951]">
                Book
              </div>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PetsitterCard;
