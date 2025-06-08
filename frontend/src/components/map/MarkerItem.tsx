import React, { memo, ReactNode } from "react";
import { Marker, Callout } from "react-native-maps";
import { Text } from "react-native";
import { MarkerData } from "../../data/dummyMarkers";

interface MarkerItemProps {
  data: MarkerData;
  children?: ReactNode;
}

const MarkerItem: React.FC<MarkerItemProps> = ({ data, children }) => (
  <Marker
    identifier={data.id}
    coordinate={data.location}
    tracksViewChanges={false}
    accessibilityLabel={data.title}
  >
    {children ? (
      children
    ) : (
      <Callout>
        <Text>{data.title}</Text>
      </Callout>
    )}
  </Marker>
);

export default memo(MarkerItem);
