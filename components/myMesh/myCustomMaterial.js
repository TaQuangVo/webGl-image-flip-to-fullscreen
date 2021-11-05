import { extend } from "@react-three/fiber"
import * as THREE from "three"


class MyCustomMaterial extends THREE.ShaderMaterial {
    constructor(){
        super({
            side: THREE.DoubleSide,
            uniforms:{
                uColor: {value: new THREE.Vector3(1,1,1)},
                uPosition: {value: new THREE.Vector2(0,0)},
                uScale: {value: new THREE.Vector2(1,1)},
                uProgress: {value: 0},
                uSceenSize: {value: new THREE.Vector2(0,0)},
                uJokerTexture:{value: undefined},
                uThorTexture:{value: undefined},
                uTextureSize: {value: undefined}
            },
            vertexShader:`
                varying vec2 vUv;
                varying float vProgress;

                uniform vec2 uScale;
                uniform vec2 uPosition;
                uniform float uProgress;
                uniform vec2 uSceenSize;

                void main(){
                    vUv = uv;
                    vec3 pos = position;

                    float activation = (+uv.x-uv.y+1.)/2.;
                    //float activation = uv.x;
                    //float activation = uv.y;


                    float lastToTransform = 0.5;
                    float startAt = activation * lastToTransform;
                    float progress = smoothstep(startAt, 1.0, uProgress);


                    //fliped
                    float flippedX = -pos.x;
                    pos.x = mix(pos.x,flippedX, progress);
                    pos.z += progress;


                    pos.xy = pos.xy * (uScale + (uSceenSize - uScale) * progress);
                    pos.xy = pos.xy + uPosition - uPosition * progress;

                    vProgress = progress;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader:`
                varying vec2 vUv;
                varying float vProgress;

                uniform vec3 uColor;
                uniform sampler2D uThorTexture;
                uniform vec2 uTextureSize;
                uniform vec2 uScale;
                uniform vec2 uSceenSize;

                vec2 preserveAspectRatioSlice(vec2 uv, vec2 planeSize, vec2 imageSize ){
      
                    vec2 ratio = vec2(
                        min((planeSize.x / planeSize.y) / (imageSize.x / imageSize.y), 1.0),
                        min((planeSize.y / planeSize.x) / (imageSize.y / imageSize.x), 1.0)
                    );
                    
                    vec2 sliceUvs = vec2(
                        uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
                        uv.y * ratio.y + (1.0 - ratio.y) * 0.5
                    );
                    return sliceUvs;
                }
                

                void main(){

                    vec2 uv = preserveAspectRatioSlice(vUv, uScale, uTextureSize);

                    vec2 uvFul = preserveAspectRatioSlice(vUv, uSceenSize, uTextureSize);

                    vec2 uvBlend = uv + (uvFul - uv) * vProgress;

                    vec4 texture = texture2D(uThorTexture, uvBlend);

                    gl_FragColor = vec4(texture);
                }
            `
        })
    }
    set uColor(value){ this.uniforms.uColor.value = new THREE.Vector3(value[0], value[1], value[2]) }
    get uColor(){ return this.uniforms.uColor.value}
}

extend({MyCustomMaterial})

