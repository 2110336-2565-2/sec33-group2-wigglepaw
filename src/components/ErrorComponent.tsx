import Header from "./Header";

const ErrorComponent = (data: any) => {
  return (
    <div>
      <Header></Header>
      <div className="mx-auto h-[80vh] w-[100vw] pt-[20%] text-center">
        <b className="text-2xl">Error {data.message}</b>
      </div>
    </div>
  );
};

export default ErrorComponent;
