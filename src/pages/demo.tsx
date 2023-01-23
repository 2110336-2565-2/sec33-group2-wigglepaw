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

    <section>
      <h2 className='font-bold underline decoration-2'>Here is the fibonacci of {n}</h2>
      {fibo.isLoading && <p>Loading...</p>}
      {fibo.isError && <p>Error: {fibo.error.message}</p>}
      <p>The fibonacci of <input type="number" value={n} onChange={ele => setN(ele.target.valueAsNumber)}></input> is {fibo.data}</p>
    </section> 
  
    <section>
      <h2 className='font-bold underline decoration-2'>Here is all the pet</h2>
      <PetList />
    </section>

    <section>
    <h2 className='font-bold underline decoration-2'>{"Let's add a pet"}</h2>
    <PetShow />
    </section>

  </div>
}

const PetList: React.FC = () => {
  const pets = api.pet.getAllPet.useQuery();

  return <div>
    {pets.isLoading && <p>Loading...</p>}
    {pets.isError && <p>Error: {pets.error.message}</p>}
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Kind</th>
          <th>Owner Id</th>
          <th>Owner Name</th>
          <th>Owner Email</th>
        </tr>
      </thead>
      <tbody>
        {pets.data?.map(pet => <tr key={pet.id}>
          <td className="px-4">{pet.name}</td>
          <td className="px-4">{pet.kind}</td>
          <td className="px-4">{pet.owner.id}</td>
          <td className="px-4">{pet.owner.name}</td>
          <td className="px-4">{pet.owner.email}</td>
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
  return <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
    {/*Pet name text input*/}
    <label htmlFor="name">Pet name</label>
    <input className="border-blue-400" type="text" id="name" {...register("name", {required: true})} />
    <p className='text-red-400'>{errors.name?.message}</p>

    {/*Pet type select: doggo or neko*/}
    <label htmlFor="kind">Pet type</label>
    <select id="kind" {...register("kind", {required: true})}>
      <option value="DOGGO">Doggo</option>
      <option value="NEKO">Neko</option>
    </select>
    <p className='text-red-400'>{errors.kind?.message}</p>

    {/*Owner id select, display owner's name to user, ow*/}
    <label htmlFor="ownerId">Owner id</label>
    <select id="ownerId" {...register("ownerId", {required: true})}>
      {owners.data?.map(owner => <option key={owner.id} value={owner.id}>{owner.name}</option>)}
    </select>
    <p className='text-red-400'>{errors.ownerId?.message}</p>

    {/*Sumit button*/}
    <input type="submit" />

  </form>;
}

export default DemoPage