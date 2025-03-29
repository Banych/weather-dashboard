export default (count: number): string[] => {
  const colors: string[] = [];
  const hueStep = 360 / count;

  for (let i = 0; i < count; i++) {
    const hue = Math.floor(i * hueStep);
    colors.push(`hsl(${hue}, 100%, 50%)`);
  }

  return colors;
};
