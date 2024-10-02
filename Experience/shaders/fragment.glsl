precision mediump float;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uOpacity;
uniform vec3 uColor;
uniform vec3 uLightPosition;
uniform vec3 uCameraPosition;
uniform vec3 uAmbientLightColor;
uniform vec3 uDiffuseLight;
uniform vec3 uSpecularLight;
uniform float uShininess;


void main()
{
    vec3 normal = normalize(vNormal);

    vec3 lightDir = normalize(uLightPosition - vPosition);

    vec3 viewDir = normalize(uCameraPosition - vPosition);

    vec3 ambient = uAmbientLightColor * uColor;

    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = uDiffuseLight * diff * uColor;

    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
    vec3 specular = uSpecularLight * spec * uColor;

    vec3 color = (diffuse + ambient + specular);
    color = vec3(uOpacity * color);

    gl_FragColor = vec4(color, 1.0);
}