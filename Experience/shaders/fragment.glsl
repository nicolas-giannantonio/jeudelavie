precision mediump float;
varying vec2 vUv;

uniform float uOpacity;
uniform vec3 uColor;
uniform vec2 uResolution;

void main()
{
    vec3 color = vec3(uOpacity * uColor);
    gl_FragColor = vec4(color, 1.0);
}