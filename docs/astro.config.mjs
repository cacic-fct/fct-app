import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'FCT App Docs',
      locales: {
        root: {
          label: 'Português',
          lang: 'pt-BR',
        },
      },
      favicon: './favicon.png',
      social: {
        github: 'https://github.com/cacic-fct/fct-app/blob/main/docs',
      },
      editLink: {
        baseUrl: 'https://github.com/cacic-fct/fct-app/edit/main/docs',
      },
      sidebar: [
        {
          label: 'Banco de dados',
          autogenerate: {
            directory: 'database',
          },
        },
        {
          label: 'Especificações gerais',
          autogenerate: {
            directory: 'general-specs',
          },
        },
      ],
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    icon(),
  ],
});
