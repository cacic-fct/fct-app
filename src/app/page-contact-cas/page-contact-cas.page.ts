import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-contact-cas',
  templateUrl: './page-contact-cas.page.html',
  styleUrls: ['./page-contact-cas.page.scss'],
})
export class PageContactCasPage implements OnInit {
  contacts: any = [
    {
      course: 'Ciência da Computação',
      acronym: 'EJComp',
      email: '',
      website: '',
      social: {
        facebook: '',
        instagram: '',
      },
    },
    {
      course: 'Arquitetura e Urbanismo',
      acronym: '',
      social: {
        facebook: '',
        instagram: '',
      },
    },
    {
      course: 'Educação Física',
      acronym: '',
      social: {
        facebook: '',
        instagram: '',
      },
    },
    {
      course: 'Engenharia Ambiental',
      acronym: '',
      social: {
        facebook: '',
        instagram: '',
      },
    },
    {
      course: 'Engenharia Cartográfica e de Agrimensura',
      acronym: '',
      social: {
        facebook: '',
        instagram: '',
      },
    },
    {
      course: 'Estatística',
      acronym: '',
      social: {
        facebook: '',
        instagram: '',
      },
    },
    // {
    //   course: 'Física',
    //   acronym: '',
    //   social: {
    //     facebook: '',
    //     instagram: '',
    //   },
    // },
    {
      course: 'Fisioterapia',
      acronym: '',
      social: {
        facebook: '',
        instagram: '',
      },
    },
    {
      course: 'Geografia',
      acronym: '',
      social: {
        facebook: 'cageo.geografia',
        instagram: 'cageo.fctunesp',
      },
    },
    {
      course: 'Matemática',
      acronym: '',
      social: {
        facebook: '',
        instagram: '',
      },
    },
    // {
    //   course: 'Pedagogia',
    //   acronym: '',
    //   social: {
    //     facebook: '',
    //     instagram: '',
    //   },
    // },
    // {
    //   course: 'Química',
    //   acronym: '',
    //   social: {
    //     facebook: '',
    //     instagram: '',
    //   },
    // },
  ];
  socialMedia = {
    linkedin: 'https://linkedin.com/in/',
    twitter: 'https://twitter.com/',
    facebook: 'https://fb.com/',
    instagram: 'https://instagram.com/',
    youtube: 'https://youtube.com/channel/',
    medium: 'https://medium.com/@',
    flickr: 'https://flickr.com/photos/',
    twitch: 'https://twitch.tv/',
    soundcloud: 'https://soundcloud.com/',
    spotify: 'https://open.spotify.com/user/',
    reddit: 'https://reddit.com/u/',
    deviantart: 'https://deviantart.com/',
    steam: 'https://steamcommunity.com/id/',
    xbox: 'http://live.xbox.com/Profile?Gamertag=',
  };
  constructor() {}

  ngOnInit() {}
}
