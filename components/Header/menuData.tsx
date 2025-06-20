import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "Fosfenos",
    newTab: false,
    path: "/",
  },
  {
    id: 3,
    title: "Equipo",
    newTab: false,
    path: "#equipo",
  },
  {
    id: 4,
    title: "Contenido Infantil",
    newTab: false,
    submenu: [
      {
        id: 41,
        title: "El libro de LIla",
        newTab: false,
        path: "/contenido-infantil/el-libro-de-lila", 
      },
      {
        id: 42,
        title: "Guillermina y Candelario",
        newTab: false,
        path: "/contenido-infantil/guillermina-y-candelario",
      },
      {
        id: 43,
        title: "El Pescador de estrellas",
        newTab: false,
        path: "/contenido-infantil/el-pescador-de-estrellas",
      },
      {
        id: 44,
        title: "El susurro del mar",
        newTab: false,
        path: "/contenido-infantil/juegos",
      },
      {
        id: 45,
        title: "León el camaleón",
        newTab: false,
        path: "/contenido-infantil/juegos",
      },
      {
        id: 45,
        title: "The kitchen",
        newTab: false,
        path: "/contenido-infantil/juegos",
      },
    ],
  },
  {
    id: 5,
    title: "Documentales",
    newTab: false,
    submenu: [
      {
        id: 51,
        title: "Hecho en Villapaz",
        newTab: false,
        path: "/documentales/naturaleza",
      },
      {
        id: 52,
        title: "Retratos de la ausencia",
        newTab: false,
        path: "/documentales/historia",
      }
    ],
  },
  {
    id: 6,
    title: "Servicios",
    newTab: false,
    path: "#servicios",
  },
];

export default menuData;