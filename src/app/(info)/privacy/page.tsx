import { TopBar } from "@/components/TopBar";
import React from "react";
import { Typography } from "@/components/Typography";
import Link from "next/link";

import styles from './Privacy.module.scss'

export default function Privacy() {
  return (
   <>
    <TopBar title="Política de Privacidade" backButton />
    <div className={styles.wrapper}>
      <Typography type="body">
        A Política de Privacidade On-Line do site do
        <strong>FCT App</strong> (https://fct-pp.web.app) foi criada para respeitar a LGPD (
        <Link href="http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709.htm" target="_blank" rel="noopener">
          Lei Geral de Proteção de Dados
        </Link>
        ) e afirmar o nosso compromisso com a segurança e a privacidade das informações coletadas dos
        visitantes de nosso site. Esta política está sujeita a eventuais atualizações e
        recomendamos que ela seja consultada periodicamente. Você pode visitar nosso site sem precisar fornecer
        nenhuma informação pessoal. Mas, caso isso aconteça, esta política procura esclarecer
        como coletamos e tratamos seus dados pessoais.
      </Typography>
      <p><br /><br /></p>
      <Typography type="subtitle">Como tratamos os dados</Typography>
      <ol>
        <li>
          <Typography type="body">
            Qualquer informação fornecida pelos usuários será coletada e guardada de acordo com
            os padrões atuais de segurança e confiabilidade.
          </Typography>
        </li>
        <li>
           <Typography type="body">
            Utilizamos em nosso site o protocolo padrão HTTPS que garante que todas as informações
            coletadas dos usuários trafeguem de forma segura, utilizando processo de criptografia padrão da
            Internet. 
           </Typography>
        </li>
        <li>
           <Typography type="body">
            As informações pessoais que nos forem fornecidas serão coletadas por meios legais. Essa
            coleta terá o propósito de comunicação comercial para que possamos vender nossos
            serviços, produtos, prestar suporte a atendimento sobre eles. Eventualmente, estes dados podem ser
            utilizados para fins acadêmicos, técnicos ou de pesquisa.
           </Typography>
        </li>
        <li>
           <Typography type="body">
            A menos que tenhamos determinação legal, judicial ou acadêmica, as informações
            dos usuários jamais serão fornecidas a terceiros ou usadas para finalidades diferentes daquelas
            para as quais foram coletadas.
           </Typography>
        </li>
        <li>
          <Typography type="body">
            O acesso às informações coletadas está restrito apenas aos gestores do            
            <strong>CACiC</strong> e manteremos a integridade das informações que nos forem fornecidas.
          </Typography>
        </li>
        <li>
          <Typography type="body">
            Eventualmente, poderemos utilizar cookies para confirmar sua identidade, personalizar seu acesso e acompanhar a
            utilização de nosso site visando o aprimoramento de sua navegação e funcionalidade.
          </Typography>
        </li>
        <li>
          <Typography type="body">
            Colocamos canais de atendimento à disposição de nossos usuários, para esclarecer
            qualquer dúvida que possa surgir referente aos seus dados. Estes canais podem ser acionados
            através do e-mail <Link target='_blank' href="mailto:cacic.fct@gmail.com">cacic.fct@gmail.com</Link>.
          </Typography>
        </li>
      </ol>
      <p><br /><br /></p>
      <Typography type="subtitle">Como coletamos os dados</Typography>
      <br />
      <ul>
        <li>
          <Typography type="body">
            Através dos rastreadores e cookies dos serviços de marketing e SEO da <strong>Google</strong>.
            Estas ferramentas coletam dados an&ocirc;nimos como a sua localização, seu IP, rastreia a
            navegação e analisa o seu comportamento em nosso site a fim de nos fornecer relatórios
            sobre os serviços e produtos que você procurou e qual a origem da sua visita; pesquisa do Google,
            acesso direto ou link existente em outro site, o <strong>CACiC</strong> respeita a {' '}
            <Link href="https://policies.google.com/privacy?hl=pt-BR" target="_blank" rel="noopener">
              política de privacidade da Google
            </Link>
            .
          </Typography>
        </li>
        <li>
          <Typography type="body">
            <strong>Google Forms.</strong> Eventualmente podemos coletar dados referente aos nossos serviços e
            realizar pesquisas através do serviço de coleta de dados por formulários do Google Forms.
            Durante a coleta dos dados poderá será solicitado nome completo, telefone, e-mail e
            informações triviais.
          </Typography>
        </li>
      </ul>
      <Typography type="body">
        <br />
        <br />
      </Typography>
      <Typography type="subtitle">Consentimento de cookies</Typography>
      <br />
      <Typography type="body">
        Para que os recursos de coleta de dados em nosso site funcionem adequadamente é necessário o uso de
        cookies (pequenos arquivos de texto que podem definir preferências).
      </Typography>
      <p>
        <br />
        <br />
      </p>
      <Typography type="subtitle">Seus direitos</Typography>
      <br />
      <Typography type="body">Você tem os seguintes direitos:</Typography>
      <ul>
        <li>
          <Typography type="body">
            O direito de bloquear qualquer tipo de rastreador e cookie gerado em nosso site de modo a não
            compartilhar nenhum tipo de informação sobre a sua conexão e acesso.
          </Typography>
        </li>
        <li>
          <Typography type="body">
            O direito de nos pedir para atualizar qualquer informação pessoal incorreta de que temos sobre
            você.
          </Typography>
        </li>
        <li>
          <Typography type="body">
            O direito de optar por sair de quaisquer meios de comunicação comercial e de marketing.
          </Typography>
        </li>
        <li>
          <Typography type="body">
            O direito de pedir a remoção de qualquer dado pessoal que tenhamos armazenado sobre você. 
          </Typography>
        </li>
      </ul>
      <Typography type="body">
        Reservamos o prazo de 5 dias úteis para lhe responder sobre qualquer contato referente aos seus dados
        pessoais, podendo este prazo ser estendido em período de festas, feriados prolongados, recesso e
        férias coletivas.
      </Typography>
      <Typography type="body">
        <br /><em> Esta política de privacidade foi atualizada em 18/03/2024<em> </em></em>
      </Typography>
    </div>
   </>
  );
}