import { Button } from "@/components/Button";
import { Center } from "@/components/Center";
import { TopBar } from "@/components/TopBar";
import { Typography } from "@/components/Typography";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import variables from "@/styles/variables.module.scss";

export default function Login() {
  return (
    <>
      <TopBar backButton title="FCT App" />
      <Center>
        <Typography type="display" color="lightContrast">Entrar</Typography>
        <Typography center type="body" color="lightContrast">Se você possui vínculo com a Unesp, utilize o seu e‑mail institucional</Typography>
        <Button style={{marginTop: '32px'}} iconLeft={ FcGoogle } variant="outlined">Entrar com o Google</Button>
      </Center>
      <Link style={{paddingBottom: "16px"}} href={'/privacy'}>
        <Typography color="primary" type="link" center>
          Políticas de Privacidade
        </Typography>
      </Link>
    </>
  )
}