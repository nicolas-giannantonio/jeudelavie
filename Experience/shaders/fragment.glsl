precision mediump float;
varying vec2 vUv;

uniform float uOpacity;

void main()
{
    vec3 color = vec3(uOpacity);
    gl_FragColor = vec4(color, 1.0);
}