
import React, { useEffect, useRef, useState } from 'react';

interface DotMorphProps {
  progress: number;
}

// Adjusted dot count to match the maximum density needed (ZG Logo has 133 points)
const DOT_COUNT = 133;
const S = 1; 

const getShapePoints = (shapeIndex: number): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = [];
  const add = (x: number, y: number) => points.push({ x: x * S, y: y * S });
  
  // Helper to add points along a linear path between list of nodes
  const addPath = (nodes: {x:number, y:number}[], count: number) => {
      if (nodes.length < 2) return;
      // Calculate total length
      let totalLen = 0;
      const lens: number[] = [];
      for(let i=0; i<nodes.length-1; i++) {
          const dx = nodes[i+1].x - nodes[i].x;
          const dy = nodes[i+1].y - nodes[i].y;
          const d = Math.sqrt(dx*dx+dy*dy);
          lens.push(d);
          totalLen += d;
      }
      
      let currentDist = 0;
      let currentNode = 0;
      const step = totalLen / count;
      
      // Interpolate points evenly along the path
      for(let i=0; i<count; i++) {
          const targetDist = i * step;
          while(currentNode < lens.length && currentDist + lens[currentNode] < targetDist) {
              currentDist += lens[currentNode];
              currentNode++;
          }
          if(currentNode >= lens.length) {
               add(nodes[nodes.length-1].x, nodes[nodes.length-1].y);
               continue;
          }
          const segmentProgress = (targetDist - currentDist) / lens[currentNode];
          const p1 = nodes[currentNode];
          const p2 = nodes[currentNode+1];
          add(p1.x + (p2.x - p1.x)*segmentProgress, p1.y + (p2.y - p1.y)*segmentProgress);
      }
  };

  // 0: Puzzle Piece (your brand, web & media partner)
  if (shapeIndex === 0) {
      const svgPoints = [
          // Circles from SVG
          {x:817.17,y:144.01},{x:811.29,y:89.78},{x:778.83,y:49.06},{x:741.4,y:24.06},{x:693.66,y:12.5},{x:798.79,y:189.73},{x:782.35,y:235.44},{x:799.86,y:1110.07},{x:856.27,y:276.08},{x:909.37,y:276.08},{x:962.47,y:276.08},{x:1015.57,y:276.08},{x:1068.67,y:276.08},{x:1121.77,y:276.08},{x:1121.77,y:374.15},{x:1121.77,y:325.11},{x:1121.77,y:423.2},{x:1121.77,y:472.25},{x:1121.77,y:717.48},{x:1121.77,y:766.53},{x:1121.77,y:815.57},{x:1121.77,y:864.62},{x:1121.77,y:913.67},{x:1121.77,y:962.71},{x:1121.77,y:1011.76},{x:1121.77,y:1060.81},{x:1121.77,y:1110.07},{x:1121.77,y:668.43},{x:1121.77,y:570.34},{x:1121.77,y:619.39},{x:1121.77,y:521.29},{x:273.24,y:276.08},{x:273.24,y:374.44},{x:273.24,y:325.39},{x:273.24,y:423.48},{x:273.24,y:472.53},{x:273.24,y:815.86},{x:273.24,y:864.9},{x:273.24,y:913.95},{x:273.24,y:963},{x:273.24,y:1012.04},{x:273.24,y:1061.09},{x:273.24,y:1110.07},{x:273.24,y:570.62},{x:273.24,y:521.58},{x:325.27,y:276.08},{x:378.37,y:276.08},{x:431.47,y:276.08},{x:484.57,y:276.08},{x:537.67,y:276.08},{x:587.46,y:1110.07},
          // Converted Paths to Points (Centers)
          {x:569.4,y:144.01},{x:575.28,y:89.78},{x:607.74,y:49.06},{x:645.17,y:24.06},
          // Circle in text
          {x:587.78,y:189.73},
          // Path
          {x:604.22,y:235.44}, 
          // Circles
          {x:815.54,y:979.04},{x:809.66,y:924.81},{x:777.2,y:884.09},{x:739.77,y:859.09},{x:692.03,y:847.52},{x:797.16,y:1024.75},{x:780.72,y:1070.47},
          // Path
          {x:567.77,y:979.04}, 
          // Circles
          {x:573.65,y:924.81},{x:606.11,y:884.09},{x:643.54,y:859.09},{x:586.15,y:1024.75},{x:602.59,y:1070.47},{x:856.27,y:1110.07},{x:909.37,y:1110.07},{x:962.47,y:1110.07},{x:1015.57,y:1110.07},{x:1068.67,y:1110.07},{x:325.27,y:1110.07},{x:378.37,y:1110.07},{x:431.47,y:1110.07},{x:484.57,y:1110.07},{x:537.67,y:1110.07},{x:799.86,y:1110.07},{x:587.46,y:1110.07},{x:144.01,y:570.34},{x:89.78,y:576.22},{x:49.06,y:608.68},{x:24.06,y:646.11},{x:12.5,y:693.85},{x:189.73,y:588.72},{x:235.44,y:605.16},{x:144.01,y:818.11},{x:89.78,y:812.23},{x:49.06,y:779.77},{x:24.06,y:742.34},{x:189.73,y:799.73},{x:235.44,y:783.29}
      ];
      
      const cx = 567;
      const cy = 561;
      const scale = 0.12;

      svgPoints.forEach(p => {
          add((p.x - cx) * scale, (p.y - cy) * scale);
      });
  }
  // 1: Eye (Blending creative mastery)
  else if (shapeIndex === 1) {
      const svgPoints = [
        // Top Left Brow
        {x:563.61, y:31.25}, {x:616.85, y:23.7}, {x:670.36, y:18.75}, {x:723.87, y:14.93}, {x:777.11, y:12.5},
        // Left Curve
        {x:511.26, y:40.93}, {x:457.59, y:52.43}, {x:405.36, y:64.93}, {x:350.57, y:81.62}, {x:299.78, y:99.76},
        {x:252.51, y:122.04}, {x:210.24, y:144.9}, {x:171.66, y:171.58}, {x:134.08, y:201.45},
        // Left Tip
        {x:64.91, y:272.08}, {x:97.5, y:235.87}, {x:38.19, y:313.44}, {x:12.5, y:356.36},
        // Top Right Brow
        {x:1042.84, y:31.77}, {x:989.6, y:24.23}, {x:936.09, y:19.27}, {x:882.58, y:15.45}, {x:829.34, y:13.02},
        // Right Curve
        {x:1095.19, y:41.45}, {x:1148.86, y:52.95}, {x:1201.09, y:65.45}, {x:1255.88, y:82.14}, {x:1306.67, y:100.28},
        {x:1353.94, y:122.56}, {x:1396.21, y:145.43}, {x:1434.79, y:172.1}, {x:1472.37, y:201.98},
        // Right Tip
        {x:1541.54, y:272.6}, {x:1508.95, y:236.39}, {x:1568.26, y:313.97}, {x:1593.95, y:356.88},
        // Bottom Left Brow
        {x:563.61, y:679.36}, {x:616.85, y:686.9}, {x:670.36, y:691.86}, {x:723.87, y:695.68}, {x:777.11, y:698.11},
        // Bottom Left Curve
        {x:511.26, y:669.68}, {x:457.59, y:658.18}, {x:405.36, y:645.68}, {x:350.57, y:628.99}, {x:299.78, y:610.85},
        {x:252.51, y:588.57}, {x:210.24, y:565.71}, {x:171.66, y:539.03}, {x:134.08, y:509.16},
        // Bottom Left Tip
        {x:64.91, y:438.53}, {x:97.5, y:474.74}, {x:38.19, y:397.17},
        // Bottom Right Brow
        {x:1042.84, y:678.84}, {x:989.6, y:686.38}, {x:936.09, y:691.34}, {x:882.58, y:695.16}, {x:829.34, y:697.59},
        // Bottom Right Curve
        {x:1095.19, y:669.16}, {x:1148.86, y:657.66}, {x:1201.09, y:645.16}, {x:1255.88, y:628.46}, {x:1306.67, y:610.33},
        {x:1353.94, y:588.05}, {x:1396.21, y:565.18}, {x:1434.79, y:538.51}, {x:1472.37, y:508.63},
        // Bottom Right Tip
        {x:1541.54, y:438.01}, {x:1508.95, y:474.22}, {x:1568.26, y:396.64},

        // Group 1
        {x:587.83, y:349.43}, {x:595.76, y:301.37}, {x:803.49, y:147.73}, {x:677.37, y:186.08}, {x:613.93, y:257.71},
        {x:641.09, y:219.5}, {x:757.77, y:150.98}, {x:717.04, y:164.48}, {x:593.9, y:399.17}, {x:798.49, y:562.87},
        {x:670.5, y:517.85}, {x:610.18, y:443.57}, {x:635.68, y:482.91}, {x:755.77, y:557.08}, {x:711.45, y:541.67},
        {x:1018.62, y:358.34}, {x:1012.75, y:309.98}, {x:936.16, y:191.3}, {x:996.47, y:265.58}, {x:970.98, y:226.24},
        {x:850.89, y:152.07}, {x:895.2, y:167.48}, {x:1010.42, y:407.78}, {x:928.81, y:523.06}, {x:992.25, y:451.44},
        {x:965.1, y:489.65}, {x:841.94, y:558.61}, {x:886.88, y:545.11},

        // Group 2
        {x:641.62, y:354.85}, {x:803.23, y:193.45}, {x:686.31, y:242.71}, {x:646.03, y:313.99}, {x:660.53, y:276.09},
        {x:758.99, y:199.31}, {x:718.39, y:216.69}, {x:964.83, y:354.85}, {x:920.14, y:242.71}, {x:960.42, y:313.99},
        {x:945.92, y:276.09}, {x:847.46, y:199.31}, {x:888.06, y:216.69}, {x:803.23, y:517.16}, {x:686.31, y:467.9},
        {x:646.03, y:396.62}, {x:660.53, y:434.52}, {x:758.99, y:511.3}, {x:718.39, y:493.92}, {x:920.14, y:467.9},
        {x:960.42, y:396.62}, {x:945.92, y:434.52}, {x:847.46, y:511.3}, {x:888.06, y:493.92}
      ];

      // SVG is approx 1606x710.
      const cx = 803; 
      const cy = 355;
      const scale = 0.10; 

      svgPoints.forEach(p => {
          add((p.x - cx) * scale, (p.y - cy) * scale);
      });
  }
  // 2: Atom (With cutting edge innovation)
  else if (shapeIndex === 2) {
     const orbits = 3;
     const pointsPerOrbit = 40;
     for(let o=0; o<orbits; o++) {
         const rot = (o/orbits)*Math.PI; 
         for(let i=0; i<pointsPerOrbit; i++) {
             const angle = (i/pointsPerOrbit)*Math.PI*2;
             const rx = Math.cos(angle)*70;
             const ry = Math.sin(angle)*22;
             const x = rx * Math.cos(rot) - ry * Math.sin(rot);
             const y = rx * Math.sin(rot) + ry * Math.cos(rot);
             add(x,y);
         }
     }
     // Dense Nucleus
     for(let i=0; i<15; i++) {
         const a = (i/15)*Math.PI*2;
         add(Math.cos(a)*6, Math.sin(a)*6);
     }
     add(0,0);
  }
  // 3: Tool (To craft brands which are) -> Calipers
  else if (shapeIndex === 3) {
      const svgPoints = [
          {x:12.5,y:1383.58},{x:23.03,y:1349.58},{x:33.55,y:1315.59},{x:44.07,y:1281.6},{x:54.59,y:1247.61},{x:65.11,y:1213.62},{x:75.63,y:1179.63},{x:86.16,y:1145.64},{x:96.68,y:1111.65},{x:107.2,y:1077.66},{x:117.72,y:1043.67},{x:128.24,y:1009.68},{x:149.29,y:941.7},{x:138.76,y:975.69},{x:159.81,y:907.71},{x:170.33,y:873.71},{x:180.85,y:839.72},{x:191.37,y:805.73},{x:201.9,y:771.74},{x:212.42,y:737.75},{x:222.94,y:703.76},{x:233.22,y:669.69},{x:243.74,y:635.7},{x:254.26,y:601.71},{x:264.78,y:567.72},{x:275.31,y:533.73},{x:285.83,y:499.74},{x:296.35,y:465.75},{x:306.87,y:431.76},{x:317.39,y:397.77},{x:327.91,y:363.78},{x:338.44,y:329.79},{x:348.96,y:295.8},{x:359.48,y:261.81},{x:370,y:227.81},{x:380.52,y:193.82},{x:391.04,y:159.83},{x:401.57,y:125.84},
          {x:782.07,y:1384.14},{x:771.55,y:1350.15},{x:761.03,y:1316.16},{x:750.5,y:1282.17},{x:739.98,y:1248.18},{x:729.46,y:1214.19},{x:718.94,y:1180.2},{x:708.42,y:1146.21},{x:697.89,y:1112.22},{x:687.37,y:1078.23},{x:676.85,y:1044.24},{x:655.81,y:976.25},{x:666.33,y:1010.24},{x:645.29,y:942.26},{x:634.76,y:908.27},{x:624.24,y:874.28},{x:613.72,y:840.29},{x:603.2,y:806.3},{x:592.68,y:772.31},{x:582.15,y:738.32},{x:571.88,y:704.25},{x:561.35,y:670.26},{x:550.83,y:636.27},{x:540.31,y:602.28},{x:529.79,y:568.29},{x:519.27,y:534.3},{x:508.74,y:500.31},{x:498.22,y:466.32},{x:487.7,y:432.33},{x:477.18,y:398.34},{x:466.66,y:364.35},{x:456.14,y:330.35},{x:445.61,y:296.36},{x:435.09,y:262.37},{x:424.57,y:228.38},{x:414.05,y:194.39},
          {x:615.4,y:565.72},{x:613.72,y:638.27},{x:757.27,y:568.29},{x:757.27,y:638.27},{x:757.27,y:601.72},{x:721.68,y:601.72},{x:686.1,y:601.72},{x:614.94,y:601.72},{x:650.52,y:601.72},{x:579.36,y:601.72},{x:543.77,y:601.72},{x:508.19,y:601.72},{x:472.61,y:601.72},{x:437.03,y:601.72},{x:401.45,y:601.72},{x:365.86,y:601.72},{x:330.28,y:601.46},{x:294.7,y:601.46},
          {x:479.16,y:42},{x:401.45,y:12.5},{x:324.35,y:42},{x:442.41,y:19.72},{x:360.48,y:19.72},{x:287.81,y:116.65},{x:299.35,y:76.24},{x:333.13,y:215.31},{x:291.75,y:153.59},{x:306.87,y:188.54},{x:512.71,y:153.59},{x:503.16,y:76.24},{x:515.19,y:116.65},{x:466.66,y:215.88},{x:497.22,y:188.54}
      ];

      // SVG is approx 794.57 x 1396.65
      const cx = 397; 
      const cy = 698;
      // Height is ~1400. To fit radius ~70, scale = 70/700 = 0.1
      const scale = 0.11; 

      svgPoints.forEach(p => {
          add((p.x - cx) * scale, (p.y - cy) * scale);
      });
  }
  // 4: Crosshair (Strategically sharp)
  else if (shapeIndex === 4) {
      // Circle
      for(let i=0; i<90; i++) {
          const a = (i/90)*Math.PI*2;
          add(Math.cos(a)*55, Math.sin(a)*55);
      }
      // Cross lines (with gaps in middle)
      const gap = 15;
      const len = 80;
      // Top
      addPath([{x:0, y:-len}, {x:0, y:-gap}], 15);
      // Bottom
      addPath([{x:0, y:gap}, {x:0, y:len}], 15);
      // Left
      addPath([{x:-len, y:0}, {x:-gap, y:0}], 15);
      // Right
      addPath([{x:gap, y:0}, {x:len, y:0}], 15);
      // Center dot
      add(0,0);
  }
  // 5: Flower (Visually stunning)
  else if (shapeIndex === 5) {
      const svgPoints = [
        {x:534.19, y:431.61}, {x:543.41, y:481.15}, {x:550.38, y:570.01}, {x:546.69, y:524.42}, {x:550.86, y:388.28}, 
        {x:506.1, y:378.07}, {x:468.25, y:361.2}, {x:469.25, y:318.61}, {x:513.1, y:300.25}, {x:561.91, y:299.25}, 
        {x:605.82, y:318.61}, {x:641.72, y:352.77}, {x:597.77, y:370.57}, {x:669.09, y:318.75}, {x:719.6, y:299.41}, 
        {x:776.99, y:289.2}, {x:829.57, y:284.03}, {x:889.28, y:280.03}, {x:999.71, y:282.03}, {x:943.32, y:279.03}, 
        {x:1056.1, y:289.2}, {x:1110, y:299.41}, {x:1158.49, y:320.61}, {x:1206.97, y:353.07}, {x:1165.49, y:385.78}, 
        {x:684.01, y:253.52}, {x:648.43, y:286.91}, {x:593.72, y:454.34}, {x:574.39, y:419.11}, {x:499.6, y:1526.09}, 
        {x:508.74, y:1479.51}, {x:543.41, y:1239.56}, {x:515.82, y:1429.1}, {x:522.69, y:1382.39}, {x:535.19, y:1285.56}, 
        {x:528.32, y:1333.97}, {x:547.69, y:1187.23}, {x:553.38, y:1091.6}, {x:551.38, y:1143.14}, {x:556, y:1051.24}, 
        {x:556.38, y:1002.72}, {x:558.27, y:954.21}, {x:560.19, y:912.7}, {x:561.19, y:869.28}, {x:561.19, y:826.86}, 
        {x:561.88, y:782.59}, {x:560.88, y:740.07}, {x:558.27, y:697.56}, {x:556.38, y:655.04}, {x:553.38, y:617.24}, 
        {x:598.43, y:1017.19}, {x:632.01, y:991.67}, {x:667.6, y:968.45}, {x:692.6, y:943.44}, {x:713.41, y:911.71}, 
        
        // Paths / Ellipses centroids
        {x:751.46, y:874.44}, {x:780.59, y:891.25}, {x:816.36, y:899.66}, {x:846.27, y:875.84}, {x:869.68, y:843.47}, 
        {x:878.72, y:802.81}, {x:869.36, y:763.3}, {x:1058.1, y:400.07}, {x:1112.49, y:395.78}, {x:719.6, y:220.05}, 
        {x:755.18, y:177.63}, {x:781.6, y:137.85}, {x:800.99, y:85.04}, {x:788.49, y:33.63}, {x:737.17, y:12.5}, 
        {x:682.59, y:21.13}, {x:635.93, y:49.5}, {x:604.32, y:85.04}, {x:577.27, y:120.8}, {x:553.19, y:169.28}, 
        {x:541.69, y:207.99}, {x:537.41, y:253.52}, {x:490.01, y:270.66}, {x:455.85, y:249.52}, {x:403.53, y:220.05}, 
        {x:350.93, y:195.49}, {x:300.56, y:173.28}, {x:811.03, y:768.24}, {x:792.94, y:808.26}, {x:762.22, y:836.4}, 
        {x:671.16, y:600.95}, {x:642.43, y:557.93}, {x:616.82, y:507.93}, {x:445.53, y:403.08}, {x:401.23, y:427.61}, 
        {x:356.94, y:450}, {x:303.56, y:477.15}, {x:256.83, y:495.42}, {x:202.82, y:518.56}, {x:148.81, y:532.93}, 
        {x:94.8, y:545.43}, {x:40.79, y:541.43}, {x:241.37, y:154.76}, {x:187.51, y:142.26}, {x:125.65, y:131.76}, 
        {x:63.79, y:133.3}, {x:23.38, y:165.13}, {x:45.66, y:198.49}, {x:94.8, y:235.55}, {x:148.81, y:265.45}, 
        {x:202.82, y:284.03}, {x:264.74, y:299.7}, {x:323.34, y:311.55}, {x:381.94, y:325.22}, {x:421.03, y:350.77}, 
        {x:369.44, y:357.07}, {x:310.84, y:369.57}, {x:256.83, y:382.07}, {x:202.82, y:397.78}, {x:148.81, y:415.58}, 
        {x:94.8, y:441.84}, {x:51.29, y:466.57}, {x:12.5, y:506.06}, {x:841.26, y:735.78}, {x:717.32, y:623.91}, 
        {x:769.1, y:613.46}, {x:790.41, y:566.01}, {x:777.91, y:507.92}, {x:749.67, y:462.5}, {x:711.6, y:427.6}, 
        {x:677.54, y:390.57}, {x:695.6, y:353.28}, {x:752.17, y:366.28}, {x:812.93, y:375.57}, {x:872.15, y:381.78}, 
        {x:920.23, y:388.07}, {x:966.4, y:394.07}, {x:1012.21, y:400.07}
      ];

      // SVG is approx 1219x1538.
      const cx = 610; 
      const cy = 770;
      // Adjusted scale slightly smaller than logo because this SVG is taller
      const scale = 0.11; 

      svgPoints.forEach(p => {
          add((p.x - cx) * scale, (p.y - cy) * scale);
      });
  }
  // 6: Heart (Emotionally resonant)
  else if (shapeIndex === 6) {
      for (let i = 0; i < 150; i++) {
          const t = (i / 150) * Math.PI * 2;
          const x = 16 * Math.pow(Math.sin(t), 3);
          const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
          add(x * 5, y * 5);
      }
  }
  // 7: ZG Logo (Great ideas deserve great execution)
  else {
      // Corrected coordinates from SVG provided
      const svgPoints = [
          {x:49.99,y:12.5},{x:85.58,y:12.5},{x:121.16,y:12.5},{x:156.74,y:12.5},{x:192.32,y:12.5},{x:227.9,y:12.5},{x:263.49,y:12.5},{x:299.07,y:12.5},{x:334.65,y:12.5},{x:370.23,y:12.5},{x:405.81,y:12.5},{x:441.4,y:12.5},{x:476.98,y:12.5},{x:512.56,y:12.5},{x:548.14,y:12.5},{x:583.72,y:12.5},{x:619.31,y:12.5},{x:654.89,y:12.5},{x:726.05,y:12.5},{x:690.47,y:12.5},{x:761.63,y:12.5},{x:797.22,y:12.5},{x:832.8,y:12.5},{x:868.38,y:12.5},{x:903.96,y:12.5},
          {x:12.5,y:1121.34},{x:34.82,y:1093.63},{x:57.15,y:1065.92},{x:79.47,y:1038.21},{x:101.8,y:1010.51},{x:124.12,y:982.8},{x:146.44,y:955.09},{x:168.77,y:927.38},{x:191.09,y:899.67},{x:213.41,y:871.97},{x:235.74,y:844.26},{x:258.06,y:816.55},
          {x:302.71,y:761.14},{x:280.39,y:788.84},{x:325.03,y:733.43},{x:347.36,y:705.72},{x:369.68,y:678.01},{x:392,y:650.3},{x:414.33,y:622.6},{x:436.65,y:594.89},{x:458.98,y:567.18},{x:481.1,y:539.31},{x:503.43,y:511.6},{x:525.75,y:483.9},{x:548.07,y:456.19},{x:570.4,y:428.48},{x:592.72,y:400.77},{x:615.04,y:373.06},{x:637.37,y:345.36},{x:659.69,y:317.65},{x:682.02,y:289.94},{x:704.34,y:262.23},{x:726.66,y:234.53},{x:748.99,y:206.82},{x:771.31,y:179.11},{x:793.63,y:151.4},{x:815.96,y:123.69},{x:838.28,y:95.99},{x:860.61,y:68.28},{x:882.93,y:40.57},
          {x:47.72,y:1121.86},{x:83.3,y:1121.86},{x:118.89,y:1121.86},{x:154.47,y:1121.86},{x:190.05,y:1121.86},{x:225.63,y:1121.86},{x:261.21,y:1121.86},{x:296.8,y:1121.86},{x:332.38,y:1121.86},{x:367.96,y:1121.86},{x:403.54,y:1121.86},{x:439.12,y:1121.86},{x:474.71,y:1121.86},{x:510.29,y:1121.86},{x:545.87,y:1121.86},{x:581.45,y:1121.86},{x:617.03,y:1121.86},{x:652.62,y:1121.86},
          {x:689.3,y:644.3},{x:724.88,y:644.3},{x:760.46,y:644.3},{x:796.05,y:644.3},{x:831.63,y:644.3},{x:867.21,y:644.3},{x:902.79,y:644.3},{x:938.37,y:644.3},{x:973.96,y:644.3},{x:1009.54,y:644.3},{x:1045.12,y:644.3},{x:1080.7,y:644.3},{x:1116.28,y:644.3},{x:1151.87,y:644.3},{x:1187.45,y:644.3},
          {x:689.47,y:1120.49},{x:725.46,y:1115.3},{x:760.45,y:1108.11},{x:796.63,y:1097.63},{x:831.63,y:1086.13},{x:865.21,y:1072.63},{x:897.43,y:1057.08},{x:928.87,y:1042.21},{x:958.35,y:1024.01},{x:986.33,y:1001.67},{x:1014.32,y:979.09},{x:1040.31,y:956.09},{x:1063.3,y:930.38},{x:1084.2,y:903.67},{x:1102.78,y:876.47},{x:1119.27,y:848.26},{x:1137.18,y:816.55},{x:1150.87,y:783.84},{x:1164.37,y:751.13},{x:1177.37,y:716.13},{x:1184.37,y:679.13},
          {x:1180.82,y:461.52},{x:1174.53,y:427.31},{x:1164.51,y:394.15},{x:1150.11,y:361.36},{x:1135.49,y:328.51},{x:1119.94,y:297.49},{x:1101,y:268.66},{x:1080.56,y:241.6},{x:1059.04,y:216.65},{x:1036.02,y:193.46},{x:1009.98,y:168.01},{x:981.89,y:146.38},{x:953.74,y:124.92},{x:923.26,y:103.37},{x:889.3,y:87.09}
      ];

      // SVG is approx 1200x1134. We center it and scale it down to fit the ~140px view area.
      const cx = 600;
      const cy = 567;
      const scale = 0.12; 

      svgPoints.forEach(p => {
          add((p.x - cx) * scale, (p.y - cy) * scale);
      });
  }

  // Resample / Fill logic
  const result: { x: number; y: number }[] = [];
  if (points.length === 0) {
      for(let i=0; i<DOT_COUNT; i++) result.push({x:0, y:0});
      return result;
  }

  // Use consistent indices for cleaner morph
  for (let i = 0; i < DOT_COUNT; i++) {
      const index = Math.floor((i / DOT_COUNT) * points.length);
      result.push(points[index % points.length]);
  }
  
  return result;
}

