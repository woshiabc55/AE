export const conceptVert = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`

export const conceptFrag = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uStyle;
uniform float uMood;
uniform float uLighting;
uniform float uColorIntensity;
uniform float uFogDensity;
uniform float uCameraHeight;
uniform float uCameraAngle;
uniform float uTimeOfDay;
uniform float uParticleDensity;
uniform float uGrainAmount;
uniform float uVignetteStrength;
uniform float uDepthOfField;

#define PI 3.14159265
#define MAX_STEPS 80
#define MAX_DIST 50.0
#define SURF_DIST 0.005

float hash(float n) { return fract(sin(n) * 43758.5453); }
float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n = i.x + i.y * 157.0 + 113.0 * i.z;
    return mix(
        mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
            mix(hash(n + 157.0), hash(n + 158.0), f.x), f.y),
        mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
            mix(hash(n + 270.0), hash(n + 271.0), f.x), f.y),
        f.z
    );
}

float noise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n = i.x + i.y * 157.0;
    return mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
               mix(hash(n + 157.0), hash(n + 158.0), f.x), f.y);
}

float fbm(vec3 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

float fbm2(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) {
        v += a * noise2(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

float terrain(vec2 p) {
    float t = uStyle;
    float h = 0.0;

    if (t < 1.5) {
        h = fbm(vec3(p * 0.3, 0.0)) * 3.0 - 0.5;
        h += sin(p.x * 0.1) * 0.5;
        h = max(h, -0.3);
    } else if (t < 2.5) {
        h = fbm(vec3(p * 0.2, 1.0)) * 4.0;
        h += sin(p.x * 0.05 + p.y * 0.08) * 2.0;
        h = max(h, 0.0);
        h = pow(h, 1.2);
    } else if (t < 3.5) {
        h = fbm(vec3(p * 0.15, 2.0)) * 5.0;
        h += sin(p.x * 0.08) * cos(p.y * 0.06) * 1.5;
        h = max(h, -0.2);
    } else if (t < 4.5) {
        h = fbm(vec3(p * 0.1, 3.0)) * 2.0 - 0.8;
        h = max(h, -0.5);
        h += smoothstep(2.0, 5.0, length(p)) * (-1.0);
    } else if (t < 5.5) {
        h = sin(p.x * 0.3) * cos(p.y * 0.2) * 0.5;
        h += fbm(vec3(p * 0.4, 4.0)) * 0.3;
        h = max(h, -2.0);
    } else if (t < 6.5) {
        h = fbm(vec3(p * 0.2, 5.0)) * 6.0;
        h = max(h, 0.0);
        h = pow(h, 1.3);
    } else if (t < 7.5) {
        h = fbm(vec3(p * 0.05, 6.0)) * 0.3 - 0.1;
    } else {
        h = fbm(vec3(p * 0.15, 7.0)) * 3.0;
        h += sin(p.x * 0.1 + p.y * 0.07) * 1.0;
        h = max(h, -0.3);
    }

    return h;
}

float map(vec3 p) {
    float t = terrain(p.xz);
    float h = p.y - t;

    if (uStyle > 4.5 && uStyle < 5.5) {
        h = min(h, p.y + 2.0);
    }

    return h;
}

vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.01, 0.0);
    return normalize(vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
    ));
}

float calcAO(vec3 p, vec3 n) {
    float occ = 0.0;
    float sca = 1.0;
    for (int i = 0; i < 5; i++) {
        float h = 0.01 + 0.12 * float(i) / 4.0;
        float d = map(p + h * n);
        occ += (h - d) * sca;
        sca *= 0.85;
    }
    return clamp(1.0 - 3.0 * occ, 0.0, 1.0);
}

float calcShadow(vec3 p, vec3 lightDir) {
    float t = 0.05;
    float res = 1.0;
    for (int i = 0; i < 32; i++) {
        float h = map(p + lightDir * t);
        res = min(res, 8.0 * h / t);
        if (h < 0.001) return 0.0;
        t += clamp(h, 0.05, 0.5);
        if (t > 10.0) break;
    }
    return clamp(res, 0.0, 1.0);
}

vec3 getSkyColor(vec3 rd, vec3 sunDir) {
    float sunDot = max(dot(rd, sunDir), 0.0);
    float t = uTimeOfDay;

    vec3 dayTop = vec3(0.3, 0.5, 0.85);
    vec3 dayBot = vec3(0.7, 0.8, 0.95);
    vec3 sunsetTop = vec3(0.15, 0.1, 0.3);
    vec3 sunsetBot = vec3(0.9, 0.4, 0.15);
    vec3 nightTop = vec3(0.02, 0.02, 0.08);
    vec3 nightBot = vec3(0.05, 0.05, 0.12);

    vec3 topCol = mix(dayTop, sunsetTop, smoothstep(0.6, 0.8, t));
    topCol = mix(topCol, nightTop, smoothstep(0.8, 0.95, t));
    vec3 botCol = mix(dayBot, sunsetBot, smoothstep(0.6, 0.8, t));
    botCol = mix(botCol, nightBot, smoothstep(0.8, 0.95, t));

    float y = rd.y * 0.5 + 0.5;
    vec3 sky = mix(botCol, topCol, y);

    sky += pow(sunDot, 64.0) * vec3(1.0, 0.9, 0.7) * 2.0;
    sky += pow(sunDot, 8.0) * vec3(1.0, 0.6, 0.3) * 0.3;

    if (uStyle > 4.5 && uStyle < 5.5) {
        float uw = smoothstep(0.0, -0.5, rd.y);
        sky = mix(sky, vec3(0.0, 0.05, 0.15), uw);
        sky += vec3(0.0, 0.02, 0.05) * (1.0 - y);
    }

    if (uStyle > 6.5 && uStyle < 7.5) {
        float stars = pow(hash2(rd.xz * 500.0), 20.0);
        sky += stars * vec3(1.0, 0.95, 0.9) * step(0.1, rd.y);
    }

    return sky;
}

vec3 getTerrainColor(vec3 p, vec3 n, float h) {
    float t = uStyle;
    vec3 col;

    if (t < 1.5) {
        vec3 asphalt = vec3(0.12, 0.12, 0.14);
        vec3 concrete = vec3(0.25, 0.24, 0.22);
        col = mix(asphalt, concrete, smoothstep(-0.2, 0.5, h));
        col += vec3(0.05, 0.05, 0.08) * smoothstep(0.8, 1.5, h);
        float wet = smoothstep(0.0, -0.1, h);
        col *= 1.0 - wet * 0.3;
    } else if (t < 2.5) {
        vec3 neon1 = vec3(0.0, 1.0, 0.8);
        vec3 neon2 = vec3(1.0, 0.0, 0.5);
        vec3 neon3 = vec3(0.2, 0.4, 1.0);
        vec3 base = vec3(0.05, 0.05, 0.08);
        col = base;
        float stripe = sin(p.x * 2.0 + p.z * 1.5) * 0.5 + 0.5;
        col += mix(neon1, neon2, stripe) * 0.15 * smoothstep(0.3, 1.0, h);
        col += neon3 * 0.1 * smoothstep(1.5, 3.0, h);
        float glow = pow(max(0.0, sin(p.x * 5.0 + uTime * 2.0)), 8.0);
        col += neon2 * glow * 0.1;
    } else if (t < 3.5) {
        vec3 grass = vec3(0.15, 0.35, 0.1);
        vec3 rock = vec3(0.35, 0.3, 0.25);
        vec3 snow = vec3(0.85, 0.88, 0.92);
        col = mix(grass, rock, smoothstep(0.5, 2.0, h));
        col = mix(col, snow, smoothstep(2.5, 4.0, h));
        float moss = fbm(vec3(p.xz * 2.0, 10.0));
        col += vec3(0.05, 0.1, 0.0) * moss;
    } else if (t < 4.5) {
        vec3 sand = vec3(0.76, 0.65, 0.45);
        vec3 dune = vec3(0.85, 0.72, 0.5);
        vec3 rock = vec3(0.5, 0.4, 0.3);
        col = mix(sand, dune, fbm(vec3(p.xz * 0.5, 20.0)));
        col = mix(col, rock, smoothstep(0.3, 1.0, h));
        float ripple = sin(p.x * 8.0 + p.z * 6.0) * 0.02;
        col += ripple;
    } else if (t < 5.5) {
        vec3 deepSea = vec3(0.0, 0.05, 0.12);
        vec3 shallow = vec3(0.0, 0.15, 0.25);
        vec3 sand = vec3(0.3, 0.28, 0.2);
        col = mix(deepSea, shallow, smoothstep(-2.0, -0.5, h));
        col = mix(col, sand, smoothstep(-0.3, 0.0, h));
        float caustic = pow(fbm(vec3(p.xz * 3.0 + uTime * 0.5, 30.0)), 2.0);
        col += vec3(0.05, 0.1, 0.15) * caustic;
    } else if (t < 6.5) {
        vec3 darkGrass = vec3(0.05, 0.12, 0.03);
        vec3 moss = vec3(0.08, 0.18, 0.04);
        vec3 dirt = vec3(0.2, 0.15, 0.08);
        col = mix(darkGrass, moss, fbm(vec3(p.xz * 1.5, 40.0)));
        col = mix(col, dirt, smoothstep(0.3, 1.0, h));
        float leaf = sin(p.x * 20.0) * sin(p.z * 15.0) * 0.5 + 0.5;
        col += vec3(0.0, 0.03, 0.0) * leaf;
    } else if (t < 7.5) {
        vec3 nebula1 = vec3(0.1, 0.0, 0.2);
        vec3 nebula2 = vec3(0.0, 0.05, 0.2);
        vec3 dust = vec3(0.15, 0.1, 0.05);
        col = mix(nebula1, nebula2, fbm(vec3(p.xz * 0.3, 50.0)));
        col = mix(col, dust, smoothstep(-0.1, 0.1, h));
    } else {
        vec3 stone = vec3(0.4, 0.35, 0.28);
        vec3 moss = vec3(0.2, 0.25, 0.12);
        vec3 marble = vec3(0.7, 0.68, 0.62);
        col = mix(stone, moss, fbm(vec3(p.xz * 1.0, 60.0)));
        col = mix(col, marble, smoothstep(1.0, 2.5, h));
        float crack = smoothstep(0.48, 0.5, abs(fbm2(p.xz * 3.0) - 0.5));
        col *= 1.0 - crack * 0.3;
    }

    return col;
}

vec3 getLightDir() {
    float t = uTimeOfDay;
    float angle = mix(0.1, 1.4, t);
    float l = uLighting;

    vec3 sunDir = normalize(vec3(
        cos(angle * PI) * 0.8,
        sin(angle * PI),
        0.3
    ));

    if (l > 0.5 && l < 1.5) sunDir = normalize(vec3(0.5, 0.8, 0.3));
    else if (l > 1.5 && l < 2.5) sunDir = normalize(vec3(0.3, 0.9, 0.2));
    else if (l > 2.5 && l < 3.5) sunDir = normalize(vec3(-0.4, 0.7, 0.5));
    else if (l > 3.5 && l < 4.5) sunDir = normalize(vec3(0.6, 0.3, 0.7));
    else if (l > 4.5 && l < 5.5) sunDir = normalize(vec3(0.0, 0.9, 0.1));
    else if (l > 5.5) sunDir = normalize(vec3(-0.2, 0.6, 0.4));

    return sunDir;
}

vec3 applyColorGrade(vec3 col) {
    float ci = uColorIntensity;
    float gray = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(gray), col, ci);

    float t = uStyle;
    if (t < 1.5) {
        col *= vec3(0.9, 0.92, 1.0);
    } else if (t < 2.5) {
        col *= vec3(1.0, 0.85, 0.95);
        col += vec3(0.02, 0.0, 0.03);
    } else if (t < 3.5) {
        col *= vec3(1.0, 0.95, 0.85);
    } else if (t < 4.5) {
        col *= vec3(1.05, 0.95, 0.8);
    } else if (t < 5.5) {
        col *= vec3(0.8, 0.9, 1.1);
    } else if (t < 6.5) {
        col *= vec3(0.85, 1.0, 0.85);
    } else if (t < 7.5) {
        col *= vec3(0.9, 0.85, 1.1);
    } else {
        col *= vec3(1.0, 0.95, 0.85);
    }

    return col;
}

float particles(vec2 uv, float t) {
    float d = uParticleDensity;
    if (d < 0.01) return 0.0;

    float v = 0.0;
    for (int i = 0; i < 20; i++) {
        float fi = float(i);
        vec2 pos = vec2(
            hash(fi * 13.7) * 2.0 - 1.0,
            hash(fi * 7.3) * 2.0 - 1.0
        );
        pos.x += sin(t * 0.3 + fi) * 0.1;
        pos.y -= t * (0.02 + hash(fi * 3.1) * 0.03);
        pos.y = fract(pos.y * 0.5 + 0.5) * 2.0 - 1.0;

        float dist = length(uv - pos);
        float size = 0.003 + hash(fi * 17.3) * 0.005;
        v += smoothstep(size, 0.0, dist) * d;
    }
    return clamp(v, 0.0, 1.0);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);

    float camH = mix(0.5, 3.0, uCameraHeight);
    float camA = uCameraAngle * PI * 0.5;

    vec3 ro = vec3(0.0, camH, -6.0);
    ro.xz = rot2(camA * 0.3) * ro.xz;

    vec3 ta = vec3(0.0, camH * 0.5, 0.0);
    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
    vec3 vv = cross(uu, ww);

    float focalLen = 1.8;
    float dofOffset = uDepthOfField * 0.003;
    vec2 jitter = vec2(
        hash2(gl_FragCoord.xy + fract(uTime * 7.0)) - 0.5,
        hash2(gl_FragCoord.xy + fract(uTime * 13.0)) - 0.5
    ) * dofOffset;

    vec3 rd = normalize(uv.x * uu + uv.y * vv + focalLen * ww);

    vec3 sunDir = getLightDir();
    vec3 col = getSkyColor(rd, sunDir);

    float t = 0.0;
    float hitT = -1.0;
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        if (d < SURF_DIST) { hitT = t; break; }
        if (t > MAX_DIST) break;
        t += d * 0.7;
    }

    if (hitT > 0.0) {
        vec3 p = ro + rd * hitT;
        vec3 n = getNormal(p);
        float h = p.y;

        float diff = max(dot(n, sunDir), 0.0);
        float spec = pow(max(dot(reflect(rd, n), sunDir), 0.0), 32.0);
        float ao = calcAO(p, n);
        float shadow = calcShadow(p + n * 0.02, sunDir);

        vec3 terrainCol = getTerrainColor(p, n, h);

        float ambient = 0.15;
        vec3 ambientCol = vec3(0.4, 0.45, 0.6);

        col = terrainCol * (ambient * ambientCol + diff * shadow * vec3(1.0, 0.95, 0.85));
        col += spec * shadow * vec3(1.0, 0.95, 0.85) * 0.2;
        col *= ao;

        float fogDist = hitT;
        float fog = 1.0 - exp(-fogDist * uFogDensity * 0.15);
        vec3 fogCol = getSkyColor(normalize(rd.xz.xyy), sunDir) * 0.5;
        col = mix(col, fogCol, fog);

        if (uLighting > 2.5 && uLighting < 3.5) {
            float godRay = pow(max(dot(rd, sunDir), 0.0), 4.0);
            col += vec3(1.0, 0.9, 0.7) * godRay * 0.15 * shadow;
        }

        if (uStyle > 4.5 && uStyle < 5.5) {
            float depth = hitT / MAX_DIST;
            col *= 1.0 - depth * 0.5;
            col += vec3(0.0, 0.03, 0.06) * depth;
        }
    }

    col = applyColorGrade(col);

    float pVal = particles(uv, uTime);
    if (uStyle > 1.5 && uStyle < 2.5) {
        col += vec3(0.0, 1.0, 0.8) * pVal * 0.3;
        col += vec3(1.0, 0.0, 0.5) * pVal * 0.2;
    } else if (uStyle > 3.5 && uStyle < 4.5) {
        col += vec3(0.8, 0.7, 0.5) * pVal * 0.15;
    } else if (uStyle > 5.5 && uStyle < 6.5) {
        col += vec3(0.0, 0.05, 0.0) * pVal * 0.3;
    } else if (uStyle > 6.5 && uStyle < 7.5) {
        col += vec3(1.0, 0.95, 0.9) * pVal * 0.5;
    } else {
        col += vec3(0.8, 0.8, 0.85) * pVal * 0.2;
    }

    float vig = 1.0 - uVignetteStrength * length(uv * 0.6);
    vig = smoothstep(0.0, 1.0, vig);
    col *= vig;

    float grain = (hash2(gl_FragCoord.xy + fract(uTime * 100.0)) - 0.5) * uGrainAmount;
    col += grain;

    float m = uMood;
    if (m > 0.5 && m < 1.5) {
        col = pow(col, vec3(0.9));
        col *= 1.1;
    } else if (m > 1.5 && m < 2.5) {
        col = pow(col, vec3(1.05));
    } else if (m > 2.5 && m < 3.5) {
        col *= vec3(0.9, 0.92, 1.0);
    } else if (m > 3.5 && m < 4.5) {
        col = pow(col, vec3(1.1));
        col *= 0.85;
    } else if (m > 4.5 && m < 5.5) {
        col *= 1.15;
        col = pow(col, vec3(0.85));
    } else if (m > 5.5) {
        col *= vec3(0.8, 0.85, 1.0);
        col = pow(col, vec3(1.15));
        col *= 0.8;
    }

    col = clamp(col, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
}
`
