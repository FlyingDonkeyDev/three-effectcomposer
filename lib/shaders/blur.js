/**
 * @author flyingDonkey / http://www.flyingdonkey.es/
 */

module.exports = {
    uniforms : {
        "tDiffuse": 	{ type: "t", value: 0, texture: null },
        "delta": 	{ type: "v2", value:new THREE.Vector2( 1, 1 )  }
    },

    vertexShader: [
        "varying vec2 vUv;",
        "void main() {",
        "vUv = vec2( uv.x, uv.y );",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"
    ].join("\n"),

    fragmentShader: [
        "#define ITERATIONS 10.0",
        "uniform sampler2D tDiffuse;",
        "uniform vec2 delta;",
        "varying vec2 vUv;",
        "float random( vec3 scale, float seed ) {",

        // use the fragment position for a different seed per-pixel
        "return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed );",
        "}",

        "void main() {",
        "vec4 color = vec4( 0.0 );",
        "float total = 0.0;",

        // randomize the lookup values to hide the fixed number of samples
        "float offset = random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );",

        "for ( float t = -ITERATIONS; t <= ITERATIONS; t ++ ) {",
        "float percent = ( t + offset - 0.5 ) / ITERATIONS;",
        "float weight = 1.0 - abs( percent );",

        "color += texture2D( tDiffuse, vUv + delta * percent ) * weight;",
        "total += weight;",
        "}",

        "gl_FragColor = color / total;",
        "}"
    ].join("\n")
};