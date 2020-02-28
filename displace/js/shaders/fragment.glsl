uniform float time;
uniform float progress;
uniform sampler2D image;
uniform sampler2D displacement;
uniform vec4 resolution;
uniform vec3 mouse;

varying vec2 vUv;
varying vec3 vPosition;

void main(){
    
    vec4 displace=texture2D(displacement,vUv.yx);
    vec2 displacedUV=vec2(vUv.x,vUv.y);
    
    displacedUV.y=mix(vUv.y,displace.r - 0.2,.4);
    
    vec4 color=texture2D(image,displacedUV);
    
    color.r=texture2D(image,displacedUV+vec2(0.,.005)*.4).r;
    color.g=texture2D(image,displacedUV+vec2(0.,.01)*.4).g;
    color.b=texture2D(image,displacedUV+vec2(0.,.02)*.4).b;
    
    gl_FragColor=color;
}