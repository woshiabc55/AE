export const mandelboxVert = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`

export const mandelboxFrag = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

#define MAX_STEPS 64
#define MAX_DIST 15.0
#define SURF_DIST 0.002
#define MB_SCALE 2.0

mat2 rot2(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
}

vec2 mandelboxDE(vec3 z0) {
    vec3 z = z0;
    float dr = 1.0;
    float r;
    float trap = 1e10;

    for (int i = 0; i < 10; i++) {
        z = clamp(z, -1.0, 1.0) * 2.0 - z;

        r = length(z);
        if (r < 0.5) {
            z *= 4.0;
            dr *= 4.0;
        } else if (r < 1.0) {
            float t2 = 1.0 / (r * r);
            z *= t2;
            dr *= t2;
        }

        z = MB_SCALE * z + z0;
        dr = dr * abs(MB_SCALE) + 1.0;
        trap = min(trap, dot(z, z));
    }

    r = length(z);
    return vec2(r / dr, sqrt(trap));
}

vec2 raymarch(vec3 ro, vec3 rd) {
    float t = 0.0;
    float trap = 0.0;
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * t;
        vec2 d = mandelboxDE(p);
        if (d.x < SURF_DIST) return vec2(t, d.y);
        if (t > MAX_DIST) break;
        t += d.x * 0.8;
        trap = d.y;
    }
    return vec2(-1.0, trap);
}

vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
        mandelboxDE(p + e.xyy).x - mandelboxDE(p - e.xyy).x,
        mandelboxDE(p + e.yxy).x - mandelboxDE(p - e.yxy).x,
        mandelboxDE(p + e.yyx).x - mandelboxDE(p - e.yyx).x
    ));
}

float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float voronoi(vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    float d = 1.0;
    for (int x = -1; x <= 1; x++)
    for (int y = -1; y <= 1; y++) {
        vec2 n = vec2(float(x), float(y));
        vec2 o = vec2(hash21(ip + n), hash21(ip + n + 100.0));
        o = 0.5 + 0.5 * sin(6.2831 * o + uTime * 0.3);
        d = min(d, length(n + o - fp));
    }
    return d;
}

float porcelainPattern(vec3 p) {
    float t = 0.0;

    float v1 = voronoi(p.xz * 3.5);
    t += smoothstep(0.04, 0.14, v1) * 0.5;

    float v2 = voronoi(p.xy * 7.0);
    t += smoothstep(0.03, 0.1, v2) * 0.3;

    float v3 = voronoi(p.yz * 14.0);
    t += smoothstep(0.02, 0.08, v3) * 0.2;

    vec2 bp = fract(p.xz * 2.0);
    float border = smoothstep(0.02, 0.03, min(bp.x, bp.y))
                 * smoothstep(0.02, 0.03, min(1.0 - bp.x, 1.0 - bp.y));
    t = mix(t, 1.0, border * 0.3);

    float wave = sin(p.x * 12.0 + p.z * 8.0) * sin(p.y * 10.0 + p.z * 6.0);
    t += smoothstep(0.0, 0.5, wave) * 0.15;

    return clamp(t, 0.0, 1.0);
}

float calcAO(vec3 p, vec3 n) {
    float occ = 0.0;
    float sca = 1.0;
    for (int i = 0; i < 4; i++) {
        float h = 0.01 + 0.1 * float(i) / 3.0;
        float d = mandelboxDE(p + h * n).x;
        occ += (h - d) * sca;
        sca *= 0.9;
    }
    return clamp(1.0 - 3.0 * occ, 0.0, 1.0);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);

    float camDist = 4.5;
    float rotY = (uMouse.x - 0.5) * 1.2 + uTime * 0.02;
    float rotX = (uMouse.y - 0.5) * 0.6 + 0.35;

    vec3 ro = vec3(
        camDist * sin(rotY) * cos(rotX),
        camDist * sin(rotX),
        camDist * cos(rotY) * cos(rotX)
    );

    vec3 ta = vec3(0.0);
    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
    vec3 vv = cross(uu, ww);
    vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.5 * ww);

    vec3 col = vec3(0.94, 0.93, 0.91);

    vec2 gridUv = gl_FragCoord.xy / uResolution;
    float gx = abs(fract(gridUv.x * 50.0) - 0.5);
    float gy = abs(fract(gridUv.y * 50.0) - 0.5);
    float grid = smoothstep(0.48, 0.5, gx) + smoothstep(0.48, 0.5, gy);
    col -= grid * 0.035;

    vec2 hit = raymarch(ro, rd);

    if (hit.x > 0.0) {
        vec3 p = ro + rd * hit.x;
        vec3 n = getNormal(p);

        vec3 lightDir = normalize(vec3(0.7, 1.0, 0.5));
        float diff = max(dot(n, lightDir), 0.0);
        float spec = pow(max(dot(reflect(rd, n), lightDir), 0.0), 40.0);
        float ao = calcAO(p, n);
        float fres = pow(1.0 - max(dot(-rd, n), 0.0), 3.0);

        float pattern = porcelainPattern(p);

        vec3 porcelainWhite = vec3(0.93, 0.91, 0.87);
        vec3 porcelainBlue = vec3(0.10, 0.20, 0.36);
        vec3 porcelainMidBlue = vec3(0.16, 0.30, 0.48);

        vec3 baseColor = mix(porcelainBlue, porcelainWhite, pattern);
        baseColor = mix(baseColor, porcelainMidBlue, fres * 0.25);

        col = baseColor * (0.22 + 0.78 * diff) * ao;
        col += spec * 0.35 * porcelainWhite;
        col += fres * 0.08 * porcelainMidBlue;

        float gray = dot(col, vec3(0.299, 0.587, 0.114));
        col = mix(vec3(gray), col, 0.45);
    }

    vec2 ruv = gridUv - 0.5;
    float regMark = 0.0;
    regMark += smoothstep(0.003, 0.001, abs(ruv.x)) * step(abs(ruv.y), 0.025);
    regMark += smoothstep(0.003, 0.001, abs(ruv.y)) * step(abs(ruv.x), 0.025);
    float cr = length(ruv);
    regMark += smoothstep(0.004, 0.002, abs(cr - 0.025)) * step(cr, 0.03);
    col += regMark * 0.25;

    for (int i = 0; i < 4; i++) {
        float cx = float(mod(float(i), 2.0)) * 0.9 + 0.05;
        float cy = float(i / 2) * 0.9 + 0.05;
        vec2 d = abs(gridUv - vec2(cx, cy));
        float cm = smoothstep(0.003, 0.001, d.x) * step(d.y, 0.035);
        cm += smoothstep(0.003, 0.001, d.y) * step(d.x, 0.035);
        col += cm * 0.25;
    }

    float vig = 1.0 - 0.2 * length(uv * 0.7);
    col *= vig;

    float noise = hash21(gl_FragCoord.xy + fract(uTime)) * 0.015;
    col += noise - 0.0075;

    gl_FragColor = vec4(col, 1.0);
}
`
