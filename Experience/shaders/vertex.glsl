
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    vNormal = normal;
    vPosition = position;
    vUv = uv;
}