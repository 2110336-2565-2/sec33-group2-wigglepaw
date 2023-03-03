export const SessionmediumCard = ({ data }) => {
  return (
    <div>
      <div
        style={{ backgroundColor: data.color.toString() }}
        className="center-thing border-l-5 absolute top-0 right-[-0.5rem] h-7 skew-x-[30deg] bg-black  px-5 text-black shadow-xl"
      >
        <div className="-skew-x-[30deg] text-xs">{data.title}</div>
      </div>
      <div className="px-5">
        <div className="">
          <div className="text-lg font-bold text-[#505050]">Session Id:</div>
          <div className=" text-[#7b7b7b]">&nbsp;CsxS32JS&sasSdwWW02C </div>
        </div>
        <div className="py-5">
          <div className="text-lg font-bold text-[#505050]">Start Time:</div>
          <div className=" text-[#7b7b7b]">&nbsp;{data.start} </div>
        </div>
      </div>
    </div>
  );
};
export default SessionmediumCard;
