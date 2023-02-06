import Header from "./Header";

const FreelancePetSitterProfile = (props: any) => {
  return (
    <div>
      <Header></Header>
      {props.username}
    </div>
  );
};

export default FreelancePetSitterProfile;
