import * as THREE from 'three';
import {Component, MeshComponent, extend, Loop} from 'whs';
import {glowShader} from './glowShader';

@MeshComponent
class GlowLine extends Component {
  static defaults = {
    geometry: {
      curve: new THREE.LineCurve(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 10, 0)
      ),
      curveDetail: 20,
      arcDetail: 32,
      radius: 1,
      delta: 2
    },

    glow: {
      normalIntensity: 70,
      cameraIntensity: 0,
      margin: 0,
      pow: 2,
      color: 0xff0000
    },

    material: {
      color: 0xff0000
    }
  };

  constructor(params = {}) {
    super(params, GlowLine.defaults, GlowLine.instructions);

    this.build(this.params);
    super.wrap();
  }

  build(params = {}) {
    const geometry = new THREE.TubeGeometry(
      params.geometry.curve, 
      params.geometry.curveDetail, 
      params.geometry.radius, 
      params.geometry.arcDetail, 
      false
    );

    const glowGeometry = new THREE.TubeGeometry(
      params.geometry.curve, 
      params.geometry.curveDetail, 
      params.geometry.radius + params.geometry.delta, 
      params.geometry.arcDetail, 
      false
    );

    const tube = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({color: params.material.color})
    );

    const glowTube = new THREE.Mesh(
      glowGeometry,
      new THREE.ShaderMaterial(glowShader(params))
    );

    tube.add(glowTube);

    return new Promise((resolve) => {
      this.native = tube;
      this.glowNative = glowTube;
      resolve();
    });
  }

  clone() {
    return new GlowLine(this.params).copy(this);
  }
}

export {
  GlowLine as default
};
