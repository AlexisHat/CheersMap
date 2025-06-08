export interface MarkerData {
  id: string;
  title: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export const dummyMarkers: MarkerData[] = [
  {
    id: "1",
    title: "Kölner Dom",
    location: { latitude: 50.9413, longitude: 6.9583 },
  },
  {
    id: "2",
    title: "Museum Ludwig",
    location: { latitude: 50.9411, longitude: 6.9628 },
  },
  {
    id: "3",
    title: "Schokoladenmuseum",
    location: { latitude: 50.9299, longitude: 6.9644 },
  },
  {
    id: "4",
    title: "Rheinauhafen",
    location: { latitude: 50.921, longitude: 6.9646 },
  },
  {
    id: "5",
    title: "KölnTriangle",
    location: { latitude: 50.9384, longitude: 6.9749 },
  },
  {
    id: "6",
    title: "Hohenzollernbrücke",
    location: { latitude: 50.9412, longitude: 6.9659 },
  },
  {
    id: "7",
    title: "Stadtgarten",
    location: { latitude: 50.937, longitude: 6.9308 },
  },
  {
    id: "8",
    title: "Mediapark",
    location: { latitude: 50.9474, longitude: 6.9443 },
  },
  {
    id: "9",
    title: "Flora Köln",
    location: { latitude: 50.957, longitude: 6.9732 },
  },
  {
    id: "10",
    title: "Lanxess Arena",
    location: { latitude: 50.938, longitude: 6.9825 },
  },
  {
    id: "11",
    title: "Odysseum",
    location: { latitude: 50.9385, longitude: 6.9905 },
  },
  {
    id: "12",
    title: "St. Gereon",
    location: { latitude: 50.9447, longitude: 6.9486 },
  },
  {
    id: "13",
    title: "Kölner Zoo",
    location: { latitude: 50.957, longitude: 6.9732 },
  },
  {
    id: "14",
    title: "Botanischer Garten",
    location: { latitude: 50.9583, longitude: 6.9721 },
  },
  {
    id: "15",
    title: "Neptunbad",
    location: { latitude: 50.9471, longitude: 6.9263 },
  },
];
