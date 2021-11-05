import style from "./style.module.css"
import {Canvas} from "@react-three/fiber"

import MyMesh from "../myMesh"
import { Suspense } from "react"


export default function ThreeSceen() {
    return (
        <div className={style.container}>
            <Canvas>
                <Suspense fallback={null}>
                    <MyMesh />
                </Suspense>
            </Canvas>
        </div>
    )
}
