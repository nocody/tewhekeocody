


vec2 N22 (vec2 p){
    vec3 a = fract(p.xyx*vec3(123.34, 234.34, 345.65));
    a += dot(a, a+34.45);
    return fract(vec2(a.x*a.y, a.y*a.z));
}

void main(out vec4 gl_Fragcolor, in vec2 gl_FragCoord) {
    vec2 uv = (2.0*gl_FragCoord-u_resolution.xy)/u_resolution.y;

    float m = N22(vUv).x;
    float t = u_time;

    for (float i=0.0;  i<50.0; i++) {
        vec2 n = N22(vec2(i));
        vec2 p = sin(n*t);
    }
    vec3 col = vec3(m);

    gl_Fragcolor = vec4(col, 1.0);
}