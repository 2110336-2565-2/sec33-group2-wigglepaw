import Header from "../Header";

const PetOwnerProfile = (props: any) => {
  return (
    <div>
      <Header></Header>
      {props.username}
    </div>
  );
};

export default PetOwnerProfile;
