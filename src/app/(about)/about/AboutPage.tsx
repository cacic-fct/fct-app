import React from "react"
import Link from "next/link"

import { Typography } from "@/components/Typography"
import { TopBar } from "@/components/TopBar"
import { APP_NAME, APP_VERSION } from "@/constants/app"

import styles from "./About.module.scss"

export const AboutPage = () => {
  return (
    <>
      <TopBar backButton title="Sobre este app" />
      <div className={styles.wrapper}>
        <Typography type="subtitle">{APP_NAME}</Typography>
        <Typography type="subtitle">{'Versão: ' + APP_VERSION}</Typography>
        <br></br>
        <Typography center type="body">
          Copyright (c) {new Date().getFullYear()} CACIC - Centro Acadêmico de Ciência da Computação "Alan Turing" da Faculdade de Ciências e Tecnologia, Câmpus de Presidente Prudente, Universidade Estadual Paulista "Júlio de Mesquita Filho"
        </Typography>
        <br></br>
        <Typography center type="body">
          Este aplicativo web é uma realização dos seus <Link target="_blank" href="https://github.com/cacic-fct/fct-app/graphs/contributors" >contribuidores</Link> e do Centro Acadêmico de Ciência da Computação (CACiC) – Chapa Margaret Hamilton (2021 – 2023).
        </Typography>
        <br></br>
        <br></br>
        <ul>
          <li>
            <Link target="_blank" href="https://github.com/cacic-fct/fct-app">Código-fonte</Link>
          </li>
          <li>
            <Link href="/privacy">Política de privacidade</Link>
          </li>
          <li>
            <Link href="/license">Licenças</Link>
          </li>
          <li>
            <Link href="/support">Suporte</Link>
          </li>
        </ul>
      </div>
    </>
  )
}