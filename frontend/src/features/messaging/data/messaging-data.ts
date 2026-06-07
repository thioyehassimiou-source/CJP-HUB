export const MESSAGING_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA-OmG79gs-sTaepRaae5bofrg5NS_Gx5WzOgI6jHHdqZeSQ8VDdtFIcUde__8Ktx9RspJgOeyI1ZRwncdynRvZgcGwoijoSN7ypAvoK5s8R0FIQbWC0S_5iqfpeCQRWWQWtIVO3K6_hwJi5dh47_UKDjVVLIVGOYUVlDvSWv83wUW-1XrVLTJay0MJ7vsj2cLX6gYw6gqQgXfvhIer4jEOQk5WSvxLFKsAzuUcBKGRJKiJzx2YTD-ryx_67J_P1WHaWXUwzqQ8BQo";

export const CURRENT_USER_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA9XdtQBmijJQgbB4dBrMauvHE8IEQFKzs2xfEavhIH6lfrja2lSDyV6RtZsLmWpnMTvYSMhUDzpAix622ruiStaG12Ojk33SlwrKitdsi3JBxGp-bkkVYm8_02KSJcwPEzQSGSU_vO6-T21dKYC_vNNHSEee7GsLG0KP1cwyhhe_1BiURLJHtIuztwCr3GOf133jr-JjtlHWZ3k1iOTKTYrzJzgNKyt1YPLpx-5a1f_NON2y3JWmLmzWfpF7KjEXGSrnNjiuXK9vI";

export const MESSAGING_TOP_TABS = [
  { id: "direct", label: "Direct", href: "/dashboard/messages" },
  { id: "groups", label: "Groups", href: "#" },
  { id: "announcements", label: "Announcements", href: "#" },
] as const;

export type HubNavItem = {
  label: string;
  icon: string;
  href: string;
  activeMatch?: string;
};

export const MESSAGING_HUB_SIDEBAR_NAV: HubNavItem[] = [
  { label: "Messages", icon: "chat", href: "/dashboard/messages", activeMatch: "/dashboard/messages" },
  { label: "Projects", icon: "account_tree", href: "/dashboard/projets/nouveau", activeMatch: "/dashboard/projets" },
  { label: "Resources", icon: "folder_shared", href: "/dashboard/bibliotheque" },
  { label: "Members", icon: "group", href: "/dashboard/projets" },
  { label: "Settings", icon: "settings", href: "/dashboard/parametres", activeMatch: "/dashboard/parametres" },
];

export const MESSAGING_HUB_SIDEBAR_FOOTER: HubNavItem[] = [
  { label: "Security", icon: "security", href: "#" },
  { label: "Support", icon: "help", href: "#" },
];

export const MESSAGING_MOBILE_NAV: HubNavItem[] = [
  { label: "Chat", icon: "forum", href: "/dashboard/messages", activeMatch: "/dashboard/messages" },
  { label: "Projects", icon: "inventory_2", href: "/dashboard/projets/nouveau", activeMatch: "/dashboard/projets" },
  { label: "Docs", icon: "description", href: "/dashboard/bibliotheque" },
  { label: "Settings", icon: "settings_applications", href: "/dashboard/parametres", activeMatch: "/dashboard/parametres" },
];

export type ConversationPreview = {
  id: string;
  type: "group" | "direct" | "announcement";
  title: string;
  preview: string;
  time: string;
  avatar?: string;
  online?: boolean;
  memberAvatars?: string[];
  extraMembers?: number;
};

export const CONVERSATION_PREVIEWS: ConversationPreview[] = [
  {
    id: "hackathon-2024",
    type: "group",
    title: "Hackathon 2024",
    preview: "Alex: Let's finalize the UI design by noon.",
    time: "2m ago",
    memberAvatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDNitlKl1P9YEcuRAlz2NkXnuG1KGQjCJztu-W5NzRB273E0X4JK8FdlX5FcwyvqQj7mURcuM4pAUzr06CMD9JHt_PvH_v5zpNJJoZfJ9od3QCde-phVaFSVnK9jnHsdI03b9U_1ajtDF6U6DswO7kYIn6RcKiXwtYOqOQxvuyEten8vfYFjyhktss_zD6b5ypVRjADEpJECRlVN3sPyEN6tuWIJPemJx0AH-UACoTWMjT0_53-RC18qBUzAiu54YBEAI1PHRSrQlw",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBa-evtGJdjIPl6rERb8mGirIEHMNV-rq5P2_siG020MJHu8FcFxJHDPwCUHs-WkjYu4dUTLZJMI4OnCwba1QDfxxhsORS1rxQeRtFigArh-ru89RQHF9mIUfzkH3RX2tw4qe0ZKS2ZJlqkygwHZbYeiFYZVBvrHBgVNTHC6XeFZcVKz7ifqGm1XkKcHpHUHj6b5662j4WR8p9CKQV59shxA4U3grfCbMJ-PtnLwYFqinGqN0oEmroBrK0GHv4yAFgVI0SUM81kd0A",
    ],
    extraMembers: 5,
  },
  {
    id: "marie-laurent",
    type: "direct",
    title: "Marie Laurent",
    preview: "Here is the Python script for the data analysis...",
    time: "15m",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYJ5W5qzNBITuwfFwG8wNzrqe8Tuwq4rEXE0TxryhfdZllFQhdp3o0ekVFRH3msT8JmFIwLaWYoB8_l_loj_WWE814nZoQQ2Jq4mGIQyAnYmGZ6dm2QO7otTwxXlE9DQEIOJ8NCxZ88A0WKiS9Y_N0RAxi6rErHZ44NbJ6QE8BaNar5YCniET0CagFLUIIKwnAI9dlAM9XKaKeF-z2t8eneAXW-cwByMqjln2uHz5M8MmYK1xLU8YXVST2ppZQE_gdjy5zqEGV9ac",
    online: true,
  },
  {
    id: "cjp-global",
    type: "announcement",
    title: "CJP Global",
    preview: "New Policy Update for 2024",
    time: "1h",
  },
];

