/**
 * @author flyingDonkey / http://www.flyingdonkey.es/
 */

module.exports = {
  uniforms: {
    "tDiffuse1": {type: "t", value: 0, texture: null}
  },
  vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
    " vUv = vec2( uv.x, uv.y );",
    " gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
  ].join("\n"),
  fragmentShader: [
    "uniform sampler2D tDiffuse1;",
    "varying vec2 vUv;",
    "float rand(vec2 co) { return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }",
    "void main() {",
    " vec4 texel1 = texture2D( tDiffuse1, vUv );",
    " gl_FragColor = texel1;",
    "}"
  ].join("\n")
};
