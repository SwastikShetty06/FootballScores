
    import React, { useRef, useEffect } from 'react';
    import * as THREE from 'three';

    const ThreeBackground = () => {
      const mountRef = useRef(null);

      useEffect(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(width, height);
        renderer.setClearColor(0x0f172a, 0.7); // dark navy with transparency
        mountRef.current.appendChild(renderer.domElement);

      // Minimal: no pitch lines, just floating team logos

        // Fetch Premier League team logos and animate them
        let logoPlanes = [];
        fetch('https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=English%20Premier%20League')
          .then(res => res.json())
          .then(data => {
            const teams = data.teams || [];
            logoPlanes = teams.slice(0, 6).map((team, i) => {
              const texture = new THREE.TextureLoader().load(team.strBadge);
              const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.45 });
              const plane = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.32), mat);
              // Arrange in a circle around the center
              const angle = (i / 6) * Math.PI * 2;
              plane.position.x = Math.cos(angle) * 1.5;
              plane.position.y = Math.sin(angle) * 1.1;
              plane.position.z = 0.2;
              scene.add(plane);
              return { mesh: plane, baseAngle: angle, radius: 1.5 + Math.random() * 0.2, speed: 0.08 + Math.random() * 0.04 };
            });
          });

        let frameId;
        const animate = () => {
          // Animate team logos in a circle (minimal, slow)
          if (logoPlanes.length > 0) {
            const t = Date.now() * 0.0003;
            logoPlanes.forEach((lp, i) => {
              const angle = lp.baseAngle + t * lp.speed;
              lp.mesh.position.x = Math.cos(angle) * lp.radius;
              lp.mesh.position.y = Math.sin(angle) * lp.radius;
              lp.mesh.rotation.z = angle + Math.PI / 2;
            });
          }
          renderer.render(scene, camera);
          frameId = requestAnimationFrame(animate);
        };
        animate();

        // Handle resize
        const handleResize = () => {
          const w = window.innerWidth;
          const h = window.innerHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        return () => {
          cancelAnimationFrame(frameId);
          window.removeEventListener('resize', handleResize);
          mountRef.current.removeChild(renderer.domElement);
        };
      }, []);

      return (
        <div
          ref={mountRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -2,
            pointerEvents: 'none',
          }}
        />
      );
    };

    export default ThreeBackground;
