import Header from "../components/Header";
import Helpcenter from "../components/Helpcenter";

const Help = () => {
  return (
    <div className="min-h-screen">
      <Header></Header>
      <div className="flex min-h-[90vh]">
        <Helpcenter></Helpcenter>help page
      </div>
    </div>
  );
};

export default Help;
