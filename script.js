import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';

class PrismGeometry extends THREE.ExtrudeGeometry {
    constructor(vertices, height) {
        super(new THREE.Shape(vertices), {depth: height, bevelEnabled: false});
    }
}

function main() {
    // const recorder = new CCapture({
    //     verbose: false,
    //     display: true,
    //     framerate: 20,
    //     quality: 100,
    //     format: 'webm',
    //     timeLimit: 15,
    //     frameLimit: 0,
    //     autoSaveTime: 0
    // });
    //
    // function setupButtons(){
    //     const $start = document.getElementById('start');
    //     const $stop = document.getElementById('stop');
    //     $start.addEventListener('click', e => {
    //         e.preventDefault();
    //         recorder.start();
    //         $start.style.display = 'none';
    //         $stop.style.display = 'block';
    //     }, false);
    //
    //     $stop.addEventListener('click', e => {
    //         e.preventDefault();
    //         recorder.stop();
    //         $stop.style.display = 'none';
    //         recorder.save();
    //     }, false);
    // }

    // setupButtons();

    const canvas = document.querySelector("#c");
    const renderer = new THREE.WebGLRenderer({canvas});

    const loader = new THREE.TextureLoader();

    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0xCCFFFF);

    const fov = 45;
    const aspect = 2;
    const near = 0.1;
    const far = 5000;
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(-10, 60, 130);
    camera.lookAt(0, 0, 0);

    let light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.position.set(0, 50, 0);
    light.lookAt(0, 0, 0);

    scene.add(light);

    const stageWidth = 100, stageHeight = 1, stageDepth = 100;
    let stageGeometry = new THREE.BoxGeometry(stageWidth, stageHeight, stageDepth, 2, 2, 2);
    let stageMaterial = new THREE.MeshBasicMaterial({map: loader.load("resources/runwayMissing.jpg")});
    let stageMesh = new THREE.Mesh(stageGeometry, stageMaterial);

    stageMesh.position.y = -1 * stageHeight / 2;

    scene.add(stageMesh);

    const targetWidth = 7, targetHeight = 1, targetDepth = 42;
    let targetGeometry = new THREE.BoxGeometry(targetWidth,targetHeight,targetDepth,2,2,2);
    let targetMaterial = new THREE.MeshBasicMaterial({map: loader.load("resources/runway.jpg")});
    let target = new THREE.Mesh(targetGeometry, targetMaterial);

    target.position.set(-25, 40, -20);

    scene.add(target);

    function makePlaneModel() {
        let planeModel = new THREE.Object3D();

        const planeBodyRadius = 2, planeBodyLength = 20;
        let planeBodyGeometry = new THREE.CylinderGeometry(planeBodyRadius, planeBodyRadius, planeBodyLength);
        let planeBodyMaterial = new THREE.MeshPhongMaterial({color: 0xE0E0E0, emissive: 0x808080});
        let planeBodyMesh = new THREE.Mesh(planeBodyGeometry, planeBodyMaterial);
        planeBodyMesh.rotation.x = -90 * Math.PI / 180;
        planeModel.add(planeBodyMesh);

        let rudderCoordA = new THREE.Vector2(0, 0);
        let rudderCoordB = new THREE.Vector2(2, 0);
        let rudderCoordC = new THREE.Vector2(0, 3);
        const planeRudderWidth = 0.5;
        let planeRudderGeometry = new PrismGeometry([rudderCoordA, rudderCoordB, rudderCoordC], planeRudderWidth);
        let planeRudderMaterial = new THREE.MeshPhongMaterial({color: 0xE0E0E0, emissive: 0x808080});
        let planeRudderMesh = new THREE.Mesh(planeRudderGeometry, planeRudderMaterial);
        planeRudderMesh.rotation.y = -90 * Math.PI / 180;
        planeRudderMesh.position.y = 2;
        planeRudderMesh.position.z = -planeBodyLength / 2;
        planeModel.add(planeRudderMesh);

        let wingCoordA = new THREE.Vector2(0, 0);
        let wingCoordB = new THREE.Vector2(10, 0);
        let wingCoordC = new THREE.Vector2(0, 4);
        const planeWingWidth = 0.5;
        let planeWingGeometry = new PrismGeometry([wingCoordA, wingCoordB, wingCoordC], planeWingWidth);
        let planeWingMaterial = new THREE.MeshPhongMaterial({color: 0xE0E0E0, emissive: 0x808080});
        let planeWingLeftMesh = new THREE.Mesh(planeWingGeometry, planeWingMaterial);
        planeWingLeftMesh.rotation.x = 90 * Math.PI / 180;
        planeWingLeftMesh.position.x = -planeBodyRadius;
        planeWingLeftMesh.position.z = -2;
        planeModel.add(planeWingLeftMesh);

        let planeWingRightMesh = new THREE.Mesh(planeWingGeometry, planeWingMaterial);
        planeWingRightMesh.rotation.x = -90 * Math.PI / 180;
        planeWingRightMesh.rotation.z = -180 * Math.PI / 180;
        planeWingRightMesh.position.x = planeBodyRadius;
        planeWingRightMesh.position.z = -2;
        planeModel.add(planeWingRightMesh);

        const planeCockpitRadius = 2;
        let planeCockpitGeometry = new THREE.SphereGeometry(planeCockpitRadius, 20, 20);
        let planeCockpitMaterial = new THREE.MeshPhongMaterial({color: 0xE0E0E0, emissive: 0x808080});
        let planeCockpitMesh = new THREE.Mesh(planeCockpitGeometry, planeCockpitMaterial);
        planeCockpitMesh.position.z = planeBodyLength / 2;
        planeModel.add(planeCockpitMesh);

        planeModel.scale.set(0.5, 0.5, 0.5);

        return planeModel;
    }

    let plane2 = makePlaneModel();
    let plane1 = makePlaneModel();

    let planes = [plane1, plane2];

    planes.forEach(plane => scene.add(plane));

    const planePath = new THREE.SplineCurve([
        new THREE.Vector2(30, 30),
        new THREE.Vector2(10, 35),
        new THREE.Vector2(-2, 25),
        new THREE.Vector2(-10, 10),
        new THREE.Vector2(-25, 30),
        new THREE.Vector2(-30, 0),
        new THREE.Vector2(-25, -30),
        new THREE.Vector2(-10, -35),
        new THREE.Vector2(7, -25),
        new THREE.Vector2(25, -30),
        new THREE.Vector2(35, 7),
        new THREE.Vector2(30, 30),
    ]);

    function drawPath() {
        const planePathPoints = planePath.getPoints(50);

        let pathGeometry = new THREE.BufferGeometry().setFromPoints(planePathPoints);
        let pathMaterial = new THREE.LineBasicMaterial({color: 0x000000});
        let pathMesh = new THREE.Line(pathGeometry, pathMaterial);

        pathMesh.rotation.x = 90 * Math.PI / 180;
        pathMesh.position.y = 1;

        scene.add(pathMesh);
    }

    // drawPath();

    function drawAxes() {
        let axisRadius = 0.1;
        let axisLength = 11;
        let axisTess = 48;

        let axisXMaterial = new THREE.MeshLambertMaterial({color: 0xFF0000});
        let axisYMaterial = new THREE.MeshLambertMaterial({color: 0x00FF00});
        let axisZMaterial = new THREE.MeshLambertMaterial({color: 0x0000FF});
        axisXMaterial.side = THREE.DoubleSide;
        axisYMaterial.side = THREE.DoubleSide;
        axisZMaterial.side = THREE.DoubleSide;
        let axisX = new THREE.Mesh(
            new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true),
            axisXMaterial
        );
        let axisY = new THREE.Mesh(
            new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true),
            axisYMaterial
        );
        let axisZ = new THREE.Mesh(
            new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true),
            axisZMaterial
        );
        axisX.rotation.z = -Math.PI / 2;
        axisX.position.x = axisLength / 2;
        axisX.position.y = 0.1;

        axisY.position.y = axisLength / 2 + 0.1;

        axisZ.rotation.y = -Math.PI / 2;
        axisZ.rotation.z = -Math.PI / 2;
        axisZ.position.z = axisLength / 2;
        axisZ.position.y = 0.1;

        scene.add(axisX);
        scene.add(axisY);
        scene.add(axisZ);

        let arrowX = new THREE.Mesh(
            new THREE.CylinderGeometry(0, 4 * axisRadius, 4 * axisRadius, axisTess, 1, true),
            axisXMaterial
        );
        let arrowY = new THREE.Mesh(
            new THREE.CylinderGeometry(0, 4 * axisRadius, 4 * axisRadius, axisTess, 1, true),
            axisYMaterial
        );
        let arrowZ = new THREE.Mesh(
            new THREE.CylinderGeometry(0, 4 * axisRadius, 4 * axisRadius, axisTess, 1, true),
            axisZMaterial
        );
        arrowX.rotation.z = -Math.PI / 2;
        arrowX.position.x = axisLength + axisRadius * 4 / 2;

        arrowY.position.y = axisLength + axisRadius * 4 / 2;

        arrowZ.rotation.z = -Math.PI / 2;
        arrowZ.rotation.y = -Math.PI / 2;
        arrowZ.position.z = axisLength + axisRadius * 4 / 2;

        scene.add(arrowX);
        scene.add(arrowY);
        scene.add(arrowZ);
    }

    // drawAxes()

    let targetPosition = new THREE.Vector2();

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const pixelRatio = window.devicePixelRatio;
        const width = canvas.clientWidth * pixelRatio | 0;
        const height = canvas.clientHeight * pixelRatio | 0;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render(time) {
        time *= 0.0001;

        const targetHeight = Math.abs(Math.sin(time * 10 + planes.length) * 10 + 20);

        planePath.getPointAt((time + 0.1 * planes.length) % 1, targetPosition);

        target.position.x = targetPosition.x;
        target.position.z = targetPosition.y;
        target.position.y = targetHeight;

        planes.forEach((plane, index) => {
            let planePosition = new THREE.Vector2();
            planePath.getPointAt((time + 0.1 * index) % 1, planePosition);

            const planeHeight = Math.abs(Math.sin(time * 10 + index) * 10 + 20);

            plane.position.x = planePosition.x;
            plane.position.z = planePosition.y;
            plane.position.y = planeHeight;
            plane.lookAt(target.position.x, target.position.y, target.position.z);
        });

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);
        // recorder.capture(renderer.domElement);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();
