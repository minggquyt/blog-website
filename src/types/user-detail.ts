type Visibility = "public" | "private" | "followers-only";

type IntroductionItemType = "text" | "link";

// Basic info
interface UserAvatar {
  url: string;
  width: number;
  height: number;
}

interface UserFollowers {
  count: number;
  label: string;
}

interface UserBasicInfo {
  username: string;
  avatar: UserAvatar;
  followers: UserFollowers;
}

// Introduction 
interface UserIntroductionItem {
  id: string;
  type: IntroductionItemType;
  icon: string;
  label: string;
  value: string;
  editable: boolean;
  visibility: Visibility;
}

interface UserIntroduction {
  title: string;
  items: UserIntroductionItem[];
}

// Statistic
interface UserStatisticItem {
  id: string;
  icon: string;
  label: string;
  value: number;
}

interface UserStatistics {
  items: UserStatisticItem[];
}

interface UserMeta {
  createdAt: string; 
  updatedAt: string; 
}

export interface UserDetail {
  id: string;
  basicInfo: UserBasicInfo;
  introduction: UserIntroduction;
  statistics: UserStatistics;
  meta: UserMeta;
}

export type UserDetailList = UserDetail[];
