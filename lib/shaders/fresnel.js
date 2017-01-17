/**
 * @author flyingDonkey / http://www.flyingdonkey.es/
 */

module.exports = {
  uniforms: {

    "mRefractionRatio": { value: 1.02 },
    "mFresnelBias": { value: 0.0 },
    "mFresnelPower": { value: 10.0 },
    "mFresnelScale": { value: 10.0 },
    "alpha": { type: 'f', value: 1.0 }

  },

  vertexShader: [

    "uniform float mRefractionRatio;",
    "uniform float mFresnelBias;",
    "uniform float mFresnelScale;",
    "uniform float mFresnelPower;",

    "varying float vReflectionFactor;",

    "void main() {",

    "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
    "vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",

    "vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );",

    "vec3 I = worldPosition.xyz - cameraPosition;",

    "vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), mFresnelPower );",

    "gl_Position = projectionMatrix * mvPosition;",

    "}"

  ].join( "\n" ),

  fragmentShader: [
    "varying float vReflectionFactor;",
    "uniform float alpha;",

    "void main() {",

    " vec4 reflectedColor = vec4( 255, 255, 255, alpha );",
    " vec4 refractedColor = vec4( 255, 255, 255, 0.2 );",

    " gl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );",
    "}"

  ].join( "\n" )
};
