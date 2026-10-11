// Bound GPU allocations while preserving thin cables on high-density displays.
export function craneQuality(width,height,deviceRatio=1,mobile=false,maxTextureSize=8192) {
  const w=Math.max(1,width),h=Math.max(1,height);
  // Telefon: do 1,75× (oštre linije na gustim ekranima); regulator u crane-hero.js spušta rezoluciju ako GPU kasni.
  const budget=mobile?1800000:3500000;
  const preferred=mobile?Math.min(1.75,Math.max(1,deviceRatio)):Math.min(1.5,Math.max(1,deviceRatio));
  const pixelRatio=Math.min(preferred,Math.sqrt(budget/(w*h)),maxTextureSize/w,maxTextureSize/h);
  return {
    pixelRatio,
    shadowSize:Math.min(mobile?1024:2048,maxTextureSize),
    contactSamples:mobile?24:32,
  };
}
