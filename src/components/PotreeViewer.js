import React, { useEffect, useRef } from "react";
import styled from "styled-components/macro";

const Wrapper = styled.div`
  background-color: black;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
`;

// import vanillaJS Potree libs, /!\ would be best with proper ES6 import
const Potree = window.Potree;

export default function PointcloudNavigator() {
    const potreeContainerDiv = useRef(null);

    useEffect(() => {
        if (!potreeContainerDiv.current || !Potree) return;

        // initialize Potree viewer
        const viewerElem = potreeContainerDiv.current;
        const viewer = new Potree.Viewer(viewerElem);

        viewer.setEDLEnabled(true);
        viewer.setFOV(60);
        viewer.setPointBudget(1 * 1000 * 1000);
        viewer.setClipTask(Potree.ClipTask.SHOW_INSIDE);
        viewer.loadSettingsFromURL();

        viewer.setControls(viewer.orbitControls);

        console.log({ viewer });

        viewer.loadGUI(() => {
            viewer.setLanguage("en");
            document.getElementById("menu_appearance").next().show();
            viewer.toggleSidebar();
        });

        // Load and add point cloud to scene
        let url = "./example/metadata.json";
        Potree.loadPointCloud(url).then(
            (e) => {
                let pointcloud = e.pointcloud;
                let material = pointcloud.material;

                material.activeAttributeName = "rgba";
                material.minSize = 2;
                material.pointSizeType = Potree.PointSizeType.FIXED;

                viewer.scene.addPointCloud(pointcloud);
                viewer.fitToScreen();

                console.log("This is the url", url);
            },
            (e) => console.error("ERROR: ", e)
        );

        // cleanup nếu cần
        return () => {
            console.log("Unmount Potree viewer");
            // nếu Potree có method destroy thì gọi ở đây, ví dụ: viewer.dispose();
        };
    }, []);

    return (
        <div id="potree-root">
            <Wrapper ref={potreeContainerDiv} className="potree_container">
                <div id="potree_render_area"></div>
            </Wrapper>
        </div>
    );
}