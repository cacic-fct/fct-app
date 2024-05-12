import { Typography } from "@/components/Typography"
import Login from "../login/page"

const isAuthenticated = false

export default function Profile() {
  return (
    isAuthenticated ? (
        <Typography type="title" color="darkTint">bem vindo</Typography>
      ) : (
        <Login />
      )
    
  )
}