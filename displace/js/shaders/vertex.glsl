uniform float time;
varying float progress;
varying vec2 vUv;
// varying vec2 vUv1;
varying vec3 vPosition;

// uniform sampler2D texture1;
// uniform sampler2D texture2;
// uniform vec2 pixels;
// uniform vec2 uvRate1;

void main()
{
    vUv=uv;
    // vec2 _uv=uv-.5;
    // vUv1=_uv;
    // vUv1*=uvRate1.xy;
    
    // vUv1+=.5;
    
    vPosition=position;
    
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}