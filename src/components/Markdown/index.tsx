import React from 'react'
import ReactMarkdown from 'react-markdown'

interface Props {
  markdownText: string
}

const Markdown = ({ markdownText }: Props) => {
  return (
    <div className="markdown-container">
      <ReactMarkdown>{markdownText}</ReactMarkdown>
    </div>
  )
}

export default Markdown