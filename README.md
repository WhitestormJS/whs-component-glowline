# WHS.GlowLine

| Type | Physics? | WHS Version |
|------|----------|-------------|
| Component | No  | ^1.1.14     |


## Usage

```javascript
const glowline = new WHS.GlowLine({
  geometry: {
    radius: 0.1,
    delta: 0.2,
    curveDetail: 64,
    curve: new THREE.CubicBezierCurve3(
      new THREE.Vector3( -10, 0, 0 ),
      new THREE.Vector3( -5, 15, 0 ),
      new THREE.Vector3( 20, 15, 0 ),
      new THREE.Vector3( 10, 0, 0 )
    )
  },

  glow: {
    normalIntensity: 70,
    cameraIntensity: 0
  }
});

glowline.addTo(world);
```

## Options

### .geometry {...}

- **curve** - `THREE.Curve` instance. Used to create tube. _Default is `new THREE.LineCurve(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 10, 0))`. 
- **curveDetail** - `tubularSegments` of Tube geometry. _Default is **20**_
- **arcDetail** - `radiusSegments` of Tube geometry. _Default is **32**_
- **radius** - Tube (line) radius. _Default is **2**_
- **delta** - Glow shadow radius difference compared to tube. _Default is **1**_

### .glow {...}

- **normalIntensity** - Intensity of normal calculations in glow shader. _Default is **70**_
- **cameraIntensity** - Sensibility of glow to camera position. The closer camera is - the bigger glow will be. _Default is **0**_
- **margin** - Glow margin. (Used in algorythm to calculate glow). _Default is **0**_
- **pow** - Glow pow. (Used in algorythm to calculate glow). _Default is **2**_
- **color** - Glow color. _Default is **0xff0000**_

### .material {...}

**!!! Currently, only basic material is supported.**

- **color** - Color of the tube. _Default is **0xff0000**_

## The algorythm (part)

The following code is a part of fragmentShader code of glowTube object.

```glsl

void main() {
  float intensity = 
    pow(glowMargin - dot(vNormal1, vec3(0.0, 0.0, 1.0)), glowPow) * normalIntensity
    + pow(glowMargin - dot(vNormal2, vec3(0.0, 0.0, 1.0)), glowPow) * (1.00 - normalIntensity);

  gl_FragColor = vec4(color, 1.0) * intensity;
}

```

- **glowMargin** = glow.margin
- **glowPow** = glow.pow
- **normalIntensity** = glow.normalIntensity
- **vNormal1** - static normal.
- **vNormal2** - dynamic normal (changes with camera position).

## Properties

- **.native** - Three.js mesh of tube.
- **.glow** - Three.js mesh of glow. (Also is children of a tube)

[![](https://d1zjcuqflbd5k.cloudfront.net/files/acc_533906/cx2a?response-content-disposition=inline;%20filename=Shot%2011222016-11%3A20.png&Expires=1479849937&Signature=dxaEF7EDW8lxvh8ddVYuOI8Eq-7zRKcmLCWqZq1DuLQSZ1I0PRkzW-1lNQ9ymq6DnN50a57PsHynTK4-~ZaNrmKz0vAQMNsw2ZXNODpy33G0BcVjKFEBi5gxf2lRk66pRnQ1mN2gF3eDZikMe-F8UBVG8DUjz9M0ZCUATA1P9XY_&Key-Pair-Id=APKAJTEIOJM3LSMN33SA)](http://whsjs.io/whs-component-glowline/examples/)
