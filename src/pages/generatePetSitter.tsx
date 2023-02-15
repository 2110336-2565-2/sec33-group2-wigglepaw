import * as React from "react";
import type { NextPage } from "next";
import { api } from "../utils/api";

const GeneratePetSitterPage: NextPage = () => {
  const c = api.user.getByUsername.useQuery({ username: "covercorp" });
  const h = api.petHotel.create.useMutation();
  const f = api.freelancePetSitter.create.useMutation();
  const func = async () => {
    if (c.data != null) return;

    await h.mutateAsync({
      user: {
        username: "covercorp",
        imageUri:
          "https://i.ppy.sh/547c489981845883d37a525d50d892d8c3d490e0/68747470733a2f2f692e696d6775722e636f6d2f5430586455414e2e6a7067",
        password: "password",
        email: "covercorp@email.com",
      },
      petSitter: {
        petTypes: ["cat", "dog", "rabbit"],
        startPrice: 10,
        endPrice: 1000,
        verifyStatus: true,
      },
      petHotel: { hotelName: "cover corp" },
    });

    await f.mutateAsync({
      user: {
        username: "Coco",
        imageUri:
          "https://p4.wallpaperbetter.com/wallpaper/771/366/387/anime-anime-girls-hololive-kiryu-coco-redhead-hd-wallpaper-preview.jpg",
        password: "password",
        email: "Coco@email.com",
      },
      petSitter: {
        petTypes: ["cat", "dog"],
        startPrice: 69,
        endPrice: 420,
        verifyStatus: true,
      },
      freelancePetSitter: { firstName: "Kiryu", lastName: "Coco" },
    });

    await h.mutateAsync({
      user: {
        username: "takodachi",
        imageUri: "https://img-9gag-fun.9cache.com/photo/aZrDB5Q_460s.jpg",
        password: "password",
        email: "takodachi@email.com",
      },
      petSitter: {
        petTypes: ["octopus", "cat"],
        startPrice: 10,
        endPrice: 100,
        verifyStatus: true,
      },
      petHotel: { hotelName: "takodachi" },
    });

    await h.mutateAsync({
      user: {
        username: "usadakensetsu",
        imageUri:
          "https://preview.redd.it/8p4t0a95ax161.jpg?auto=webp&s=9c9db601dfdf217647380cbffe44d7eaf0efa47b",
        password: "password",
        email: "usadakensetsu@email.com",
      },
      petSitter: {
        petTypes: ["cat", "chicken", "rabbit"],
        startPrice: 10,
        endPrice: 100,
        verifyStatus: true,
      },
      petHotel: { hotelName: "usada kensetsu" },
    });

    await f.mutateAsync({
      user: {
        username: "Rushia",
        imageUri:
          "https://gamerbraves.sgp1.cdn.digitaloceanspaces.com/2022/02/Rushia_FI2.jpg",
        password: "password",
        email: "Rushia@email.com",
      },
      petSitter: {
        petTypes: ["cat"],
        startPrice: 1,
        endPrice: 15,
        verifyStatus: true,
      },
      freelancePetSitter: { firstName: "Uruha", lastName: "Rushia" },
    });

    await f.mutateAsync({
      user: {
        username: "Koyori",
        imageUri:
          "https://hololive.hololivepro.com/wp-content/uploads/2022/06/%E5%8D%9A%E8%A1%A3%E3%81%93%E3%82%88%E3%82%8A_WAO_jk-1.png",
        password: "password",
        email: "Koyori@email.com",
      },
      petSitter: {
        petTypes: ["cat", "dog"],
        startPrice: 50,
        endPrice: 1000,
        verifyStatus: true,
      },
      freelancePetSitter: { firstName: "Hakui", lastName: "Koyori" },
    });

    await f.mutateAsync({
      user: {
        username: "Choco",
        imageUri:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGYXihhLktMheIVxxgkU3ouhnXf9F9wbxlhQ&usqp=CAU",
        password: "password",
        email: "Choco@email.com",
      },
      petSitter: {
        petTypes: ["cat", "dog"],
        startPrice: 100,
        endPrice: 1000,
        verifyStatus: true,
      },
      freelancePetSitter: { firstName: "Yuzuki", lastName: "Choco" },
    });

    await h.mutateAsync({
      user: {
        username: "thebigthree",
        imageUri:
          "https://cdn.donmai.us/original/98/83/98834cd37301a94a6a524d94f1ff5a88.jpg",
        password: "password",
        email: "thebigthree@email.com",
      },
      petSitter: {
        petTypes: ["cat", "dog"],
        startPrice: 1000,
        endPrice: 1000,
        verifyStatus: true,
      },
      petHotel: { hotelName: "the big three" },
    });

    await h.mutateAsync({
      user: {
        username: "holocouncil",
        imageUri:
          "https://static.wikia.nocookie.net/omniversal-battlefield/images/b/bd/Council.jpg/revision/latest?cb=20220420023638",
        password: "password",
        email: "holocouncil@email.com",
      },
      petSitter: {
        petTypes: ["cat", "dog", "rat", "Hamster"],
        startPrice: 10000,
        endPrice: 10000000,
        verifyStatus: true,
      },
      petHotel: { hotelName: "holo council" },
    });
  };
  return (
    <div onClick={func} className="flex flex-col gap-2">
      <button className="mx-auto mt-6 flex rounded-full bg-sky-900 px-4 py-2 text-base font-bold text-white transition-all hover:bg-sky-700">
        Inject Pet Sitter
      </button>
    </div>
  );
};
export default GeneratePetSitterPage;
