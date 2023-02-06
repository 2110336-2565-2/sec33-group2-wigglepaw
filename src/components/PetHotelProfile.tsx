import Header from "./Header";

const PetHotelProfile = (props: any) => {
  return (
    <div>
      <Header></Header>
      {props.username}
    </div>
  );
};

export default PetHotelProfile;
