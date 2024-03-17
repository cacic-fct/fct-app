# FCT App

O "FCT App" facilita a vida dos alunos da FCT, com o acesso aos eventos do câmpus. Tem alto potencial de expansão. 

## Contribuindo

Todos podem contribuir para o "FCT App".

Leia o [guia de contribuição do CACiC](https://github.com/cacic-fct/.github/blob/main/Contributing.md).

## Website

O aplicativo é construído com Angular e pode ser acessado em [fct-pp.web.app](https://fct-pp.web.app).

### Desenvolvimento

Para iniciar o website localmente, primeiro instale as dependências:

```bash
yarn
```

Configure o ionic-cli para utilizar o yarn:

```bash
ionic config set -g npmClient yarn
```

Depois, inicie o servidor de desenvolvimento:

```bash
ionic serve --ssl
```