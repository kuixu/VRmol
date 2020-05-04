/**
 * Created by Kui Xu on 2017/7/15.
 * mail: xukui.cs@gmail.com
 */
var font ;
var loader = new THREE.FontLoader();
loader.load('js/fonts/helvetiker_bold.typeface.json', function(font0) {
  font = font0;
});
var fontloader =
PDB.drawer = {
  drawLabel: function(group, pos, color, name) {
    var scope = this;
    var text = document.createElement('div');
    text.className = 'label';
    text.style.color = 'rgb(255,255,255)';
    text.style.color = 'rgb(' + atom[3][0] + ',' + atom[3][1] + ',' + atom[3][2] + ')';
    text.textContent = name;
    var label = new THREE.CSS2DObject(text);
    // var label = scope.drawSprite(name,color,18);
    label.position.copy(pos);
    PDB.GROUP[group].add(label);
  },
  drawSprite: function(message, color, fontsize) {
    var ctx, texture, sprite, spriteMaterial,
      canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    ctx.font = fontsize + "px Arial";

    // setting canvas width/height before ctx draw, else canvas is empty
    canvas.width = ctx.measureText(message).width;
    canvas.height = fontsize * 6; // fontsize * 1.5

    // after setting the canvas width/height we have to re-set font to apply!?! looks like ctx reset
    ctx.font = fontsize + "px Arial";
    ctx.fillStyle = '#' + color.getHexString();
    ctx.fillText(message, 0, fontsize);

    texture = new THREE.Texture(canvas);
    texture.minFilter = THREE.LinearFilter; // NearestFilter;
    texture.needsUpdate = true;

    spriteMaterial = new THREE.SpriteMaterial({
      map: texture
    });
    sprite = new THREE.Sprite(spriteMaterial);
    return sprite;
  },
  /**
   * before sphere visualization 2018-08-16
   * @param group
   * @param pos
   * @param text
   * @param type
   * @param color
   * @param rotation
   */
  drawTextForDesktop: function(group, pos, text, type, color, rotation) {
    var geometry = new THREE.TextGeometry(text, {
      font: font,
      size: 0.38,
      height: 0.05,
      curveSegments: 5
    });
    geometry.computeBoundingBox();
    var material = new THREE.MeshPhongMaterial({
      color: Math.random() * 0xffffff
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = text;
    var dir = new THREE.Vector3(0, 0, 0);
    // var dir = camera.position;
    camera.getWorldDirection(dir);
    mesh.userData = {
      type: type,
      name: text,
      group: group
    };
    PDB.GROUP[group].position.copy(pos);
    PDB.GROUP[group].lookAt(dir);
    PDB.GROUP[group].add(mesh);
	PDB.GROUP[group].rotation.copy(camera.rotation);
  },
  drawText: function(group, pos, text, type, color, rotation) {
    var geometry = new THREE.TextGeometry(text, {
      font: font,
      size: 0.38,
      height: 0.05,
      curveSegments: 5
    });
    geometry.computeBoundingBox();
    var material = new THREE.MeshPhongMaterial({
      color: Math.random() * 0xffffff
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = text;
    var dir = new THREE.Vector3(0, 0, 0);
    camera.getWorldDirection(dir);
    mesh.userData = {
      type: type,
      name: text,
      group: group
    };
    PDB.GROUP[group].position.copy(pos);
    PDB.GROUP[group].lookAt(dir);
    PDB.GROUP[group].add(mesh);
  },
  drawTextForDistance: function(group, pos, text, type, color, rotation) {
    var geometry = new THREE.TextGeometry(text, {
      font: font,
      size: 0.38,
      height: 0.05,
      curveSegments: 5
    });
    geometry.computeBoundingBox();
    var material = new THREE.MeshPhongMaterial({
      color: Math.random() * 0xffffff
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = text;
    // var dir = new THREE.Vector3(0, 0, 0);
    // camera.getWorldDirection(dir);
    mesh.userData = {
      type: type,
      name: text,
      group: group
    };
    mesh.position.copy(pos);
    // if(PDB.rotateAxis && PDB.rotateAxis.z > 0){
    // mesh.up.set(0,-1,0);
    // }
    // if(PDB.rotateAxis && PDB.rotateAxis.x > 0){
    // mesh.up.set(0,-1,0);
    // }
    // if(PDB.rotateAxis && PDB.rotateAxis.y > 0){
    // mesh.up.set(0,-1,0);
    // }
    //normalize the direction vector (convert to vector of length 1)



    //mesh.up.set(camera.position.x,camera.position.y,camera.position.z);

    PDB.GROUP[group].add(mesh);
    // mesh.rotateX(-PDB.rotateAxisAngle.x);
    // mesh.rotateY(-PDB.rotateAxisAngle.y);
    // mesh.rotateZ(-PDB.rotateAxisAngle.z);
    //mesh.up.set(PDB.rotateAxisAngle.x%Math.PI,(1+PDB.rotateAxisAngle.y)%Math.PI,PDB.rotateAxisAngle.z%Math.PI);

    // var updir = camera.position.clone();

    // if(PDB.rotateAxis.x){
    // updir.x = updir.x + PDB.rotateAxis.x;
    // }
    // if(PDB.rotateAxis.y){
    // updir.y = updir.y + PDB.rotateAxis.y;
    // }
    // if(PDB.rotateAxis.z){
    // updir.z = updir.z + PDB.rotateAxis.z;
    // }
    // var axis ;
    // if(PDB.rotateAxisAngle && PDB.rotateAxisAngle.x!=0){
    // axis = new THREE.Vector3(1, 0, 0);
    // updir = PDB.tool.rotateAboutWorldAxis(updir, axis, -PDB.rotateAxisAngle.x);
    // mesh.rotateX(-PDB.rotateAxisAngle.x);
    // }


    // if(PDB.rotateAxisAngle && PDB.rotateAxisAngle.y!=0){
    // axis = new THREE.Vector3(0, 1, 0);
    // updir = PDB.tool.rotateAboutWorldAxis(updir, axis, -PDB.rotateAxisAngle.y);
    // mesh.rotateY(-PDB.rotateAxisAngle.y);
    // }


    // if(PDB.rotateAxisAngle && PDB.rotateAxisAngle.z!=0){
    // axis = new THREE.Vector3(0, 0, 1);
    // updir = PDB.tool.rotateAboutWorldAxis(updir, axis, -PDB.rotateAxisAngle.z);
    // mesh.rotateZ(-PDB.rotateAxisAngle.z);
    // }
    // //mesh.up.copy(updir.normalize());
    // mesh.lookAt(updir);
    mesh.lookAt(camera.position);
	mesh.rotation.copy(camera.rotation);
    // mesh.rotateX(-PDB.rotateAxisAngle.x);
    // mesh.rotateY(-PDB.rotateAxisAngle.y);
    // mesh.rotateZ(-PDB.rotateAxisAngle.z);

    // var hex = 0xffff00;
    // var t_t = mesh.up.clone();
    // var arrowHelper = new THREE.ArrowHelper( t_t.normalize(), pos, 1, hex );

    // var hex1 = 0x2aa41d;
    // var t_t_1 = new THREE.Vector3(PDB.rotateAxisAngle.x,PDB.rotateAxisAngle.y,PDB.rotateAxisAngle.z);
    // var arrowHelper1 = new THREE.ArrowHelper( t_t_1.normalize(), pos, 2, hex1 );
    // PDB.GROUP[group].add(arrowHelper);
    // PDB.GROUP[group].add(arrowHelper1);
  },
  drawTextForAngle: function(group, pos, text, type, color, rotation) {
    var geometry = new THREE.TextGeometry(text, {
      font: font,
      size: 0.38,
      height: 0.05,
      curveSegments: 5
    });
    geometry.computeBoundingBox();
    var material = new THREE.MeshPhongMaterial({
      color: Math.random() * 0xffffff
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = text;
    mesh.userData = {
      type: type,
      name: text,
      group: group
    };
    mesh.position.copy(pos);
    mesh.lookAt(camera.position);
	mesh.rotation.copy(camera.rotation);
    PDB.GROUP[group].add(mesh);
  },  
drawTextForDistanceByDesktop: function(group, pos, text, type, color, rotation) {
    var geometry = new THREE.TextGeometry(text, {
      font: font,
      size: 0.38,
      height: 0.05,
      curveSegments: 5
    });
    geometry.computeBoundingBox();
    var material = new THREE.MeshPhongMaterial({
      color: Math.random() * 0xffffff
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = text;
    mesh.userData = {
      type: type,
      name: text,
      group: group
    };
    mesh.position.copy(pos);
    PDB.GROUP[group].add(mesh);
    mesh.lookAt(camera.position);
	mesh.rotation.copy(camera.rotation);
},
  drawTextKB: function(group, pos, text, type, color, angle) {
    var geometry = new THREE.TextGeometry(text, {
      font: font,
      size: 0.18,
      height: 0.05,
      curveSegments: 5
    });


    geometry.computeBoundingBox();
    var material = new THREE.MeshPhongMaterial({
      color: color
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = text;
    //mesh.rotation.y = angle;
    mesh.position.copy(pos);
    mesh.userData = {
      reptype: type,
      name: text,
      group: group
    };
    PDB.GROUP[group].add(mesh);

    //add box
    var width = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
    var heigh = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
    var boxBufferGeometry = new THREE.BoxBufferGeometry( width,heigh - 0.01 , 0.05 );

    var material2 = new THREE.MeshBasicMaterial({
      color: 0x808080
    });
    var mesh2 = new THREE.Mesh(boxBufferGeometry, material2);
    material2.opacity = 0;
    mesh2.material.opacity = 0;

    mesh2.name = text;
    //mesh.rotation.y = angle;
    mesh2.position.set(pos.x + width/2,pos.y + heigh/2,pos.z);
    mesh2.rotation.copy(mesh.rotation);
    mesh2.userData = {
      reptype: type,
      name: text,
      group: group
    };
    PDB.GROUP[group].add(mesh);
    PDB.GROUP[group].add(mesh2);

  },
  drawMergeStickSphereStick: function(group, preAtom, atom, nextAtom, radius) {
    var scope = this;
    var midp0 = PDB.tool.midPoint(preAtom.pos_centered, atom.pos_centered);
    var mesh0 = scope.drawStick222(group, midp0, atom.pos_centered, atom.color, radius, atom.name, false);
    var mesh1 = scope.drawSphere222(group, atom.pos_centered, atom.color, radius, atom.name, false);
    var midp1 = PDB.tool.midPoint(atom.pos_centered, nextAtom.pos_centered);
    var mesh2 = scope.drawStick222(group, atom.pos_centered, midp1, atom.color, radius, atom.name, false);
    var midp2 = PDB.tool.midPoint(midp0, midp1);
    //var mesh2 = drawStick(PDB.GROUP_MAIN, midp, atom.pos_centered, atom.color, radius, false);
    var geometry = new THREE.Geometry();
    mesh0.updateMatrix();
    geometry.merge(mesh0.geometry, mesh0.matrix);
    mesh1.updateMatrix();
    geometry.merge(mesh1.geometry, mesh1.matrix);
    mesh2.updateMatrix();
    geometry.merge(mesh2.geometry, mesh2.matrix);

    var material = new THREE.MeshPhongMaterial({
      color: atom.color,
      wireframe: false
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = atom.name;
    mesh.position.copy(midp2);
    mesh.userData = {
      group: group,
      atom: atom
    };
    PDB.GROUP[group].add(mesh);
  },
  drawMergeSphereStick: function(group, atom, nextAtom, radius) {
    var scope = this;
    var mesh0 = scope.drawSphere222(group, atom.pos_centered, atom.color, radius, atom.name, false);
    var midp0 = PDB.tool.midPoint(atom.pos_centered, nextAtom.pos_centered);
    var mesh1 = scope.drawStick222(group, atom.pos_centered, midp0, nextAtom.color, radius, atom.name, false);
    //var mesh2 = drawStick(PDB.GROUP_MAIN, midp, atom.pos_centered, atom.color, radius, false);
    var geometry = new THREE.Geometry();
    mesh0.updateMatrix();
    geometry.merge(mesh0.geometry, mesh0.matrix);
    mesh1.updateMatrix();
    geometry.merge(mesh1.geometry, mesh1.matrix);

    var material = new THREE.MeshPhongMaterial({
      color: atom.color,
      wireframe: false
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = atom.name;
    mesh.position.copy(midp0);
    mesh.userData = {
      group: group,
      atom: atom
    };
    PDB.GROUP[group].add(mesh);
  },
  drawMergeStickSphere: function(group, preAtom, atom, radius) {
    var scope = this;
    var midp0 = PDB.tool.midPoint(preAtom.pos_centered, atom.pos_centered);
    var mesh0 = scope.drawStick222(group, midp0, atom.pos_centered, atom.color, radius, atom.name, false);
    var mesh1 = scope.drawSphere222(group, atom.pos_centered, atom.color, radius, atom.name, false);

    var geometry = new THREE.Geometry();
    mesh0.updateMatrix();
    geometry.merge(mesh0.geometry, mesh0.matrix);
    mesh1.updateMatrix();
    geometry.merge(mesh0.geometry, mesh0.matrix);

    var material = new THREE.MeshPhongMaterial({
      color: atom.color,
      wireframe: false
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = atom.name;
    mesh.position.copy(midp0);
    mesh.userData = {
      group: group,
      atom: atom
    };
    PDB.GROUP[group].add(mesh);
  },

  drawLine: function(group, start, end, color) {
    var material = new THREE.LineBasicMaterial({
      color: color
    });

    var geometry = new THREE.Geometry();
    geometry.vertices.push(start, end);
    var line = new THREE.Line(geometry, material);
    line.userData = {
      group: group
    };
    PDB.GROUP[group].add(line);
  },
  drawTempLine: function(group, caid, start, end, color) {
    var material = new THREE.LineBasicMaterial({
      color: color
    });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(start, end);
    var line = new THREE.Line(geometry, material);
    line.userData = {
      group: group
    };
    line.name = caid;
    PDB.GROUP[group].add(line);
  },
  drawOneResLine: function(group, caid, start, end, color, atom) {
    var material = new THREE.LineBasicMaterial({
      color: color
    });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(start, end);
    var line = new THREE.Line(geometry, material);
    line.userData = {
      group: group,
      presentAtom: atom
    };
    line.name = caid;
    PDB.GROUP[group].add(line);
  },
  drawWholeLine: function(group, start, end, color, geometry) {
    geometry.vertices.push(start, end);
    geometry.colors.push(color);
  },
  drawDot: function(group, points, color) {
    var starsGeometry = new THREE.Geometry();
    starsGeometry.vertices.push(points);
    var starsMaterial = new THREE.PointsMaterial({
      color: color
    });
    var starField = new THREE.Points(starsGeometry, starsMaterial);

    PDB.GROUP[group].add(starField);
  },
  drawMapPoints: function(group, positions, colors, alphas) {
    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('opacity', new THREE.BufferAttribute(alphas, 1));
    geometry.computeBoundingSphere();
    var uniforms = {
      delta: {
        value: 1.0
      }
    };
    var material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: document.getElementById('vertexshader').textContent,
      fragmentShader: document.getElementById('fragmentshader').textContent,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: false
    });
    var points = new THREE.Points(geometry, material);
    points.scale = 0.5;
    points.rotation.y = -Math.PI / 2;
    PDB.GROUP[group].add(points);
    console.log("MapPoints: added in scene!");
    PDB.GROUP[PDB.GROUP_MAIN].visible = true;
  },
  drawSphere: function(group, point, color, radius, atom, addGroup, w) {
    var addGroup = PDB.tool.getValue(addGroup, true);
    var alpha = 0.5,
      beta = 0.5,
      gamma = 0.5;
    var bumpScale = 1;
    var specularShininess = Math.pow(2, alpha * 10);
    var specularColor = new THREE.Color(beta * 0.2, beta * 0.2, beta * 0.2);
    //specularColor = color;
    var diffuseColor = new THREE.Color().setHSL(alpha, 0.5, gamma * 0.5).multiplyScalar(1 - beta * 0.2);
    diffuseColor = color;

    var material = new THREE.MeshPhongMaterial({
      //map: imgTexture,
      //bumpMap: imgTexture,
      bumpScale: bumpScale,
      color: diffuseColor,
      specular: specularColor,
      reflectivity: beta,
      shininess: specularShininess
      //envMap: alphaIndex % 2 === 0 ? null : reflectionCube
    });
    //PDB.CONFIG.sphere_width, PDB.CONFIG.sphere_height

    h = w;
    var geometry = new THREE.SphereBufferGeometry(radius, w, h);
    //var sphereGeometry = new THREE.SphereGeometry( radius, 16, 16 );
    //var sphereGeometry = new THREE.IcosahedronBufferGeometry(radius, 2 );
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = atom.caid;
    mesh.position.copy(point);
    mesh.userData = {
      group: group,
      presentAtom: atom
    };
    if (addGroup) {
      PDB.GROUP[group].add(mesh);
    } else {
      return mesh;
    }
  },
  drawMutation: function(group, point, color, radius, mutation, addGroup,presentAtom) {
    var addGroup = PDB.tool.getValue(addGroup, true);
    var alpha = 0.5,
      beta = 0.5,
      gamma = 0.5;
    var bumpScale = 1;
    var specularShininess = Math.pow(2, alpha * 10);
    var specularColor = new THREE.Color(beta * 0.2, beta * 0.2, beta * 0.2);
    //specularColor = color;
    var diffuseColor = new THREE.Color().setHSL(alpha, 0.5, gamma * 0.5).multiplyScalar(1 - beta * 0.2);
    diffuseColor = color;

    var material = new THREE.MeshPhongMaterial({
      //map: imgTexture,
      //bumpMap: imgTexture,
      bumpScale: bumpScale,
      color: diffuseColor,
      specular: specularColor,
      reflectivity: beta,
      shininess: specularShininess,
      shading: THREE.SmoothShading,
      //envMap: alphaIndex % 2 === 0 ? null : reflectionCube
    });
    var geometry = new THREE.SphereBufferGeometry(radius, PDB.CONFIG.sphere_width, PDB.CONFIG.sphere_height);
    //var sphereGeometry = new THREE.SphereGeometry( radius, 16, 16 );
    //var sphereGeometry = new THREE.IcosahedronBufferGeometry(radius, 2 );
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = mutation.pos;
    mesh.position.copy(point);
    mesh.userData = {
      group: group,
      mutation: mutation,
	  presentAtom:presentAtom,
	  reptype: 'mutation'
    };
    if (addGroup) {
      PDB.GROUP[group].add(mesh);
    } else {
      return mesh;
    }
  },
  drawSphere222: function(group, point, color, radius, label, addGroup) {
    var addGroup = PDB.tool.getValue(addGroup, true);
    var geometry = new THREE.SphereGeometry(radius, 48, 24);
    var material = new THREE.MeshBasicMaterial({
      color: color
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = label;
    mesh.position.copy(point);
    mesh.userData = {
      group: group
    };
    if (addGroup) {
      PDB.GROUP[group].add(mesh);
    } else {
      return mesh;
    }
  },
  drawStick222: function(group, start, end, color, radius, label, addGroup) {
    var addGroup = PDB.tool.getValue(addGroup, true);
    var material = new THREE.MeshBasicMaterial({
      color: color
    });
    var distance = start.distanceTo(end);
    // Make the geometry (of "distance" length)
    var geometry = new THREE.CylinderGeometry(radius, radius, distance, 50, 1, false);
    // shift it so one end rests on the origin
    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, distance / 2, 0));
    // rotate it the right way for lookAt to work
    geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(90)));
    // Make a mesh with the geometry
    var mesh = new THREE.Mesh(geometry, material);
    // Position it where we want
    mesh.position.copy(start);
    // And make it point to where we want
    mesh.lookAt(end);
    mesh.userData = {
      group: group
    };
    if (addGroup) {
      PDB.GROUP[group].add(mesh);
    } else {
      return mesh;
    }
  },
  drawStick: function(group, start, end, color, radius, atom, addGroup) {
    //var material = new THREE.MeshLambertMaterial( { color: color,
    //    wireframe: false } );
    var addGroup = PDB.tool.getValue(addGroup, true);
    var material = new THREE.MeshPhongMaterial({
      color: color,
      wireframe: false
    });
    var distance = start.distanceTo(end);
    // Make the geometry (of "distance" length)
    var geometry = new THREE.CylinderGeometry(radius, radius, distance, PDB.CONFIG.stick_radius, 1, false);
    // shift it so one end rests on the origin
    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, distance / 2, 0));
    // rotate it the right way for lookAt to work
    geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(90)));
    // Make a mesh with the geometry
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = atom.caid;
    // Position it where we want
    mesh.position.copy(start);
    // And make it point to where we want
    mesh.lookAt(end);
    mesh.userData = {
      group: group,
      presentAtom: atom
    };
    if (addGroup) {
      PDB.GROUP[group].add(mesh);
    } else {
      return mesh;
    }
  },

  drawCylinder0: function(group, start, end, color, radius) {
    var path = [];
    path.push(start);
    path.push(end);

    var pathSpline = new THREE.CatmullRomCurve3(path);
    var extrudeSettings = {
      steps: 1500,
      bevelEnabled: false,
      extrudePath: pathSpline
    };
    var shape = new THREE.Shape();

    shape.moveTo(0, radius);
    shape.quadraticCurveTo(radius, radius, radius, 0);
    shape.quadraticCurveTo(radius, -radius, 0, -radius);
    shape.quadraticCurveTo(-radius, -radius, -radius, 0);
    shape.quadraticCurveTo(-radius, radius, 0, radius);
    var tick_geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var material = new THREE.MeshLambertMaterial({
      color: color,
      wireframe: false
    });
    var mesh = new THREE.Mesh(tick_geometry, material);
    mesh.userData = {
      group: group
    };
    PDB.GROUP[group].add(mesh);
  },
  drawTube: function(group, paths, color, radius, angleObj, steps, ids) {
    var pathSpline = new THREE.CatmullRomCurve3(paths);


    //Create the tube geometry from the path (2000, 80)
    var geometry = new THREE.TubeGeometry(pathSpline, steps, radius, PDB.CONFIG.tubesegment, false);
    // var geometry = new THREE.ExtrudeGeometry( shape,extrudeSettings);
    //Basic material
    //var material = new THREE.MeshBasicMaterial( { color: color} );
    //var material = new THREE.MeshLambertMaterial( { color: color} );
    // var material = new THREE.MeshPhongMaterial( { color: color} );

    var materials = [new THREE.MeshPhongMaterial({
      color: color
    })];

    materials.side = THREE.FrontSide;
    //Create a mesh
    var mesh = new THREE.Mesh(geometry, materials);
    var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
    mesh.name = atom.id;
    mesh.userData = {
      group: group,
      presentAtom: atom,
      reptype: "tube"
    };
    // if(PDB.mode === PDB.MODE_TRAVEL_VR && PDB.VRTraveMesh===""){
    //     //scene.add( mesh );
    //     PDB.VRTraveMesh = mesh;
    //     PDB.VRTravelGeometry = geometry;
    // }

    // if ((PDB.mode === PDB.MODE_TRAVEL_THREE )&& PDB.TravelGeometry==="") {
    // var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.3, wireframe: false, transparent: true } );
    // if ( PDB.GROUP[PDB.GROUP_TRAVEL]  !== undefined ) {
    // PDB.parent.remove( PDB.GROUP[PDB.GROUP_TRAVEL]  );
    // for(var key in PDB.GROUP[PDB.GROUP_TRAVEL].children){
    // PDB.GROUP[PDB.GROUP_TRAVEL].children[ key ].geometry.dispose();
    // }
    // }
    // PDB.GROUP[PDB.GROUP_TRAVEL] = THREE.SceneUtils.createMultiMaterialObject( geometry, [ materials[0], wireframeMaterial ] );
    // PDB.TravelGeometry = geometry;
    // PDB.parent.add( PDB.GROUP[PDB.GROUP_TRAVEL] );
    // var scale = PDB.TravelScale;
    // PDB.GROUP[PDB.GROUP_TRAVEL].scale.set( scale, scale, scale);
    // PDB.render.render();
    // }else{
    // //Add tube into the scene

    // }
    PDB.GROUP[group].add(mesh);
  },
  drawTubeByTravel: function(paths, ids, radius) {
    var pathSpline = new THREE.CatmullRomCurve3(paths);
    var geometry = new THREE.TubeGeometry(pathSpline, paths.length - 1, radius, PDB.CONFIG.tubesegment, false);
    var materials = []; //new THREE.MeshPhongMaterial({ color:PDB.tool.getColorByIndex(ids[0],'main') })
    var verticesIdsAndmaterialId = {};
    var materialsId = {}; //material存放在materials哪个位置{colorId:materials_key}
    for (var i in geometry.vertices) {
      var id = ids[Math.floor(i / PDB.CONFIG.tubesegment)];
      var colorId = w3m.mol[PDB.pdbId].color['main'][id];
      if (colorId != undefined && materialsId[colorId] == undefined) {
        var tc = PDB.tool.getColorByIndex(PDB.pdbId, id, 'main');
        var mater = new THREE.MeshPhongMaterial({
          color: tc
        });
        materialsId[colorId] = materials.length;
        materials.push(mater);
      }
      verticesIdsAndmaterialId[i] = materialsId[colorId];
    }
    for (var i in geometry.faces) {
      geometry.faces[i].materialIndex = verticesIdsAndmaterialId[geometry.faces[i].b];
    }
    var mesh = new THREE.Mesh(geometry, materials);
    var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
    mesh.name = atom.id;
    // var group = "chain_"+atom.chainname;
    mesh.userData = {
      group: group,
      presentAtom: atom,
      reptype: "tube"
    };

    if ((PDB.mode === PDB.MODE_TRAVEL_THREE || PDB.mode === PDB.MODE_TRAVEL_VR) && PDB.TravelGeometry === "") {

      var wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        opacity: 0.3,
        wireframe: false,
        transparent: true
      });
      if (PDB.GROUP[PDB.GROUP_TRAVEL] !== undefined) {
        PDB.parent.remove(PDB.GROUP[PDB.GROUP_TRAVEL]);
        for (var key in PDB.GROUP[PDB.GROUP_TRAVEL].children) {
          PDB.GROUP[PDB.GROUP_TRAVEL].children[key].geometry.dispose();
        }
      }
      PDB.GROUP[PDB.GROUP_TRAVEL] = THREE.SceneUtils.createMultiMaterialObject(geometry, [materials[0], wireframeMaterial]);
      PDB.TravelGeometry = geometry;
      PDB.parent.add(PDB.GROUP[PDB.GROUP_TRAVEL]);
      var scale = PDB.TravelScale;
      PDB.GROUP[PDB.GROUP_TRAVEL].scale.set(scale, scale, scale);
      PDB.render.render();
    }
    // PDB.GROUP[PDB.GROUP_TRAVEL].add( mesh );
  },
  drawFlat: function(group, paths, color, radius, angleObj, steps, ids) {
    var pathSpline = new THREE.CatmullRomCurve3(paths);
    // var frenetFrames       = pathSpline.computeFrenetFrames(steps,true);
    // frenetFrames.binormals = angleObj.binormals;
    // frenetFrames.normals   = angleObj.normals;
    // frenetFrames.tangents  = angleObj.tangents;
    var extrudeSettings = {
      steps: steps,
      bevelEnabled: true,
      extrudePath: pathSpline,
      bevelSegments: 30,
      bevelSize: 1,
      bevelThickness: 1,
      frames: angleObj, //add normal
      curveSegments: 6
    };

    var height = PDB.CONFIG.flat_height;
    var width = PDB.CONFIG.flat_width;
    var pts = [];
    var vv1 = new THREE.Vector2(-width, height);
    var vv2 = new THREE.Vector2(width, height);
    var vv3 = new THREE.Vector2(width, -height);
    var vv4 = new THREE.Vector2(-width, -height);
    pts.push(vv1);
    pts.push(vv2);
    pts.push(vv3);
    pts.push(vv4);
    var shape = new THREE.Shape(pts);
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // var materials = [];
    // var verticesIdsAndmaterialId = {};
    // var materialsId = {};
    // for(var i in geometry.vertices){
    // var id = 0
    // if(i<4){
    // id = 0;
    // }else if(i>=4&&i<8){
    // id = paths.length-1;
    // }else{

    // id = ids[(i-8)%(paths.length-2)];
    // }
    // id = ids[id];
    // var colorId = w3m.mol[PDB.pdbId].color['main'][id];
    // if(materialsId[colorId]==undefined){
    // var tc = PDB.tool.getColorByIndex(id,'main');
    // var mater = new THREE.MeshPhongMaterial({ color:tc });
    // materialsId[colorId] = materials.length;
    // materials.push(mater);
    // }
    // verticesIdsAndmaterialId[i] = materialsId[colorId];
    // }
    // for(var i in geometry.faces){
    // geometry.faces[i].materialIndex = verticesIdsAndmaterialId[geometry.faces[i].b];
    // }
    var id = 0;
    if (typeof(ids) == 'object' || typeof(ids) == 'array') {
      id = ids[0];
    } else {
      id = ids;
    }
    var mater = new THREE.MeshPhongMaterial({
      color: color
    });
    //geometry.computeFaceNormals();
    //geometry.computeVertexNormals();
    //var material = new THREE.MeshLambertMaterial( { color: color, wireframe: false } );
    var material = new THREE.MeshPhongMaterial({
      color: color,
      wireframe: false
    });
    var mesh = new THREE.Mesh(geometry, mater);
    var atom = PDB.tool.getMainAtom(PDB.pdbId, id);
    mesh.name = atom.id;
    mesh.userData = {
      group: group,
      presentAtom: atom,
      reptype: "tube"
    };
    PDB.GROUP[group].add(mesh);
  },
  drawEllipse: function(group, paths, color, radius, angleObj, steps, ids) {
    var pathSpline = new THREE.CatmullRomCurve3(paths);
    // var frenetFrames       = pathSpline.computeFrenetFrames(steps,true);
    // frenetFrames.binormals = angleObj.binormals;
    // frenetFrames.normals   = angleObj.normals;
    // frenetFrames.tangents  = angleObj.tangents;
    var extrudeSettings = {
      steps: steps,
      bevelEnabled: true,
      extrudePath: pathSpline,
      frames: angleObj //add normal
    };
    var circleRadius = radius;
    var t = PDB.CONFIG.ellipse_radius_multiple;
    var curve = new THREE.EllipseCurve(
      0, 0, // ax, aY
      t * circleRadius, circleRadius, // xRadius, yRadius
      0, 2 * Math.PI, // aStartAngle, aEndAngle
      false, // aClockwise
      0 // aRotation
    );
    var shape = new THREE.Shape();
    shape.curves.push(curve);
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    //geometry.computeFaceNormals();
    // geometry.computeVertexNormals();
    var material = new THREE.MeshPhongMaterial({
      color: color,
      wireframe: false
    });
    material.side = THREE.FrontSide;
    // material.overdraw = true;
    var mesh = new THREE.Mesh(geometry, material);
    var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
    mesh.name = atom.id;
    mesh.userData = {
      group: group,
      presentAtom: atom,
      reptype: "tube"
    };
    PDB.GROUP[group].add(mesh);
  },
  drawRectangle: function(group, paths, color, radius, angleObj, steps, ids) {
    if (paths.length == 0) {
      return;
    }
    var pathSpline = new THREE.CatmullRomCurve3(paths);
    // var frenetFrames       = pathSpline.computeFrenetFrames(steps,true);
    // frenetFrames.binormals = angleObj.binormals;
    // frenetFrames.normals   = angleObj.normals;
    // frenetFrames.tangents  = angleObj.tangents;
    var extrudeSettings = {
      steps: steps,
      bevelEnabled: true,
      extrudePath: pathSpline,
      frames: angleObj, //add normal
      bevelSegments: 100,
      extrudeMaterial: 0,
      material: 0,
      curveSegments: 6

    };
    var height = PDB.CONFIG.retangle_height;
    var width = PDB.CONFIG.retangle_width;
    var pts = [];
    var vv1 = new THREE.Vector2(-width, height);
    var vv2 = new THREE.Vector2(width, height);
    var vv3 = new THREE.Vector2(width, -height);
    var vv4 = new THREE.Vector2(-width, -height);
    pts.push(vv1);
    pts.push(vv2);
    pts.push(vv3);
    pts.push(vv4); //pts.push(vv5);
    var shape = new THREE.Shape(pts);
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    //geometry.computeFaceNormals();
    // geometry.computeVertexNormals();
    //var material = new THREE.MeshLambertMaterial( { color: color, wireframe: false } );
    var material = new THREE.MeshPhongMaterial({
      color: color,
      wireframe: false
    });
    // material.overdraw = true;
    var mesh = new THREE.Mesh(geometry, material);
    var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
    mesh.name = atom.id;
    mesh.userData = {
      group: group,
      presentAtom: atom,
      reptype: "tube"
    };
    PDB.GROUP[group].add(mesh);
  },
  drawStrip0: function(group, path, color, radius) {
    var pathSpline = new THREE.CatmullRomCurve3(path);
    var extrudeSettings = {
      steps: 4000,
      bevelEnabled: true,
      extrudePath: pathSpline,

    };
    var t = 6;
    var shape = new THREE.Shape();
    shape.moveTo(0, radius);
    shape.quadraticCurveTo(radius, radius, radius, 0);
    shape.quadraticCurveTo(radius, -radius, 0, -radius);
    shape.moveTo(-t * radius, -radius);
    shape.quadraticCurveTo(-(t + 1) * radius, -radius, -(t + 1) * radius, 0);
    shape.quadraticCurveTo(-(t + 1) * radius, radius, -t * radius, radius);
    shape.moveTo(0, radius);
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    //var material = new THREE.MeshLambertMaterial( { color: color, wireframe: false } );
    var material = new THREE.MeshPhongMaterial({
      color: color,
      wireframe: false
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.userData = {
      group: group
    };
    PDB.GROUP[group].add(mesh);
  },
  drawStrip: function(group, paths, color, radius, angleObj, steps, ids) {
    var pathSpline = new THREE.CatmullRomCurve3(paths);
    // var frenetFrames       = pathSpline.computeFrenetFrames(steps,true);
    // frenetFrames.binormals = angleObj.binormals;
    // frenetFrames.normals   = angleObj.normals;
    // frenetFrames.tangents  = angleObj.tangents;
    // var materials = [];
    // var pathidAndMaterialId  = {};
    // var colorIdAndMaterialId = {};
    // // console.log(new Date());
    // for(var i=0;i<ids.length-1;i++){
    // // var color = PDB.tool.getColorByIndex(ids[i]);
    // var colorId = w3m.mol[PDB.pdbId].color['main'][ids[i]];
    // if(colorIdAndMaterialId[colorId]==undefined){
    // materials.push(new THREE.MeshPhongMaterial( { color: PDB.tool.getColorByIndex(ids[i],'main'), wireframe: false} ));
    // colorIdAndMaterialId[colorId] = materials.length-1;
    // }
    // pathidAndMaterialId[i] = colorIdAndMaterialId[colorId];

    // // verticesIdsAndmaterialId[i] = materialsId[colorId];
    // }
    // console.log(new Date());
    // console.log(pathidAndMaterialId);

    var extrudeSettings = {
      steps: steps,
      bevelEnabled: true,
      extrudePath: pathSpline,
      frames: angleObj,
      curveSegments: 6
      // extrudeMaterial : [0,1],
      // material		: 0
      // extrudeMaterial : pathidAndMaterialId.slice(0,steps),
      // material        : [pathidAndMaterialId[0],pathidAndMaterialId[pathidAndMaterialId.length-1]]
    };
    var t = PDB.CONFIG.strip_ex / 2;
    var shape = new THREE.Shape();
    shape.moveTo(t * radius, radius);
    shape.absarc(t * radius, 0, radius, Math.PI / 2, -Math.PI / 2, true);
    shape.lineTo(-t * radius, -radius);
    shape.absarc(-t * radius, 0, radius, -Math.PI / 2, Math.PI / 2, true);
    shape.lineTo(t * radius, radius);
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // geometry.computeFaceNormals();
    // geometry.computeVertexNormals();
    // var mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
    // console.log(PDB.vertexIdAndStepIndex);

    // for(var i in geometry.faces){
    // var pathId = PDB.vertexIdAndStepIndex[geometry.faces[i].b];
    // geometry.faces[i].materialIndex = pathidAndMaterialId[pathId];
    // }
    var material = new THREE.MeshPhongMaterial({
      color: color,
      wireframe: false
    });
    var mesh = new THREE.Mesh(geometry, material);
    var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
    mesh.name = atom.id;
    mesh.userData = {
      group: group,
      presentAtom: atom,
      reptype: "tube"
    };
    PDB.GROUP[group].add(mesh);
  },
  drawRailway: function(group, paths, color, radius, angleObj, steps, ids) {
    var pathSpline = new THREE.CatmullRomCurve3(paths);
    var extrudeSettings = {
      steps: steps,
      bevelEnabled: true,
      extrudePath: pathSpline,
      frames: angleObj,
      curveSegments: 6
    };
    var shape = new THREE.Shape();
    var t = PDB.CONFIG.railway_gui;
    shape.moveTo(t * radius, 0);
    shape.absarc(t * radius, 0, radius, 0, 2 * Math.PI, true);
    shape.lineTo(-t * radius, 0);
    shape.absarc(-t * radius, 0, radius, 0, 2 * Math.PI, true);
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var material = new THREE.MeshPhongMaterial({
      color: color,
      wireframe: false
    });
    // geometry.computeVertexNormals();
    var mesh = new THREE.Mesh(geometry, material);
    var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
    mesh.name = atom.id;
    mesh.userData = {
      group: group,
      presentAtom: atom,
      reptype: "tube"
    };
    PDB.GROUP[group].add(mesh);
  },
  drawArrow: function(group, sheetPoints) {
    for (var i in sheetPoints) {
      var obj = sheetPoints[i];
      var ids = obj.ids;
      var paths = obj.paths;
      var geometry = new THREE.Geometry();
      geometry.vertices = paths;
      //边
      var materials = [];
      var verticesIdsAndmaterialId = {};
      var materialsId = {};
      for (var i in geometry.vertices) {

        var id = ids[i];
        var colorId = w3m.mol[PDB.pdbId].color['main'][id];
        if (materialsId[colorId] == undefined) {
          var tc = PDB.tool.getColorByIndex(id, 'main');
          var mater = new THREE.MeshPhongMaterial({
            color: tc,
            side: THREE.DoubleSide
          });
          materialsId[colorId] = materials.length;
          materials.push(mater);
        }
        verticesIdsAndmaterialId[i] = materialsId[colorId];
      }
      for (var i = 0; i < paths.length; i = i + 4) {
        // var i = 0;
        if (paths[i + 7] != undefined) {
          var face1 = new THREE.Face3(i, i + 1, i + 4);
          face1.materialIndex = verticesIdsAndmaterialId[i + 1];
          var face3 = new THREE.Face3(i + 5, i + 2, i + 1);
          face3.materialIndex = verticesIdsAndmaterialId[i + 2];
          var face5 = new THREE.Face3(i + 6, i + 3, i + 2);
          face5.materialIndex = verticesIdsAndmaterialId[i + 3];
          var face7 = new THREE.Face3(i + 7, i, i + 3);
          face7.materialIndex = verticesIdsAndmaterialId[i];
          var face10 = new THREE.Face3(i + 5, i + 4, i + 1);
          face10.materialIndex = verticesIdsAndmaterialId[i + 4];
          var face12 = new THREE.Face3(i + 6, i + 5, i + 2);
          face12.materialIndex = verticesIdsAndmaterialId[i + 5];
          var face14 = new THREE.Face3(i + 7, i + 6, i + 3); //--
          face14.materialIndex = verticesIdsAndmaterialId[i + 6];
          var face16 = new THREE.Face3(i + 7, i + 4, i); //--
          face16.materialIndex = verticesIdsAndmaterialId[i + 4];
          geometry.faces.push(face1);
          geometry.faces.push(face3);
          geometry.faces.push(face5);
          geometry.faces.push(face7);

          geometry.faces.push(face10);
          geometry.faces.push(face12);
          geometry.faces.push(face14);
          geometry.faces.push(face16);
        }

      }
      geometry.faces.push(new THREE.Face3(0, 1, 2));
      geometry.faces.push(new THREE.Face3(2, 3, 0));
      geometry.faces.push(new THREE.Face3(paths.length - 4, paths.length - 3, paths.length - 2));
      geometry.faces.push(new THREE.Face3(paths.length - 2, paths.length - 1, paths.length - 4));
      // var geometry = new THREE.PolyhedronGeometry(verticesOfCube,indicesOfFaces,6,2);
      geometry.computeFaceNormals();
      geometry.computeFlatVertexNormals();
      // geometry.computeMorphNormals();
      // geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
      // this.drawDot(group,paths.slice(0,100),0xa345);
      // var materials = new THREE.MeshLambertMaterial( {  wireframe: false,side: THREE.DoubleSide} );

      var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
      var groupindex = "chain_" + atom.chainname;
      var mesh = new THREE.Mesh(geometry, materials);
      mesh.userData = {
        group: groupindex
      };
      PDB.GROUP[groupindex].add(mesh);
    }
  },
  drawArrowByPaths: function(group, paths, color, ids) {
    var geometry = new THREE.Geometry();
    geometry.vertices = paths;
    //边

    var materials = new THREE.MeshPhongMaterial({
      color: color,
      side: THREE.DoubleSide
    });
    for (var i = 0; i < paths.length; i = i + 4) {
      // var i = 0;
      if (paths[i + 7] != undefined) {
        var face1 = new THREE.Face3(i, i + 1, i + 4);
        face1.materialIndex = 0;
        var face3 = new THREE.Face3(i + 5, i + 2, i + 1);
        face3.materialIndex = 0;
        var face5 = new THREE.Face3(i + 6, i + 3, i + 2);
        face5.materialIndex = 0;
        var face7 = new THREE.Face3(i + 7, i, i + 3);
        face7.materialIndex = 0;
        var face10 = new THREE.Face3(i + 5, i + 4, i + 1);
        face10.materialIndex = 0;
        var face12 = new THREE.Face3(i + 6, i + 5, i + 2);
        face12.materialIndex = 0;
        var face14 = new THREE.Face3(i + 7, i + 6, i + 3); //--
        face14.materialIndex = 0;
        var face16 = new THREE.Face3(i + 7, i + 4, i); //--
        face16.materialIndex = 0;


        geometry.faces.push(face1);
        geometry.faces.push(face3);
        geometry.faces.push(face5);
        geometry.faces.push(face7);

        geometry.faces.push(face10);
        geometry.faces.push(face12);
        geometry.faces.push(face14);
        geometry.faces.push(face16);
      }

    }
    var preface1 = new THREE.Face3(0, 1, 2);
    preface1.materialIndex = 0;
    geometry.faces.push(preface1);
    var preface2 = new THREE.Face3(2, 3, 0);
    preface2.materialIndex = 0;
    geometry.faces.push(preface2);
    var lasface1 = new THREE.Face3(paths.length - 4, paths.length - 3, paths.length - 2);
    lasface1.materialIndex = 0;
    geometry.faces.push(lasface1);
    var lasface2 = new THREE.Face3(paths.length - 2, paths.length - 1, paths.length - 4);
    lasface2.materialIndex = 0;
    geometry.faces.push(lasface2);
    // var geometry = new THREE.PolyhedronGeometry(verticesOfCube,indicesOfFaces,6,2);
    // geometry.computeFaceNormals();
    geometry.computeFlatVertexNormals();
    // geometry.computeMorphNormals();
    // geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    // this.drawDot(group,paths.slice(0,100),0xa345);
    // var materials = new THREE.MeshLambertMaterial( {  wireframe: false,side: THREE.DoubleSide} );
    var mesh = new THREE.Mesh(geometry, materials);
    mesh.name = ids[0];
    var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
    mesh.userData = {
      group: group,
      presentAtom: atom,
      reptype: "tube",
      realtype: "arrow"
    };
    PDB.GROUP[group].add(mesh);

  },
  drawPlane: function(group, width, height, color, dimension, val, emmap) {
    var geometry = new THREE.PlaneGeometry(width, height, width, height);
    var plane = new THREE.Mesh(geometry, PDB.MATERIALLIST);
    var newScale = emmap.header.voxelsize;
   
    switch (dimension) {
      case PDB.DIMENSION_Z:
        console.log("z");
        var i = val;
        if (PDB.mode != PDB.MODE_VR) {
          for (var j = 0; j < emmap.header.NY; j++) {
            for (var k = 0; k < emmap.header.NX; k++) {
              var v = emmap.data[i][j][k];
              var per = Math.floor(100 * ((v - emmap.header.min) / (1.0 * (emmap.header.max - emmap.header.min))));
              // console.log(pre);
              var posObj = {
                x: j,
                y: k,
                width: width,
                colorIndex: per
              };
              PDB.tool.setFaceColor(geometry, posObj)
            }
          }
        }
        val = val + emmap.header.offset.z + PDB.GeoCenterOffset.z;
        plane.position.copy(new THREE.Vector3(0, 0, val));
        break;
      case PDB.DIMENSION_Y:
        console.log("y");
        plane.rotation.x = - Math.PI / 2;
        var j = val;
        if (PDB.mode != PDB.MODE_VR) {
          for (var i = 0; i < emmap.header.NZ; i++) {
            for (var k = 0; k < emmap.header.NX; k++) {
              var v = emmap.data[i][j][k];
              var per = Math.floor(100 * ((v - emmap.header.min) / (1.0 * (emmap.header.max - emmap.header.min))));
              // console.log(pre);
              var posObj = {
                x: i,
                y: k,
                width: width,
                colorIndex: per
              };
              PDB.tool.setFaceColor(geometry, posObj)
            }
          }
        }
        val = val + emmap.header.offset.y+PDB.GeoCenterOffset.y;
        plane.position.copy(new THREE.Vector3(0, val, 0));
        break;
      case PDB.DIMENSION_X:
        console.log("x");
        plane.rotation.y = Math.PI / 2;
        var k = val;
        if (PDB.mode != PDB.MODE_VR) {
          for (var i = 0; i < emmap.header.NZ; i++) {
            for (var j = 0; j < emmap.header.NY; j++) {
              var v = emmap.data[i][j][k];
              var per = Math.floor(100 * ((v - emmap.header.min) / (1.0 * (emmap.header.max - emmap.header.min))));
              
              var posObj = {
                x: i,
                y: j,
                width: width,
                colorIndex: per
              };
              PDB.tool.setFaceColor(geometry, posObj)
            }
          }
        }
        val = val + emmap.header.offset.x+PDB.GeoCenterOffset.x;
        plane.position.copy(new THREE.Vector3(val,0, 0 ));
       
        break;
    }
   
    
    PDB.GROUP[group].add(plane);
    PDB.GROUP[group].scale.set(newScale.x, newScale.y, newScale.z);

  }
};
