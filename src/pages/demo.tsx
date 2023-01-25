import * as React from 'react';
import { useState } from 'react';
import type { NextPage } from 'next'
import { api } from '../utils/api'
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PetKind } from '@prisma/client';

const DemoPage: NextPage = () => {

  const [n, setN] = useState(0);
  const fibo = api.example.fibo.useQuery({n}, {retry: false});

  return <div className='flex flex-col gap-2'>
    <section className="flex items-center justify-between">
      <h2>A tour into the abssyal space</h2>
      <h3>Traverse into the depth of valley</h3>
    </section>

    <hr className="border-t-2 border-gray-200"/>

  <section>
    <h2 className='font-bold underline decoration-2'>Here is the fibonacci of {n}</h2>
    {fibo.isLoading && <p>Loading...</p>}
    {fibo.isError && <p>Error: {fibo.error.message}</p>}
    <p>The fibonacci of <input type="number" value={n} onChange={ele => setN(ele.target.valueAsNumber)}></input> is {fibo.data}</p>
  </section> 
  
    <hr className="border-t-2 border-gray-200"/>

    <section>
      <h2 className='font-bold underline decoration-2'>Here is all the pet</h2>
      <PetList />
    </section>

    <hr className="border-t-2 border-gray-200"/>

    <section>
    <h2 className='font-bold underline decoration-2'>{"Let's add a pet"}</h2>
    <PetShow />
    </section>

  </div>
}

const PetList: React.FC = () => {
  const pets = api.pet.getAllPet.useQuery()

  if (pets.isLoading) {
    return <p>Loading...</p>
  }

  if (pets.isError) {
    return <p className='text-red-400'>Error: {pets.error.message}</p>
  }

  return <div className="flex flex-col items-center">
    <h1 className="text-3xl font-bold mb-8">Pets</h1>
    <table className="table-auto border-collapse border border-gray-400">
      <thead>
        <tr className="bg-gray-400">
          <th className="border border-gray-400 px-4">Name</th>
          <th className="border border-gray-400 px-4">Kind</th>
          <th className="border border-gray-400 px-4">Owner Id</th>
          <th className="border border-gray-400 px-4">Owner Name</th>
          <th className="border border-gray-400 px-4">Owner Email</th>
        </tr>
      </thead>
      <tbody>
        {pets.data?.map(pet => <tr key={pet.id} className="bg-gray-200">
          <td className="border border-gray-400 px-4">{pet.name}</td>
          <td className="border border-gray-400 px-4">{pet.kind}</td>
          <td className="border border-gray-400 px-4">{pet.owner.id}</td>
          <td className="border border-gray-400 px-4">{pet.owner.name}</td>
          <td className="border border-gray-400 px-4">{pet.owner.email}</td>
        </tr>)}
      </tbody>
    </table>
  </div>
}

const PetShow: React.FC = () => {

  type FormData = {name: string, kind: PetKind, ownerId: string};

  const {register, handleSubmit, formState: {errors}} = useForm<FormData>({
    resolver: zodResolver( z.object({
      name: z.string().min(1),
      kind: z.nativeEnum(PetKind),
      ownerId: z.string().min(1),
    }))
  });

  const utils = api.useContext();
  const addPet = api.pet.addPet.useMutation({
    async onSettled() {
        // Invalidate the get all pet query once the mutation is done
        await utils.pet.getAllPet.invalidate();
    }
  });
  const owners = api.pet.getAllOwner.useQuery();

  const onSubmit = (data: FormData) => {
    console.log(data);
    addPet.mutate(data);
  }

  // Form laydown the input vertically using tailwind
  return <div className="flex flex-col gap-2">
  <label htmlFor="name">Pet name</label>
  <input className="border-blue-400 bg-blue-100" type="text" id="name" {...register("name", {required: true})} />
  <p className='text-red-400'>{errors.name?.message}</p>

  <label htmlFor="kind">Pet type</label>
  <select id="kind" {...register("kind", {required: true })}>
    <option value="DOGGO">Doggo</option>
    <option value="NEKO">Neko</option>
  </select>
  <p className='text-red-400'>{errors.kind?.message}</p>

  <label htmlFor="ownerId">Owner id</label>
  <select id="ownerId" {...register("ownerId", {required: true})}>
    {owners.data?.map(owner => <option key={owner.id} value={owner.id}>{owner.name}</option>)}
  </select>
  <p className='text-red-400'>{errors.ownerId?.message}</p>


  <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" type="submit">Add pet</button>
</div>;
}

export default DemoPage