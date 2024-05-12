
const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const weeks = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const fullWeeks = ['Domingo', 'Segunda', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
const weekTimestamp = 7 * 24 * 60 * 60 * 1000

const formatDate = (date: Date) => {
  const day = date.getDate()
  const month = date.getMonth() 
  const year = date.getFullYear()
  const week = date.getDay()

  return `${fullWeeks[week]}, ${day} de ${months[month]} de ${year}`
}

export {months, weeks, fullWeeks, weekTimestamp, formatDate}