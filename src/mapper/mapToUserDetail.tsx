import type { UserDetail } from "../types";

export function mapToUserDetail(row: any): UserDetail {
  return {
    id: row.id,

    background: row.background ?? "",

    basicInfo: {
      username: row.username ?? "",
      avatar: {
        url: row.avatar_url ?? "",
        width: row.avatar_width ?? 0,
        height: row.avatar_height ?? 0,
      },
      followers: {
        count: row.followers_count.count ?? 0,
        label: row.followers_list.followers_label ?? "followers",
      },
    },

    introduction: {
      title: row.introductions[0].title ?? "",
      items: (row.introductions[0].introduction_items?? []).map((item: any) => ({
        id: item.id,
        type: item.type,
        icon: item.icon,
        label: item.label,
        value: item.value,
        editable: item.editable,
        visibility: item.visibility,
      })),
    },

    statistics: {
      items: (row.statistics ?? []).map((item: any) => ({
        id: item.id,
        icon: item.icon,
        label: item.label,
        value: item.value,
      })),
    },

    meta: {
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    },
  };
}
