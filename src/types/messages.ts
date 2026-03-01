export type DateItem = {
  type: "date";
  id: string;
  label: string;
};

export type MessageItem = {
  type: "message";
  id: string;
  author: string;
  time: string;
  content: string;
  embed?: {
    title: string;
    subtitle: string;
    note: string;
  };
};

export type CallItem = {
  type: "call";
  id: string;
  icon: string;
  text: string;
  time: string;
};

export type MessageListItem = DateItem | MessageItem | CallItem;
