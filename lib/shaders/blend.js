/**
 * @author flyingDonkey / http://www.flyingdonkey.es/
 */

module.exports = {
    uniforms: {
        "tDiffuse1": { type: "t", value: 0, texture: null },
        "tDiffuse2": { type: "t", value: 1, texture: null },
        "tAlpha": { type: "t", value: 1, texture: null }
    },
    vertexShader: [
        "varying vec2 vUv;",
        "void main() {",
        "vUv = vec2( uv.x, uv.y );",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"
    ].join("\n"),
    fragmentShader: [
        "uniform sampler2D tDiffuse1;",
        "uniform sampler2D tDiffuse2;",
        "uniform sampler2D tAlpha;",
        "varying vec2 vUv;",
        "float rand(vec2 co) { return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }",
        "void main() {",
        "vec4 texel1 = texture2D( tDiffuse1, vUv );",
        "vec4 texel2 = texture2D( tDiffuse2, vUv );",
        "vec4 alpha = texture2D( tAlpha, vUv );",
        "vec3 c1 = texel1.rgb;",
        "vec3 c2 = texel2.rgb;",

        "vec3 color = mix( c1, c2, alpha.a);",

        "gl_FragColor = vec4( color, 1 );",
        "}"
    ].join("\n")
};