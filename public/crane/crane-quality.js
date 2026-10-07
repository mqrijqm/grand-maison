// Bound GPU allocations while preserving thin cables on high-density displays.
export function craneQuality(width,height,deviceRatio=1,mobile=false,maxTextureSize=8192) {
  const w=Math.max(1,width),h=Math.max(1,height);
  const budget=mobile?1500000:3500000;
  const preferred=mobile?1.25:Math.min(1.5,Math.max(1,deviceRatio));
  const pixelRatio=Math.min(preferred,Math.sqrt(budget/(w*h)),maxTextureSize/w,maxTextureSize/h);
  return {
    pixelRatio,
    shadowSize:Math.min(mobile?1024:2048,maxTextureSize),
    contactSamples:mobile?24:32,
  };
}
