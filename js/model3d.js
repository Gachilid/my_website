import * as THREE from '../libs/three/build/three.module.js';
import { OrbitControls } from '../libs/three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from '../libs/three/examples/jsm/loaders/OBJLoader.js';

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("3d-model-container");

    // 场景
    const scene = new THREE.Scene();

    // 相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(0, 2, 5);

    // 渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // 加载模型
    const objLoader = new OBJLoader();
    let currentModel;

    function loadModel(path) {
        if (currentModel) {
            scene.remove(currentModel);
        }
        objLoader.load(
            path,
            (object) => {
                currentModel = object;
                scene.add(object);

                // 调整模型位置
                const box = new THREE.Box3().setFromObject(object);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                box.getCenter(object.position).multiplyScalar(-1);

                // 调整相机
                const maxDim = Math.max(size.x, size.y, size.z);
                camera.position.set(0, 0, maxDim * 2.5);
                controls.target.copy(center);
                controls.update();
            },
            (xhr) => console.log(`模型加载进度: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`),
            (error) => console.error("模型加载失败", error)
        );
    }

    // 初始加载模型
    loadModel('https://github.com/Gachilid/my_website/releases/download/models/my_model1.obj');

    // 事件绑定
    document.getElementById("fullscreen-btn").addEventListener("click", () => {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        }
    });

    document.getElementById("switch-model-btn").addEventListener("click", () => {
        loadModel('./assets/models/my_model2.obj'); // 切换到另一个模型
    });

    document.getElementById("fov-range").addEventListener("input", (event) => {
        camera.fov = event.target.value;
        camera.updateProjectionMatrix();
    });

    document.getElementById("far-range").addEventListener("input", (event) => {
        camera.far = parseFloat(event.target.value);
        camera.updateProjectionMatrix();
        console.log(`更新相机 far 值: ${camera.far}`);
    });

    document.getElementById("distance-range").addEventListener("input", (event) => {
        const distance = parseFloat(event.target.value);
        camera.position.z = distance;
        console.log(`更新相机距离: ${camera.position.z}`);
    });

    document.getElementById("home-btn").addEventListener("click", () => {
        window.location.href = './main.html'; // 返回主页面
    });

    // 渲染循环
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    // 窗口大小调整
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
