import "./myCustomMaterial"
import { useRef, useEffect } from "react"
import * as THREE from "three"
import { useThree, useLoader } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import gsap from "gsap";



export default function index() {
    const myMaterialRef = useRef(null);
    const Sceen = useThree();
    const thorTexture = useTexture("https://images.unsplash.com/photo-1636105143566-ee660d4c5933?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2370&q=80")
    
    let stateOfSceen = "small"
    let isAnimating = false

    const getSceenSize = () => {
        const cameraPosZ = Sceen.camera.position.z;
        const cameraAspect = Sceen.camera.aspect;
        const cameraFov = Sceen.camera.fov * (Math.PI / 180);

        const height = cameraPosZ * Math.tan(cameraFov / 2) * 2;
        const width = height * cameraAspect;

        return {
            width: width,
            height: height
        }
    }

    const updateMesh = (el) => {
        const sizes = el.getBoundingClientRect()
        const sceenSizes = getSceenSize()


        const elHeight = sizes.height;
        const elWidth = sizes.width;
        const windowSizeX = window.innerWidth;

        const sceenToWinRatio = sceenSizes.width / windowSizeX;
        
        const meshScaleX = elWidth * sceenToWinRatio;
        const meshScaleY = elHeight * sceenToWinRatio;

        const elCenterX = sizes.left + elWidth / 2;
        const elCenterY = sizes.top + elHeight / 2;

        const meshPosX = (elCenterX - windowSizeX/2) * sceenToWinRatio;
        const meshPosY =sceenSizes.height/2 -(elCenterY * sceenToWinRatio);

        const color = window.getComputedStyle(el).backgroundColor
        const rgb = color.substring(color.indexOf("(") + 1 , color.indexOf(")")); 

        console.log(rgb)

        
        myMaterialRef.current.uniforms.uThorTexture.value = thorTexture;
        

        myMaterialRef.current.uniforms.uTextureSize.value= new THREE.Vector2(thorTexture.image.width,thorTexture.image.height)
        myMaterialRef.current.uniforms.uColor.value = new THREE.Vector3(255, 1, 43)
        myMaterialRef.current.uniforms.uPosition.value = new THREE.Vector2(meshPosX, meshPosY)
        myMaterialRef.current.uniforms.uScale.value = new THREE.Vector3(meshScaleX,meshScaleY)
        myMaterialRef.current.uniforms.uSceenSize.value = new THREE.Vector2(sceenSizes.width,sceenSizes.height)
    }

    const toFullScreen = () => {
        isAnimating = true;
        gsap.to(myMaterialRef.current.uniforms.uProgress,1,{
            value:1,
            onComplete:()=>{
                isAnimating = false;
                stateOfSceen = "full"
                document.querySelector(".closeBtn").style.opacity = 1;
            }
        })
    }
    const toSmall = () => {
        isAnimating = true;
        gsap.to(myMaterialRef.current.uniforms.uProgress,1,{
            value:0,
            onComplete:()=>{
                isAnimating = false;
                stateOfSceen = "small"
                document.querySelector(".closeBtn").style.opacity = 0;
            }
        })
    }

    useEffect(() => {
        const items = document.querySelectorAll(".item")
        const closeBtn = document.querySelector(".closeBtn")
        updateMesh(items[0]);


        const handleOpen = (e) => {
            if(isAnimating || stateOfSceen == "full") return
            updateMesh(e.target)
            toFullScreen();
        }
        const handleClose = () => {
            if(isAnimating || stateOfSceen == "small") return
            toSmall();
        }


        items.forEach(item => {
            item.addEventListener("click", handleOpen)
        })
        closeBtn.addEventListener("click", handleClose)

        return () => {
            items.forEach(item => {
                item.removeEventListener("click", handleOpen)
            })
            closeBtn.removeEventListener("click", handleClose)
        }
    }, [])

    return (
            <mesh>
                <planeBufferGeometry args={[1,1, 18,18]}/>
                <myCustomMaterial ref={myMaterialRef}/>
            </mesh>
    )
}
