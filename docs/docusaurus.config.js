// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Chirpstack-HPR',
  tagline: 'Usage Documentation',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://ccall48.githum.io/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/chirpstack-hpr.github.io/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ccall48', // Usually your GitHub org/user name.
  projectName: 'chirpstack-hpr.github.io', // Usually your repo name.

  onBrokenLinks: 'warn', //'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            //'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
            'https://github.com/ccall48/chirpstack-hpr.github.io/tree/master/docs'
        },
        // blog: {
        //   showReadingTime: true,
        //   feedOptions: {
        //     type: ['rss', 'atom'],
        //     xslt: true,
        //   },
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        //   // Useful options to enforce blogging best practices
        //   onInlineTags: 'warn',
        //   onInlineAuthors: 'warn',
        //   onUntruncatedBlogPosts: 'warn',
        // },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  //plugins: ['@docusaurus/theme-live-codeblock'],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/chirpstack-hpr-logo.jpg',
      navbar: {
        title: 'Chirpstack-HPR',
        logo: {
          alt: 'Chirpstack-HPR',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          // {to: '/blog', label: 'Blog', position: 'left'},
          // {
          //   href: 'https://github.com/facebook/docusaurus',
          //   label: 'GitHub',
          //   position: 'right',
          // },
        ],
      },
      colorMode: {
        defaultMode: 'dark', // light/dark
        disableSwitch: false, // boolean, true/false
        respectPrefersColorScheme: false, // boolean, true/false
      },
      liveCodeBlock: {
        /**
         * The position of the live playground, above or under the editor
         * Possible values: "top" | "bottom"
         */
        playgroundPosition: 'bottom',
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Chirpstack Helium',
                to: '/docs/chirpstack-helium',
              },
              {
                label: 'Chirpstack-HPR Setup',
                to: '/docs/chirpstack-hpr/initial-setup',
              },
              {
                label: 'ChirpStack Docs',
                to: 'https://www.chirpstack.io/'
              },
              {
                label: 'Chirpstack Support',
                to: 'https://support.chirpstack.io/'
              },
            ],
          },
          {
            title: 'Community Links',
            items: [
              {
                label: 'Helium Network',
                href: 'https://www.helium.com'
              },
              {
                label: 'Official Helium Docs',
                href: 'https://docs.helium.com'
              },
              {
                label: 'Official Helium Discord',
                href: 'https://discord.gg/helium',
              },
              {
                label: 'Helium on X',
                href: 'https://x.com/helium',
              },
            ],
          },
          {
            title: 'More',
            items: [
              // {
              //   label: 'Blog',
              //   to: '/blog',
              // },
              {
                label: 'Chirpstack-HPR GitHub',
                href: 'https://github.com/ccall48/chirpstack-hpr',
              },
              {
                label: 'Helium Foundation',
                href: 'https://www.helium.foundation/'
              },
              {
                label: 'Helium IOT Mapping',
                href: 'https://mappers.hexato.io/'
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Chirpstack-HPR.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
