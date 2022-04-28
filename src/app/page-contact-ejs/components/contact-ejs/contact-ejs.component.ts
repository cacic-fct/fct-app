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
      email: 'computacaojr@gmail.com',
      website: 'https://www.ejcomp.com.br',
      phone:'+551832295466',
      social: {
        facebook: 'EJComp.UNESP',
        instagram: 'ejcompunesp',
      },
    },
    {
      course: 'Arquitetura e Urbanismo',
      acronym: 'Ópera Krios',
      email:'operakrios@gmail.com',
      website:'http://www.operakrios.com.br',
      phone:'+5518997773004',
      social: {
        facebook: 'operakrios',
        instagram: 'operakrios',
      },
    },
    {
      course: 'Educação Física',
      acronym: 'Performance Jr',
      website:'https://empresaperformance1.wixsite.com/performancejr',
      phone:'+5518997350415',
      social: {
        facebook: 'performance.junior',
        instagram: 'performance.jr',
      },
    },
    {
      course: 'Geografia e Engenharia Ambiental',
      acronym: 'GeoAmbiental Jr.',
      email:'acessogajr@gmail.com',
      website:'https://www.geoambientaljr.com/',
      phone:'+17997212929',
      social: {
        facebook: 'GeoAmbientalJr',
        instagram: 'geoambientaljr',
        linkedin:'geoambiental-jr',
      },
    },
    {
      course: 'Engenharia Cartográfica e de Agrimensura',
      acronym: 'EJECart',
      email:'contato.ejecart@gmail.com',
      phone:'+551832295411',
      social: {
        facebook: 'ejecart',
        instagram: 'ejecart',
      },
    },
    {
      course: 'Estatística',
      acronym: 'EJEST',
      email:'ejest.unesp@gmail.com',
      phone:'+551832295413',
      social: {
        facebook: 'ejest.consultoria',
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
