/**
 * @author flyingDonkey / http://www.flyingdonkey.es/
 */

module.exports = {
  uniforms: {
    "tDiffuse": {type: "t", value: 0, texture: null},
    "brightness": { type: "f", value: 0.0 },
    "contrast": { type: "f", value: 0.0 },
    "hue": {type: "f", value: 0.0},
    "saturation": {type: "f", value: 0.0},
    "sharpRadius": 	{ type: "v2", value: new THREE.Vector2( 0.0, 0.0 )  },
    "sharpStrength": { type: "f", value: 0.0 }
  },

  vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
    " vUv = vec2( uv.x, uv.y );",
    " gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
  ].join("\n"),

  fragmentShader: [
    "#define ITERATIONS 4.0",
    "uniform sampler2D tDiffuse;",
    "uniform float brightness;",
    "uniform float contrast;",
    "uniform float hue;",
    "uniform float saturation;",
    "uniform vec2 sharpRadius;",
    "uniform float sharpStrength;",
    "varying vec2 vUv;",

    "float random( vec3 scale, float seed ) { ",
    " return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed );",
    "}",

    "void main() {",
    " vec4 color = texture2D(tDiffuse, vUv);",


    "/* ············································································· */",
    "/* BRIGHT / CONTRAST Adjustment */",

    " color.rgb += brightness;",
    " if (contrast > 0.0) {",
    "   color.rgb = (color.rgb - 0.5) / (1.0 - contrast) + 0.5;",
    " } else {",
    "   color.rgb = (color.rgb - 0.5) * (1.0 + contrast) + 0.5;",
    " }",


    "/* ············································································· */",
    "/* HUE adjustment, wolfram alpha: RotationTransform[angle, {1, 1, 1}][{x, y, z}] */",

    "float angle = hue * 3.14159265;",
    "float s = sin(angle), c = cos(angle);",
    "vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;",
    "float len = length(color.rgb);",
    "color.rgb = vec3(",
    " dot(color.rgb, weights.xyz),",
    " dot(color.rgb, weights.zxy),",
    " dot(color.rgb, weights.yzx)",
    ");",


    "/* ············································································ */",
    "/* SATURATION Adjustment */",

    "float average = (color.r + color.g + color.b) / 3.0;",
    "if (saturation > 0.0) {",
    " color.rgb += (average - color.rgb) * (1.0 - 1.0 / (1.001 - saturation));",
    "} else {",
    " color.rgb += (average - color.rgb) * (-saturation);",
    "}",


    "/* ············································································ */",
    "/* SHARPEN Adjustment */",

    "vec4 colorBlurred = vec4( 0.0 );",
    "float total = 0.0;",

    "float offset = random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );",

    "for ( float t = -ITERATIONS; t <= ITERATIONS; t ++ ) {",

    " float percent = ( t + offset - 0.5 ) / ITERATIONS;",
    " float weight = 1.0 - abs( percent );",

    " colorBlurred += texture2D( tDiffuse, vUv + sharpRadius * percent ) * weight;",
    " total += weight;",

    "}",

    "colorBlurred = colorBlurred / total;",
    "color = mix(colorBlurred, color, 1.0 + sharpStrength);",

    "/* ············································································ */",
    "/* OUTPUT */",

    "gl_FragColor = color;",

    "}"
  ].join("\n")
};
