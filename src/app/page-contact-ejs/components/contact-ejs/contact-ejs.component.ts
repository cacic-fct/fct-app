import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-ejs',
  templateUrl: './contact-ejs.component.html',
  styleUrls: ['./contact-ejs.component.scss'],
})
export class ContactEjsComponent implements OnInit {
  contacts: any = [
    {
      course: 'Ciência da Computação',
      acronym: 'EJComp',
      email: '',
      website: '',
      social: {
        facebook: 'EJComp.UNESP',
        instagram: 'ejcompunesp',
      },
    },
    // {
    //   course: 'Arquitetura e Urbanismo',
    //   acronym: '',
    //   social: {
    //     facebook: '',
    //     instagram: '',
    //   },
    // },
    // {
    //   course: 'Educação Física',
    //   acronym: '',
    //   social: {
    //     facebook: '',
    //     instagram: '',
    //   },
    // },
    // {
    //   course: 'Engenharia Ambiental',
    //   acronym: '',
    //   social: {
    //     facebook: '',
    //     instagram: '',
    //   },
    // },
    {
      course: 'Engenharia Cartográfica e de Agrimensura',
      acronym: 'EJECart',
      social: {
        facebook: '',
        instagram: 'ejecart',
      },
    },
    {
      course: 'Estatística',
      acronym: 'EJEST',
      social: {
        facebook: '',
        instagram: 'ejest.unesp',
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
    // {
    //   course: 'Fisioterapia',
    //   acronym: '',
    //   social: {
    //     facebook: '',
    //     instagram: '',
    //   },
    // },
    // {
    //   course: 'Geografia',
    //   acronym: '',
    //   social: {
    //     facebook: '',
    //     instagram: '',
    //   },
    // },
    // {
    //   course: 'Matemática',
    //   acronym: '',
    //   social: {
    //     facebook: '',
    //     instagram: '',
    //   },
    // },
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
