import Header from "../components/Header";
import Helpcenter from "../components/Helpcenter";

export default function info() {
  return (
    <div className="min-h-screen">
      <Header></Header>
      <div className="flex min-h-[90vh]">
        <Helpcenter></Helpcenter>GOOMBA
      </div>
    </div>
  );
}
