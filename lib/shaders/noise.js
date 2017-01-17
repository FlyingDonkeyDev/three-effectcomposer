/**
 * @author flyingDonkey / http://www.flyingdonkey.es/
 */

module.exports = {
    uniforms: {
        "tDiffuse": { type: "t", value: 0, texture: null },
        "amount": { type: "f", value: 0.5 },
    },
    vertexShader: [
        "varying vec2 vUv;",
        "void main() {",
        "vUv = vec2( uv.x, uv.y );",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"
    ].join("\n"),
    fragmentShader: [
        "uniform sampler2D tDiffuse;",
        "uniform float amount;",
        "varying vec2 vUv;",
        "float rand(vec2 co) {",
        "return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
        "}",

        "void main() {",
        "vec4 color = texture2D( tDiffuse, vUv );",

        "float diff = (rand(vUv) - 0.5) * amount;",
        "color.r += diff;",
        "color.g += diff;",
        "color.b += diff;",

        "gl_FragColor = vec4( min( vec3( 1.0 ), color.rgb ), color.a );",
        "}"
    ].join("\n")
};