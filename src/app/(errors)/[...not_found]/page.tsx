"use client"
import { Button } from "@/components/Button";
import { Center } from "@/components/Center";
import Image from "next/image";
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return(
    <Center>
      <Image src="/assets/images/zoro.jpg" width={300} height={300} alt="lost image" />
      <Button onClick={() => { router.back()}}>Voltar</Button>
    </Center>
  );
}