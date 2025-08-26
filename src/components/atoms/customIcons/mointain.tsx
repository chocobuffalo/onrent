export default function MountainIcon({color, size}: {color?: string, size?: number}) {

  return (
    <svg width={size || 39} height={size ? size * 16 / 39 : 16} viewBox="0 0 39 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M39 16H0L7.66225 7.57895L12.604 12.9948L24.4331 0L39 16Z" fill={color || "#BBBBBB"}/>
</svg>

  );
}
