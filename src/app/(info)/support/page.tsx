"use client"
import { BaseIcon } from "@/components/BaseIcon";
import { Card } from "@/components/Card";
import { MenuItens } from "@/components/MenuItens";
import { Panel } from "@/components/Panel";
import { TopBar } from "@/components/TopBar";
import { Typography } from "@/components/Typography";
import { IoBanOutline, IoBookOutline, IoCodeOutline, IoHammerOutline, IoReloadOutline, IoWarningOutline } from "react-icons/io5";

import styles from './Support.module.scss'

export default function Support() {
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
        <div className={styles.warning}>
          <BaseIcon size={18} IconComponent={IoWarningOutline} fill='danger' />
          <Typography color="danger" type="button">Somente utilize estas opções se souber o que está fazendo!</Typography>
        </div>
        <Card className={styles.warningOption} onClick={() => alert("você explodiu amigo")}>
          <BaseIcon size={18} IconComponent={IoReloadOutline} fill='darkTint' />
          <Typography type="body">Forçar atualizaçao do Service Worker</Typography>
        </Card>
        <Card className={styles.warningOption} onClick={() => alert("você explodiu amigo")}>
          <BaseIcon size={18} IconComponent={IoBanOutline} fill='darkTint' />
          <Typography type="body">Cancelar o serviço do Service Worker</  Typography>
        </Card>
      </Panel>
    </>
  )
}