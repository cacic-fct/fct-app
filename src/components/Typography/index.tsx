import { ColorsType } from "@/models/colors"
import { TypographyOptions, TypographyType } from "@/models/typography"
import variables from "@/styles/variables.module.scss"

interface Props {
  children: React.ReactNode
  type: TypographyType
  color?: ColorsType
  center?: boolean
}

export const Typography = ({children, type, color="lightContrast", center}: Props) => {
  return (
    <p style={{
      fontSize: TypographyOptions.get(type)!.fontSize,
      fontWeight: TypographyOptions.get(type)!.fontWeight,
      lineHeight: TypographyOptions.get(type)!.lineHeight,
      color: variables[color],
      fontFamily: TypographyOptions.get(type)!.fontFamily,
      letterSpacing: TypographyOptions.get(type)!.letterSpacing,
      textAlign: center ? "center" : "justify"
    }}>
      {children}
    </p>
  )
}