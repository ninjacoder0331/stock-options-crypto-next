import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Open Position",
        url: "/open-position",
        icon: Icons.Table,
        items: [],
      },
      {
        title: "Overview",
        url: "/overView",
        icon: Icons.HomeIcon,
        items: [],
      },
      {
        title: "My Portfolio",
        url: "/portfolio",
        icon: Icons.PieChart,
        items: [],
      },
      
      {
        title: "Transaction History",
        url: "/closed-position",
        icon: Icons.Table,
        items: [],
      },
      
      // {
      //   title: "Closed Position",
      //   url: "/closed-position",
      //   icon: Icons.Table,
      //   items: [],
      // },
      {
        title: "Options Trading",
        url: "/options-trading",
        icon: Icons.FourCircle,
        items: [],
      },
    ],
  },
];
