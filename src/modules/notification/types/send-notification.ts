export type SendNotificationParams = {
  body: string;
  title: string;
  data?: Record<string, string | number | object>;
};
