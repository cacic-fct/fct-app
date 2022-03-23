import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-cas',
  templateUrl: './contact-cas.component.html',
  styleUrls: ['./contact-cas.component.scss'],
})
export class ContactCasComponent implements OnInit {
  contacts: any = [
    {
      name: 'Ciência da Computação',
      acronym: 'CACiC',
      email: 'cacic.fct@gmail.com',
      social: {
        facebook: 'cacic.fct',
        instagram: 'cacic.fct',
        youtube: 'UCoYH_4dyIQHx2Kad-HG6aNA',
      },
    },
    {
      name: 'Arquitetura e Urbanismo',
      acronym: 'CACAU',
      social: {
        facebook: '',
        instagram: 'cacau.unespp',
      },
    },
    {
      name: 'Educação Física',
      acronym: 'CAEF',
      social: {
        facebook: '',
        instagram: 'caef_fct',
      },
    },
    {
      name: 'Engenharia Ambiental',
      acronym: 'CAEA',
      email: 'caeng.ambiental@gmail.com',
      social: {
        facebook: '',
        instagram: 'caengambiental',
      },
    },
    {
      name: 'Engenharia Cartográfica e de Agrimensura',
      acronym: 'CAMA',
      social: {
        facebook: '',
        instagram: 'cacartografica',
      },
    },
    {
      name: 'Estatística',
      acronym: 'CAE',
      social: {
        facebook: '',
        instagram: 'cae_unesp',
      },
    },
    // {
    //   name: 'Física',
    //   acronym: '',
    //   social: {
    //     facebook: '',
    //     instagram: '',
    //   },
    // },
    {
      name: 'Fisioterapia',
      acronym: 'CAF',
      social: {
        facebook: '',
        instagram: 'caf.unesp',
      },
    },
    {
      name: 'Geografia',
      acronym: 'CAGEO',
      social: {
        facebook: 'cageo.geografia',
        instagram: 'cageo.fctunesp',
        youtube: 'UC5fOz1IJ2_aFqnEDFFEDKAA',
        twitter: 'CageoFct',
      },
    },
    {
      name: 'Matemática',
      acronym: 'CENTRAMA',
      social: {
        facebook: '',
        instagram: 'centramafct',
      },
    },
    // {
    //   name: 'Pedagogia',
    //   acronym: '',
    //   social: {
    //     facebook: '',
    //     instagram: '',
    //   },
    // },
    // {
    //   name: 'Química',
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
