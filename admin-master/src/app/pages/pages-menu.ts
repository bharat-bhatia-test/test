import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: "Client",
    icon: "person",
    link: "/pages/client",
    pathMatch: "fully"
  },
  {
    title: "Caregiver",
    icon: "person",
    link: "/pages/caregiver",
    pathMatch: "fully"
  },
  {
    title: "Outstanding Matches",
    icon: "options-2",
    link: "/pages/outstanding-matches",
    pathMatch: "fully"
  },
  {
    title: "Completed Matches",
    icon: "checkmark-circle-2",
    link: "/pages/completed-matches",
    pathMatch: "fully"
  },
  {
    title: "System Settings",
    icon: "settings-outline",
    link: "/pages/system-settings",
    pathMatch: "fully"
  },
];
