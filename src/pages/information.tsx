import AdminSideTab from "../components/AdminSideTab";
import Header from "../components/Header";

export default function info() {
  return (
    <div className="min-h-screen">
      <Header></Header>
      <div className="flex min-h-[90vh]">
        <AdminSideTab></AdminSideTab>GOOMBA
      </div>
    </div>
  );
}
