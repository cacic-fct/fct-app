export interface EventItem {
  name: string;
  icon: string;
  course: number;
  date: string;
  location: {
    lat: number;
    lon: number;
  };
  description: string;
  shortDescription: string;
  youtubeCode: string;
  id: string;
}
