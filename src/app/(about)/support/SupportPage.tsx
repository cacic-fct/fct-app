"use client"
import { BaseIcon } from "@/components/BaseIcon"
import { Card } from "@/components/Card"
import { MenuItens } from "@/components/MenuItens"
import { Panel } from "@/components/Panel"
import { TopBar } from "@/components/TopBar"
import { Typography } from "@/components/Typography"

import { IoBanOutline, 
  IoBookOutline, 
  IoCodeOutline, 
  IoHammerOutline, 
  IoReloadOutline, 
  IoWarningOutline 
} from "react-icons/io5"


export const SupportPage = () => {
  return (
    <>
      <TopBar backButton title="Suporte" />
      <MenuItens fullWidth itens={[
        {
          icon: IoBookOutline,
          link: "https://github.com/cacic-fct/fct-app/wiki",
          title: "Wiki"
        },
        {
          icon: IoCodeOutline,
          link: "mailto:cacic.fct@gmail.com",
          title: "Entre em contato com os desenvolvedores"
        },
      ]} />
      <Panel title="Opções avançadas" icon={IoHammerOutline}>
        <div style={{display: 'flex', gap: '8px'}}>
          <BaseIcon size={18} IconComponent={IoWarningOutline} fill='danger' />
          <Typography color="danger" type="button">Somente utilize estas opções se souber o que está fazendo!</Typography>
        </div>
        <Card variant="warning" onClick={() => alert("você explodiu amigo")}>
          <BaseIcon size={18} IconComponent={IoReloadOutline} fill='darkTint' />
          <Typography type="body">Forçar atualizaçao do Service Worker</Typography>
        </Card>
        <Card variant="warning" onClick={() => alert("você explodiu amigo")}>
          <BaseIcon size={18} IconComponent={IoBanOutline} fill='darkTint' />
          <Typography type="body">Cancelar o serviço do Service Worker</  Typography>
        </Card>
      </Panel>
    </>
  )
}