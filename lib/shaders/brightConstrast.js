/**
 * @author flyingDonkey / http://www.flyingdonkey.es/
 */

module.exports = {
    uniforms: {
        "tDiffuse": { type: "t", value: 0, texture: null },
        "brightness": { type: "f", value: 0.0 },
        "contrast": { type: "f", value: 0.0 }
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
        "uniform float brightness;",
        "uniform float contrast;",
        "varying vec2 vUv;",
        "void main() {",
            "vec4 color = texture2D(tDiffuse, vUv);",

            "color.rgb += brightness;",
            "if (contrast > 0.0) {",
                "color.rgb = (color.rgb - 0.5) / (1.0 - contrast) + 0.5;",
            "} else {",
                "color.rgb = (color.rgb - 0.5) * (1.0 + contrast) + 0.5;",
            "}",

            "gl_FragColor = color;",
        "}"
    ].join("\n")
};