export const DotMorph: React.FC<DotMorphProps> = ({ progress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderScale, setRenderScale] = useState(1.9);
  
  // Update scale based on screen width
  useEffect(() => {
    const handleResize = () => {
        // Desktop: 1.9 (Requested +20%)
        // Mobile: 1.3 (Fits screen width)
        setRenderScale(window.innerWidth < 768 ? 1.3 : 1.9);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setSize = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
    };
    setSize();
    window.addEventListener('resize', setSize);

    // --- Transition Logic ---
    // Update: Phrases end earlier to allow for static delay at the end
    const PHRASE_END = 0.75; 
    const PHRASE_COUNT = 7; 
    const STEP = PHRASE_END / PHRASE_COUNT; 

    let currentShapeIdx = 0;
    let nextShapeIdx = 0;
    let morphT = 0;

    if (progress < PHRASE_END) {
        // Determine raw position in the phrase sequence
        const rawIndex = progress / STEP;
        currentShapeIdx = Math.floor(rawIndex);
        nextShapeIdx = currentShapeIdx + 1;
        
        // Ensure index doesn't exceed bounds (0-6)
        if (nextShapeIdx > 6) nextShapeIdx = 6;
        if (currentShapeIdx > 6) currentShapeIdx = 6;
        
        // Local progress within the current phrase (0 to 1)
        const localProgress = rawIndex - currentShapeIdx;
        
        // --- STICKY / SNAP LOGIC ---
        const HOLD_THRESHOLD = 0.55; 
        
        if (localProgress < HOLD_THRESHOLD) {
            // Stay on current shape
            morphT = 0;
        } else {
            // Transition to next shape
            morphT = (localProgress - HOLD_THRESHOLD) / (1 - HOLD_THRESHOLD);
        }
        
    } else {
        // Final transition to ZG Logo
        // We want the morph to complete by progress=0.9, leaving 0.9-1.0 as static
        currentShapeIdx = 6;
        nextShapeIdx = 7;
        
        // Map range [0.75, 0.9] to [0, 1]
        morphT = (progress - PHRASE_END) / (0.9 - PHRASE_END);
    }
    
    // Clamp
    morphT = Math.max(0, Math.min(1, morphT));

    // Improved Easing: Sine In-Out
    const ease = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
    const smoothedT = ease(morphT);

    const startPoints = getShapePoints(currentShapeIdx);
    const endPoints = getShapePoints(nextShapeIdx);

    let animationFrameId: number;
    let time = 0;

    const render = () => {
        time += 0.02;
        const width = canvas.width / (window.devicePixelRatio || 1);
        const height = canvas.height / (window.devicePixelRatio || 1);
        
        const cx = width / 2;
        const cy = height / 2;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#000000';

        // Transition Turbulence
        const turbulence = Math.sin(smoothedT * Math.PI);
        const scatterStrength = 3 * turbulence; 

        for (let i = 0; i < DOT_COUNT; i++) {
            const p1 = startPoints[i];
            const p2 = endPoints[i];

            // 1. Linear Interpolation & Scaling
            // Apply renderScale here to make dots responsive without recalculating geometry
            const rawLx = p1.x + (p2.x - p1.x) * smoothedT;
            const rawLy = p1.y + (p2.y - p1.y) * smoothedT;
            
            const lx = rawLx * renderScale;
            const ly = rawLy * renderScale;

            // 2. Arc / Curve movement (Scaled)
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            let arcX = 0;
            let arcY = 0;
            
            if (dist > 10) {
                 const angle = Math.atan2(dy, dx);
                 const perp = angle + (i % 2 === 0 ? Math.PI/2 : -Math.PI/2);
                 const arcAmount = Math.sin(smoothedT * Math.PI) * (dist * 0.2);
                 arcX = Math.cos(perp) * arcAmount * renderScale;
                 arcY = Math.sin(perp) * arcAmount * renderScale;
            }

            // 3. Chaos / Noise
            const noiseX = Math.sin(i * 43.13 + time) * scatterStrength;
            const noiseY = Math.cos(i * 12.32 + time) * scatterStrength;

            // 4. Floating / Breathing
            const floatX = Math.sin(time * 0.5 + i * 0.1) * 2;
            const floatY = Math.cos(time * 0.3 + i * 0.15) * 2;
            
            const finalX = cx + lx + arcX + noiseX + floatX;
            const finalY = cy + ly + arcY + noiseY + floatY;

            ctx.beginPath();
            // UNIFORM SIZE FOR ALL DOTS
            const sizeBase = 2.2;
            const sizePulse = 1 + (turbulence * 0.2); 
            
            ctx.arc(finalX, finalY, sizeBase * sizePulse, 0, Math.PI * 2);
            ctx.fill();
        }
        
        animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
        window.removeEventListener('resize', setSize);
        cancelAnimationFrame(animationFrameId);
    };
  }, [progress, renderScale]); // Re-run effect when scale changes

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full pointer-events-none"
    />
  );
};
