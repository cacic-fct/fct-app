export type TypographyType = 
  'title' |
  'body' |
  'subtitle' |
  'button' |
  'display' |
  'link'

export type TypographyOption = {
  fontSize: string
  fontWeight: number
  lineHeight: string
  fontFamily: string
  letterSpacing: string
}

export const TypographyOptions: Map<TypographyType, TypographyOption> = new Map([
  ['body', {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: '1.1rem',
    letterSpacing: '0.5px',
    fontFamily: 'Roboto, Helvetica Neue, sans-serif',
  }],
  ['display', {
    fontSize: '3rem',
    fontWeight: 700,
    lineHeight: '3.5rem',
    letterSpacing: '0.5px',
    fontFamily: 'Roboto, Helvetica Neue, sans-serif',
  }],
  ['subtitle', {
    fontSize: '1.3rem',
    fontWeight: 600,
    lineHeight: '1.7rem',
    letterSpacing: '0.5px',
    fontFamily: 'Roboto, Helvetica Neue, sans-serif',
  }],
  ['title', {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: '2.8',
    letterSpacing: '0.5px',
    fontFamily: 'Roboto, Helvetica Neue, sans-serif',
  }],
  ['button', {
    fontSize: '0.8rem',
    fontWeight: 700,
    lineHeight: '1.2rem',
    letterSpacing: '1.2px',
    fontFamily: 'Roboto, Helvetica Neue, sans-serif',
  }],
  ['link', {
    fontSize: '0.8rem',
    fontWeight: 400,
    lineHeight: '1rem',
    letterSpacing: '0px',
    fontFamily: 'Roboto, Helvetica Neue, sans-serif',
  }]
])