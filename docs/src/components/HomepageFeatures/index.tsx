import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import { Code, Search, Container, Laptop, ClipboardPenLine, BookOpen } from 'lucide-react';

type FeatureItem = {
  title: string;
  icon: JSX.Element;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Desenvolvedor',
    icon: <Code size={48} />,
    description: (
      <>
        Confira a seção{' '}
        <a href="https://docs.fctapp.cacic.dev.br/Geral/Antes de colaborar/Suas obrigações">
          <b>Antes de colaborar</b>
        </a>
        .
        <br />
        Conheça as experiências passadas na seção{' '}
        <a href="/blog">
          <b>Blog</b>
        </a>
        .
      </>
    ),
  },
  {
    title: 'Servidor da Unesp',
    icon: <Search size={48} />,
    description: (
      <>
        Conheça nossas boas práticas na seção de{' '}
        <a href="/Geral/Especificações gerais/Auditing">
          <b>Especificações gerais</b>
        </a>
        .
        <br />
        Saiba quem são os{' '}
        <a href="https://cacic.dev.br/docs/Recursos/Servidores/FCTDTIWEBXP01#Encarregados/">
          <b>Encarregados de dados e de infraestrutura</b>
        </a>
        .
      </>
    ),
  },
  {
    title: 'DevOps',
    icon: <Container size={48} />,
    description: (
      <>
        Confira a seção{' '}
        <a href="/Geral/Antes de colaborar/Suas obrigações">
          <b>Antes de colaborar</b>
        </a>
        .
        <br />
        Entenda a seção de{' '}
        <a href="https://cacic.dev.br/docs/Recursos/Servidores/FCTDTIWEBXP01">
          <b>DevOps</b>
        </a>
        .
        <br />
        Conheça as experiências passadas na seção{' '}
        <a href="/blog">
          <b>Blog</b>
        </a>
        .
      </>
    ),
  },
  {
    title: 'Administrador',
    icon: <Laptop size={48} />,
    description: (
      <>
        Confira a seção de{' '}
        <a href="/Geral/Introdu%C3%A7%C3%A3o">
          <b>Especificações gerais</b>
        </a>
        .
        <br />
        Entenda os{' '}
        <a href="/Administração/Introdução">
          <b>Procedimentos</b>
        </a>
        .
        <br />
        Saiba como{' '}
        <a href="/Geral/Solução de problemas/Problemas do usuário">
          <b>Solucionar problemas</b>
        </a>
        .
      </>
    ),
  },
  {
    title: 'Organizador',
    icon: <ClipboardPenLine size={48} />,
    description: (
      <>
        Confira a seção de{' '}
        <a href="/Geral/Introdu%C3%A7%C3%A3o">
          <b>Especificações gerais</b>
        </a>
        .
        <br />
        Entenda os{' '}
        <a href="/Administração/Introdução">
          <b>Procedimentos</b>
        </a>
        .
        <br />
        Saiba como{' '}
        <a href="/Geral/Solução de problemas/Problemas do usuário">
          <b>Solucionar problemas do usuário</b>
        </a>
        .
      </>
    ),
  },
  {
    title: 'Usuário',
    icon: <BookOpen size={48} />,
    description: (
      <>
        Se estiver com algum problema, confira a seção de{' '}
        <a href="/Geral/Solução de problemas/Problemas do usuário">
          <b>Solução de problemas</b>
        </a>
        .
        <br />
        Entenda o armazenamento dos seus dados em{' '}
        <a href="/Geral/Especificações gerais/Dados dos usuários">
          <b>Dados dos usuários</b>
        </a>
        .
        <br />
        Saiba sobre nossas{' '}
        <a href="/Geral/Práticas sociais/Acessibilidade">
          <b>Práticas sociais</b>
        </a>
        .
      </>
    ),
  },
];

function Feature({ title, icon, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--justify">{icon}</div>
      <div className="text--justify">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
