import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>FCT App Docs</span>,
  project: {
    link: 'https://github.com/cacic-fct/fct-app',
  },
  docsRepositoryBase: 'https://github.com/cacic-fct/fct-app/tree/main/docs',
  editLink: {
    text: 'Edite esta página no GitHub'
  },
  feedback: {
    content: null,
  },
  toc: {
    title: 'Conteúdo',
  },
  search: {
    emptyResult: 'Nenhum resultado encontrado',
    loading: 'Carregando…',
    placeholder: 'Pesquisar…',
    error: 'Erro ao buscar resultados',
    },
   footer: {
    text: 'FCT App Docs',
   },

   themeSwitch: {
    useOptions() {
      return {
        light: 'Claro',
        dark: 'Escuro',
        system: 'Automático'
      }
   }
  }
}


export default config
