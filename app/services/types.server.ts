export interface Register {
  email: string;
  password: string;
  name: string;
}

export interface Community {
  name: string;
  profileImage?: string;
  userId: string;
}

export interface Message {
  content: string;
  userId: string;
  communityId: string;
}

export interface Mail {
  to: string;
  from: string;
  communityId: string;
  commName: string;
}