export type GroupMember = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online: boolean;
};

export type SharedFile = {
  id: string;
  type: "image" | "document";
  label: string;
  image?: string;
};

export type ChatMessage =
  | {
      id: string;
      type: "text";
      author: string;
      authorAvatar: string;
      time: string;
      content: string;
      sent?: boolean;
      seen?: boolean;
    }
  | {
      id: string;
      type: "attachment";
      authorAvatar: string;
      fileName: string;
      fileSize: string;
    }
  | {
      id: string;
      type: "code";
      authorAvatar: string;
      fileName: string;
      code: string;
    };

export type ConversationDetail = {
  id: string;
  title: string;
  subtitle: string;
  activeMembers: string;
  placeholder: string;
  members: GroupMember[];
  sharedFiles: SharedFile[];
  messages: ChatMessage[];
};

export const CONVERSATION_DETAILS: Record<string, ConversationDetail> = {
  "hackathon-2024": {
    id: "hackathon-2024",
    title: "Hackathon 2024",
    subtitle: "Project Group • 18 Members",
    activeMembers: "12 members active",
    placeholder: "Type a message to Hackathon 2024...",
    members: [
      {
        id: "alex",
        name: "Alex L.",
        role: "Product Designer",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDOQsQ2ng6q0R_BZGxd9nW8QZpj_XbFqULNd5dFGjvfIBoyGZwHpIWfySdmZU3ai17TGS4AbdVq2HVFH0djKBQL8JJoBEpaMZo9WSkwVc5A-SfIah8houyqHJoCSW29VF4xIN8G80wSC1jOyaKbRiqLNNbHd3v0bLarECSbNeSVNMLLwdVUqyAZc7j-Z9xFDWQquZsakXb6wds-oCHnOnrSSI7Rf0qydJny4Nijg6R5cPiQ6ykidIE3rSjGB956fAOsurOQjHmtqk4",
        online: true,
      },
      {
        id: "marie",
        name: "Marie L.",
        role: "Data Scientist",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDCne7HTiISOZ8qPWHHq8tovoqdx-G8GUtwmkcQrWnwnL-69341QXcF2ufMoV6qiu5MVDVb4ronzjFFK_ZN9ukecH9snukHPDm9-rBajFc65CWvy6akLNWmukpgZ2IxX7ldAMDB2oDbZLwEYVv1cKEVtmU8Fs80OZ3k5t9UqNMMC1Qf7hBaPIFGIAXMUyqH8PAoIF9jr6Cub4XCvDE8Yw2eD6jOgZ1Zo0sHflWq44NIgj6ao-Vr5WERvcVrOBfQfV3Yir4qP9ORAGI",
        online: true,
      },
      {
        id: "jean",
        name: "Jean S.",
        role: "Fullstack Dev",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBEPdsimdZioredi_4sLyu4KtgWzLoj9Ay5C462PpaeVa8-b8yAPk_MBQNHC72qGmRZGldBf2asNOdNhBgxekGSIWngLBO_Z8fi5GAQ8uJ0wmNetmz7ENoJWhCPBMw5NmIKKEBd101UnCNpktLRiVQZIv-bSC10p8i8CX5Xzr_A-jmPtA04Q1jUGwzAD2HzxBTgd7UOwRRohehXx6LKiZOzapv3Vak1W9SFYS1vjkPOUuIvQTc_Zp8NwklS9ZzSVl5uEKdnyMdld1A",
        online: false,
      },
    ],
    sharedFiles: [
      {
        id: "ui-mockup",
        type: "image",
        label: "UI Mockup",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDwctTffAKW58L6ZSioGW_DfN5a8ZhVqLCbDOmSo56yr6VhJjMqH7jXHCH0dCNP0w6gxmbgEpaXGXk4JJkKm1hOiGjhOF_gGmM4Z5WgIv4oMi0xMapovNXJKzvCFvemRkVINFTAUT75WKbnaPJCN9Lg0BLfH8f7a_jhCqYJLum9WE12QxyRgCoOPH8-ahdZJXFLxvbNQe8DoDk6m6wRLi22U2vUHSVMHTby3F4OQhPdd66pOF3-pahf6UrW0ezfugLJdDwvQhLtFuQ",
      },
      {
        id: "spec-doc",
        type: "document",
        label: "Spec_Doc.pdf",
      },
    ],
    messages: [
      {
        id: "m1",
        type: "text",
        author: "Alex L.",
        authorAvatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBxoSKVKUqKI71gNl25-4408ObEbDaDcP8DWnk7GAmdPH_puGI88xf3k39GZ_zVgzTIN-BrGhMDqqIa9dphm-qhqHTb6VcDXeJU9UcMA8mIW0FFF6iwa3KDZIZPeP7Z2TPYjrl_FtIQpAzkPV35sZsapgrTL_dCyVsptRHYLqb76jbIv1VcUo_6ZnZp5UR5eOcDpdlASvCfJYCN-CyCFu8cGo839izdA7xSEGw2XosoO_yB4jfvMdB6me85yxUpSFzUVicsYk0SeUE",
        time: "10:42 AM",
        content:
          "Hi everyone! I've uploaded the initial wireframes for the dashboard. Can you check them out?",
      },
      {
        id: "m2",
        type: "attachment",
        authorAvatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBW2CYZeZi00s6orF-pUw__rT0Xa01UfiHyTGsF1iCIigtYK6dAPK0RRJctM2RDc-CdAPBrmUBTiOrdN0peJS-v_aoQL0oBGtuReGToFnsFiORXeHNgvFdZ9GAH-4c1uXy9PeXlIxi7_nsz4vMwvoYY2p1ukiTuJ9Jt3x2EExYvlsEw12hwGCbkM48mAIDjIA4PJvgF7w-xZijye-BE4rkT1ca5NI0ZzarAFxwc5l3zjmPosP_oyG1UnlLSu3H4RevVbGK8xc7cxfI",
        fileName: "Wireframes_v1.pdf",
        fileSize: "2.4 MB",
      },
      {
        id: "m3",
        type: "text",
        author: "Me",
        authorAvatar: CURRENT_USER_AVATAR,
        time: "10:45 AM",
        content:
          "Looks great Alex. I'll start working on the React components based on these screens. Does anyone have the API docs?",
        sent: true,
        seen: true,
      },
      {
        id: "m4",
        type: "code",
        authorAvatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBZAgUg0nRmsHKKS9Jt_f0MyC_kgdYfBj43tCL3aISb7sm-YO2j1s4nZ_YY87TuEJw7hEVbvz-ZDlRk8r3EKQgsE7K-bcvEey9tShE38hYmI9RZVxTYTRAWopyg0p4tmPC46ldY2nQQFV_AQmS_D9RcNQnUqtMVZWbwoEwEqnPSnbf_efC3p0R7w0Y_v-IChQVvYytTohHMgxuKmfOKNFOP7zjqAmY-v93m_tQuVcpcIUMcjruwh0fRi3dbsTUnhc06jSJl_MJ4BbQ",
        fileName: "auth_service.py",
        code: `def authenticate_user(token):
    try:
        payload = jwt.decode(token, SECRET)
        return payload['user_id']
    except Exception as e:
        return None`,
      },
    ],
  },
  "marie-laurent": {
    id: "marie-laurent",
    title: "Marie Laurent",
    subtitle: "Direct Message",
    activeMembers: "Online",
    placeholder: "Type a message to Marie Laurent...",
    members: [],
    sharedFiles: [],
    messages: [
      {
        id: "dm1",
        type: "text",
        author: "Marie Laurent",
        authorAvatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCYJ5W5qzNBITuwfFwG8wNzrqe8Tuwq4rEXE0TxryhfdZllFQhdp3o0ekVFRH3msT8JmFIwLaWYoB8_l_loj_WWE814nZoQQ2Jq4mGIQyAnYmGZ6dm2QO7otTwxXlE9DQEIOJ8NCxZ88A0WKiS9Y_N0RAxi6rErHZ44NbJ6QE8BaNar5YCniET0CagFLUIIKwnAI9dlAM9XKaKeF-z2t8eneAXW-cwByMqjln2uHz5M8MmYK1xLU8YXVST2ppZQE_gdjy5zqEGV9ac",
        time: "09:15 AM",
        content: "Here is the Python script for the data analysis. Let me know if you need changes.",
      },
    ],
  },
  "cjp-global": {
    id: "cjp-global",
    title: "CJP Global",
    subtitle: "Official Announcements",
    activeMembers: "Broadcast channel",
    placeholder: "Replies disabled for announcements",
    members: [],
    sharedFiles: [],
    messages: [
      {
        id: "a1",
        type: "text",
        author: "CJP Admin",
        authorAvatar: MESSAGING_AVATAR,
        time: "08:00 AM",
        content: "New Policy Update for 2024 — please review the updated membership guidelines.",
      },
    ],
  },
};

export const DEFAULT_CONVERSATION_ID = "hackathon-2024";

export function getConversationDetail(id: string): ConversationDetail {
  return CONVERSATION_DETAILS[id] ?? CONVERSATION_DETAILS[DEFAULT_CONVERSATION_ID];
}
