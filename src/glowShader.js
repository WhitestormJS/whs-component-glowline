import * as THREE from 'three';

export const glowShader = (params) => ({
	uniforms: {
		color: {value: new THREE.Color(params.glow.color)},
		normalIntensity: {value: params.glow.normalIntensity / 100},
		cameraIntensity: {value: params.glow.cameraIntensity / 100},
		glowMargin: {value: params.glow.margin},
		glowPow: {value: params.glow.pow}
	},

	vertexShader: `
		varying vec3 vNormal1;
		varying vec3 vNormal2;

		uniform float cameraIntensity;

		void main() {
			vNormal1 = normalize(normalMatrix * normal);
			vNormal2 = normalize(normal);

			vec4 cameraPosition = projectionMatrix * modelViewMatrix * vec4(0.0, 0.0, 10.0, 0.0);
			float cameraDistance = distance(position.xyz, cameraPosition.xyz);

		  gl_Position = projectionMatrix * modelViewMatrix * 
		  	vec4(position + normal * cameraIntensity * cameraDistance, 1.0);
		}
	`,

	fragmentShader: `
		varying vec3 vNormal1;
		varying vec3 vNormal2;

		uniform vec3 color;
		uniform float normalIntensity;
		uniform float glowMargin;
		uniform float glowPow;

		void main() {
			float intensity = 
				pow(glowMargin - dot(vNormal1, vec3(0.0, 0.0, 1.0)), glowPow) * normalIntensity
				+ pow(glowMargin - dot(vNormal2, vec3(0.0, 0.0, 1.0)), glowPow) * (1.00 - normalIntensity);

			gl_FragColor = vec4(color, 1.0) * intensity;
		}
	`,

	// side: THREE.BackSide,
	transparent: true,
	blending: THREE.AdditiveBlending
});
