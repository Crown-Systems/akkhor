import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";

export default function ClockImage() {
  return (
    <Svg
      style={{
        flex: 1,
        position: "absolute",
        maxWidth: 24,
        maxHeight: 24,
        marginTop: -10,
        marginLeft: -4,
        width: 64,
        height: 64,
      }}
      width={256}
      height={229}
      height="100%"
      width="100%"
      top={0}
      left={0}
      viewBox="0 0 511.994 511.994"
    >
      <Circle cx={255.997} cy={255.997} r={255.997} fill="#7dd2f0" />
      <Path
        d="M23.403 279.403c0-141.384 114.615-255.999 255.999-255.999 64.737 0 123.85 24.041 168.931 63.666C401.417 33.696 332.648 0 255.999 0 114.615 0 0 114.615 0 255.999c0 76.648 33.696 145.418 87.07 192.334-39.626-45.079-63.667-104.193-63.667-168.93z"
        opacity={0.1}
        enableBackground="new"
      />
      <Path
        d="M255.999 447.641c-105.671 0-191.64-85.97-191.64-191.641s85.97-191.64 191.64-191.64 191.64 85.97 191.64 191.64-85.968 191.641-191.64 191.641z"
        fill="#fff"
      />
      <Path
        d="M87.762 279.403c0-105.671 85.97-191.64 191.64-191.64 46.891 0 89.893 16.938 123.235 45.003-35.182-41.797-87.857-68.407-146.638-68.407-105.671 0-191.64 85.97-191.64 191.64 0 58.781 26.61 111.456 68.407 146.638-28.065-33.341-45.004-76.343-45.004-123.234z"
        opacity={0.1}
        enableBackground="new"
      />
      <Path
        d="M255.999 64.359c-2.942 0-5.866.077-8.776.209v51.096a8.775 8.775 0 008.776 8.776 8.775 8.775 0 008.776-8.776V64.569c-2.908-.133-5.833-.21-8.776-.21zM385.097 114.491l-36.072 36.07a8.776 8.776 0 006.207 14.982 8.753 8.753 0 006.207-2.571l36.07-36.07a193.232 193.232 0 00-12.412-12.411zM447.431 247.223h-51.095c-4.848 0-8.776 3.929-8.776 8.776s3.928 8.776 8.776 8.776h51.095c.132-2.91.209-5.834.209-8.776.001-2.941-.076-5.866-.209-8.776zM397.509 385.097l-36.07-36.07a8.777 8.777 0 00-12.412 12.411l36.072 36.07a193.458 193.458 0 0012.41-12.411zM255.999 387.56a8.775 8.775 0 00-8.776 8.776v51.096c2.91.132 5.834.209 8.776.209s5.866-.077 8.776-.209v-51.096a8.774 8.774 0 00-8.776-8.776zM150.562 349.026l-36.07 36.07a193.247 193.247 0 0012.412 12.412l36.072-36.07a8.776 8.776 0 000-12.411 8.779 8.779 0 00-12.414-.001zM115.664 247.223H64.569c-.132 2.91-.209 5.834-.209 8.776s.077 5.866.209 8.776h51.095c4.848 0 8.776-3.929 8.776-8.776s-3.929-8.776-8.776-8.776zM114.491 126.902l36.07 36.07a8.756 8.756 0 006.207 2.571 8.776 8.776 0 006.207-14.982l-36.072-36.07a192.975 192.975 0 00-12.412 12.411zM303.437 320.988a17.493 17.493 0 01-12.411-5.142L243.59 268.41a17.552 17.552 0 01-5.142-12.411v-88.358c0-9.694 7.859-17.552 17.552-17.552 9.694 0 17.552 7.859 17.552 17.552v81.087l42.296 42.296c6.855 6.854 6.855 17.968 0 24.823a17.497 17.497 0 01-12.411 5.141z"
        fill="#515262"
      />
    </Svg>
  );
}
