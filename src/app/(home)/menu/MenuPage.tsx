import { MenuItens } from "@/components/MenuItens"
import { TopBar } from "@/components/TopBar"

import { 
  ENTIDADES_ESTUDANTIS,
   FCT_UNESP, MANUAL_DO_CALOURO, 
   PAGINA_DO_CALOURO 
} from "@/constants/urls"

import { 
  IoBookOutline,
   IoInformationCircleOutline,
   IoPeopleCircleOutline,
   IoPeopleOutline,
   IoSchoolOutline 
} from "react-icons/io5"

const menuItens = [
  {
    icon: IoPeopleOutline,
    title: "Página do calouro",
    link: PAGINA_DO_CALOURO
  },
  {
    icon: IoSchoolOutline,
    title: "Site da FCT-Unesp",
    link: FCT_UNESP
  },
  {
    icon: IoBookOutline,
    title: "Manual do calouro",
    link: MANUAL_DO_CALOURO 
  },
  {
    icon: IoPeopleCircleOutline,
    title: "Entidades estudantis",
    link: ENTIDADES_ESTUDANTIS
  },
  {
    icon: IoInformationCircleOutline,
    title: "Sobre esse app",
    link: '/about',
    intern: true
  }
]
export const MenuPage = () => {
  return (
    <>
      <TopBar title="Menu" />
      <MenuItens itens={menuItens} />
    </>
  )
}
