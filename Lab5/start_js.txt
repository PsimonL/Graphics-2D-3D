let points = 36;
let gl;

function start() {
  const canvas = document.getElementById("my_canvas");
  gl = canvas.getContext("webgl2");

  // tekstura 1
  const texture1 = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture1);
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );
  const image = new Image();
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    );
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  };
  image.crossOrigin = "";
  image.src =
    "https://cdn.pixabay.com/photo/2013/09/22/19/14/brick-wall-185081_960_720.jpg";

  // tekstura 2
  const texture2 = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture2);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );
  const image2 = new Image();
  image2.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image2
    );
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  };
  image2.crossOrigin = "";
  image2.src =
    "https://cdn.pixabay.com/photo/2012/03/03/23/06/wall-21534_1280.jpg";

  //*****************pointer lock object forking for cross browser**********************
  canvas.requestPointerLock =
    canvas.requestPointerLock || canvas.mozRequestPointerLock;
  document.exitPointerLock =
    document.exitPointerLock || document.mozExitPointerLock;
  canvas.onclick = function () {
    canvas.requestPointerLock();
  };
  // Hook pointer lock state change events for different browsers
  document.addEventListener("pointerlockchange", lockChangeAlert, false);
  document.addEventListener("mozpointerlockchange", lockChangeAlert, false);
  function lockChangeAlert() {
    if (
      document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas
    ) {
      console.log("The pointer lock status is now locked");
      document.addEventListener("mousemove", ustaw_kamere_mysz, false);
    } else {
      console.log("The pointer lock status is now unlocked");
      document.removeEventListener("mousemove", ustaw_kamere_mysz, false);
    }
  }

  //Inicialize the GL contex
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  console.log("WebGL version: " + gl.getParameter(gl.VERSION));
  console.log("GLSL version: " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
  console.log("Vendor: " + gl.getParameter(gl.VENDOR));

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);

  const vs = gl.createShader(gl.VERTEX_SHADER);
  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  const program = gl.createProgram();

  const vsSource = `#version 300 es  
            precision highp float;

            in vec3 position;
            in vec3 color;  
            in vec2 aTexCoord;

                uniform mat4 model;
                uniform mat4 view;  
                uniform mat4 proj;  
               
                out vec3 Color;
                out vec2 TexCoord;

            void main(void)  
            {
                Color = color;
                TexCoord = aTexCoord;

                gl_Position = proj * view * model * vec4(position,1.0);
            }`;

  const fsSource = `#version 300 es
           precision highp float;

           in vec3 Color;
           in vec2 TexCoord;

           uniform sampler2D texture1;
           uniform sampler2D texture2;

           out vec4 frag_color;

           void main(void)

        {
              //frag_color = texture(texture1, TexCoord);
              //frag_color = vec4(Color,1.0);
              frag_color = mix(texture(texture1, TexCoord), texture(texture2, TexCoord), 0.5);

        }`;

  //compilation vs
  gl.shaderSource(vs, vsSource);
  gl.compileShader(vs);
  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(vs));
  }

  //compilation fs
  gl.shaderSource(fs, fsSource);
  gl.compileShader(fs);
  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(fs));
  }

  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(fs));
  }

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert(gl.getProgramInfoLog(program));
  }

  gl.useProgram(program);
  var vertices = [
    -0.5, -0.5, -0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, -0.5, -0.5, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.5, 0.5, -0.5, 0.0, 1.0, 1.0, 1.0, 1.0, 0.5, 0.5, -0.5, 0.0, 1.0,
    1.0, 1.0, 1.0, -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 1.0, -0.5, -0.5, -0.5,
    0.0, 0.0, 0.0, 0.0, 0.0,

    -0.5, -0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, -0.5, 0.5, 1.0, 0.0, 1.0,
    1.0, 0.0, 0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 1.0,
    1.0, 1.0, 1.0, -0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 0.0, 1.0, -0.5, -0.5, 0.5,
    0.0, 0.0, 0.0, 0.0, 0.0,

    -0.5, 0.5, 0.5, 1.0, 0.0, 1.0, 0.0, 0.0, -0.5, 0.5, -0.5, 1.0, 1.0, 1.0,
    1.0, 0.0, -0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 1.0, -0.5, -0.5, -0.5, 0.0,
    1.0, 0.0, 1.0, 1.0, -0.5, -0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0, -0.5, 0.5,
    0.5, 1.0, 0.0, 1.0, 0.0, 0.0,

    0.5, 0.5, 0.5, 1.0, 0.0, 1.0, 0.0, 0.0, 0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 1.0,
    0.0, 0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 1.0, 0.5, -0.5, -0.5, 0.0, 1.0,
    0.0, 1.0, 1.0, 0.5, -0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0, 0.5, 0.5, 0.5, 1.0,
    0.0, 1.0, 0.0, 0.0,

    -0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 0.0, 0.5, -0.5, -0.5, 1.0, 1.0, 1.0,
    1.0, 0.0, 0.5, -0.5, 0.5, 1.0, 0.0, 1.0, 1.0, 1.0, 0.5, -0.5, 0.5, 1.0, 0.0,
    1.0, 1.0, 1.0, -0.5, -0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0, -0.5, -0.5, -0.5,
    0.0, 1.0, 0.0, 0.0, 0.0,

    -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 0.0, 0.5, 0.5, -0.5, 1.0, 1.0, 1.0,
    1.0, 0.0, 0.5, 0.5, 0.5, 1.0, 0.0, 1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 0.0,
    1.0, 1.0, 1.0, -0.5, 0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0, -0.5, 0.5, -0.5,
    0.0, 1.0, 0.0, 0.0, 0.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Vertixes
  const texCoord = gl.getAttribLocation(program, "aTexCoord");
  gl.enableVertexAttribArray(texCoord);
  gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 8 * 4, 6 * 4);

  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 8 * 4, 0);

  const color = gl.getAttribLocation(program, "color");
  gl.enableVertexAttribArray(color);
  gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 8 * 4, 3 * 4);

  `function draw() {  
      setCamera();
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);  
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);  
      gl.drawArrays(gl.TRIANGLES, 0, 36);  
      window.requestAnimationFrame(draw);
    }
 
    window.requestAnimationFrame(draw);`;

  // macierz modelu
  const model = mat4.create();
  let rotate_angle = (25 * Math.PI) / 180;
  mat4.rotate(model, model, rotate_angle, [0, 0, 1]);
  let uniModel = gl.getUniformLocation(program, "model");
  gl.uniformMatrix4fv(uniModel, false, model);

  // macierz projekcji
  const proj = mat4.create();
  mat4.perspective(
    proj,
    (60 * Math.PI) / 180,
    gl.canvas.clientWidth / gl.canvas.clientHeight,
    0.1,
    100
  );
  let uniProj = gl.getUniformLocation(program, "proj");
  gl.uniformMatrix4fv(uniProj, false, proj);

  // macierz widoku
  const view = mat4.create();
  mat4.lookAt(view, [0, 0, 3], [0, 0, -1], [0, 1, 0]);
  let uniView = gl.getUniformLocation(program, "view");
  gl.uniformMatrix4fv(uniView, false, view);

  let cameraFront_tmp = glm.vec3(1, 1, 1);
  var pressedKey = {};
  document.addEventListener("keyup", (e) => {
    pressedKey[e.keyCode] = false;
    console.log(pressedKey);
  });

  document.addEventListener("keydown", (e) => {
    pressedKey[e.keyCode] = true;
    console.log(pressedKey);
  });

  if (gl.isEnabled(gl.DEPTH_TEST)) gl.disable(gl.DEPTH_TEST);
  else gl.enable(gl.DEPTH_TEST);
  console.log("setcamera above");

  let cameraPos = glm.vec3(0, 0, 3);
  let cameraFront = glm.vec3(0, 0, -1);
  let cameraUp = glm.vec3(0, 1, 0);
  let rotation = 0.0;

  function setCamera() {
    let cameraSpeed = 0.002 * elapsedTime;
    if (pressedKey["38"] === true) {
      // up
      cameraPos.x += cameraSpeed * cameraFront.x;
      cameraPos.y += cameraSpeed * cameraFront.y;
      cameraPos.z += cameraSpeed * cameraFront.z;
    } else if (pressedKey["37"] === true) {
      // left
      // rotation -= cameraSpeed;
      // cameraFront.x = Math.sin(rotation);
      // cameraFront.z = -Math.cos(rotation);
      let cameraPos_tmp = glm.normalize(glm.cross(cameraFront, cameraUp));
      cameraPos.x -= cameraPos_tmp.x * cameraSpeed;
      cameraPos.y -= cameraPos_tmp.y * cameraSpeed;
    } else if (pressedKey["39"] === true) {
      // right
      // rotation += cameraSpeed;
      // cameraFront.x = Math.sin(rotation);
      // cameraFront.z = -Math.cos(rotation);
      let cameraPos_tmp = glm.normalize(glm.cross(cameraFront, cameraUp));
      cameraPos.x += cameraPos_tmp.x * cameraSpeed;
      cameraPos.y += cameraPos_tmp.y * cameraSpeed;
      cameraPos.z += cameraPos_tmp.z * cameraSpeed;
    } else if (pressedKey["40"] === true) {
      // down
      cameraPos.x -= cameraSpeed * cameraFront.x;
      cameraPos.y -= cameraSpeed * cameraFront.y;
      cameraPos.z -= cameraSpeed * cameraFront.z;
    } else if (pressedKey["27"] === true) {
      if (confirm("Want to leave?")) {
        close();
      }
    } else if (pressedKey["49"] == true) {
      mode = 0;
    } else if (pressedKey["50"] == true) {
      mode = 1;
    } else if (pressedKey["51"] == true) {
      mode = 2;
    }

    cameraFront_tmp.x = cameraPos.x + cameraFront.x;
    cameraFront_tmp.y = cameraPos.y + cameraFront.y;
    cameraFront_tmp.z = cameraPos.z + cameraFront.z;
    mat4.lookAt(view, cameraPos, cameraFront_tmp, cameraUp);
    gl.uniformMatrix4fv(uniView, false, view);
  }

  let yaw = -90;
  let pitch = 0;

  function ustaw_kamere_mysz(e) {
    let xoffset = e.movementX;
    let yoffset = e.movementY;

    let sensitivity = 0.1;
    let cameraSpeed = 0.05 * elapsedTime;

    xoffset *= sensitivity;
    yoffset *= sensitivity;

    yaw += xoffset * cameraSpeed;
    pitch -= yoffset * cameraSpeed;

    if (pitch > 89.0) pitch = 89.0;

    if (pitch < -89.0) pitch = -89.0;

    let front = glm.vec3(1, 1, 1);

    front.x = Math.cos(glm.radians(yaw)) * Math.cos(glm.radians(pitch));
    front.y = Math.sin(glm.radians(pitch));
    front.z = Math.sin(glm.radians(yaw)) * Math.cos(glm.radians(pitch));
    cameraFront = glm.normalize(front);
  }

  let licznik=0;
  let mode = 0;
  const fpsElem = document.querySelector("#fps");
  let startTime=0;
  let elapsedTime=0;
  gl.uniform1i(gl.getUniformLocation(program, "texture1"), 0);
  gl.uniform1i(gl.getUniformLocation(program, "texture2"), 1);
  let separate = 0.05;
  function StereoProjection(
    _left,
    _right,
    _bottom,
    _top,
    _near,
    _far,
    _zero_plane,
    _dist,
    _eye
  ) {
    // Perform the perspective projection for one eye's subfield.
    // The projection is in the direction of the negative z-axis.
    // _left=-6.0;
    // _right=6.0;
    // _bottom=-4.8;
    // _top=4.8;
    // [default: -6.0, 6.0, -4.8, 4.8]
    // left, right, bottom, top = the coordinate range, in the plane of zero parallax setting,
    // which will be displayed on the screen.
    // The ratio between (right-left) and (top-bottom) should equal the aspect
    // ratio of the display.
    // _near=6.0;
    // _far=-20.0;
    // [default: 6.0, -6.0]
    // near, far = the z-coordinate values of the clipping planes.
    // _zero_plane=0.0;
    // [default: 0.0]
    // zero_plane = the z-coordinate of the plane of zero parallax setting.
    // [default: 14.5]
    // _dist=10.5;
    // dist = the distance from the center of projection to the plane of zero parallax.
    // [default: -0.3]
    // _eye=-0.3;
    // eye = half the eye separation; positive for the right eye subfield,
    // negative for the left eye subfield.
    console.log("Stereo proj");
    let _dx = _right - _left;
    let _dy = _top - _bottom;
    let _xmid = (_right + _left) / 2.0;
    let _ymid = (_top + _bottom) / 2.0;
    let _clip_near = _dist + _zero_plane - _near;
    let _clip_far = _dist + _zero_plane - _far;
    let _n_over_d = _clip_near / _dist;
    let _topw = (_n_over_d * _dy) / 2.0;
    let _bottomw = -_topw;
    let _rightw = _n_over_d * (_dx / 2.0 - _eye);
    let _leftw = _n_over_d * (-_dx / 2.0 - _eye);
    const proj = mat4.create();
    mat4.frustum(proj, _leftw, _rightw, _bottomw, _topw, _clip_near, _clip_far);
    mat4.translate(proj, proj, [-_xmid - _eye, -_ymid, 0]);
    let uniProj = gl.getUniformLocation(program, "proj");
    gl.uniformMatrix4fv(uniProj, false, proj);
  }

  function draw()
    {
      elapsedTime = performance.now() - startTime;
      startTime = performance.now();
      licznik++;
      let fFps = 1000 / elapsedTime;
      if (licznik > fFps) {
        fpsElem.textContent = fFps.toFixed(1);
        licznik = 0;
      }
      setCamera();
  
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      //gl.drawArrays(gl.TRIANGLES, 0, 36);
      //window.requestAnimationFrame(draw);
      setTimeout(() => {
        window.requestAnimationFrame(draw);
      }, 1000 / 60);
  
      // gl.activeTexture(gl.TEXTURE0);
      // gl.bindTexture(gl.TEXTURE_2D, texture1);
      // gl.drawArrays(gl.TRIANGLES, 0, 12);
  
      // gl.activeTexture(gl.TEXTURE0);
      // gl.bindTexture(gl.TEXTURE_2D, texture2);
      // gl.drawArrays(gl.TRIANGLES, 12, 24);
  
      switch (mode) {
        case 0:
          console.log("switch 0");
          gl.viewport(0, 0, canvas.width, canvas.height);
          StereoProjection(-6, 6, -4.8, 4.8, 12.99, -100, 0, 13, -separate); //projekcja dla lewego oka
          gl.colorMask(true, false, false, false);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture2);
          gl.drawArrays(gl.TRIANGLES, 0, points / 2);
          gl.bindTexture(gl.TEXTURE_2D, texture1);
          gl.drawArrays(gl.TRIANGLES, points / 2, points);
  
          gl.clear(gl.DEPTH_BUFFER_BIT);
  
          StereoProjection(-6, 6, -4.8, 4.8, 12.99, -100, 0, 13, separate); //projekcja dla lewego oka
          gl.colorMask(false, false, true, false);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture2);
          gl.drawArrays(gl.TRIANGLES, 0, points / 2);
          gl.bindTexture(gl.TEXTURE_2D, texture1);
          gl.drawArrays(gl.TRIANGLES, points / 2, points);
  
          gl.colorMask(true, true, true, true);
          break;
  
        case 1:
          console.log("switch 1");
          gl.viewport(0, 0, canvas.width / 2, canvas.height);
          StereoProjection(-6, 6, -4.8, 4.8, 12.99, -100, 0, 13, -separate);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture2);
          gl.drawArrays(gl.TRIANGLES, 0, points / 2);
          gl.bindTexture(gl.TEXTURE_2D, texture1);
          gl.drawArrays(gl.TRIANGLES, points / 2, points);
  
          gl.viewport(canvas.width / 2, 0, canvas.width / 2, canvas.height);
          StereoProjection(-6, 6, -4.8, 4.8, 12.99, -100, 0, 13, separate);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture2);
          gl.drawArrays(gl.TRIANGLES, 0, points / 2);
          gl.bindTexture(gl.TEXTURE_2D, texture1);
          gl.drawArrays(gl.TRIANGLES, points / 2, points);
          break;
  
        case 2:
          console.log("switch 2");
          gl.viewport(0, 0, canvas.width, canvas.height);
          StereoProjection(-6, 6, -4.8, 4.8, 12.99, -100, 0, 13, 0);
          //wiecej niz 1 zdj
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture2);
          gl.drawArrays(gl.TRIANGLES, 0, points);
          gl.bindTexture(gl.TEXTURE_2D, texture1);
          gl.drawArrays(gl.TRIANGLES, points / 2, points);
          break;
      }
    }
    window.requestAnimationFrame(draw);
 }

function kostka() {
  let punkty_ = 36;

  var vertices = [
    -0.5, -0.5, -0.5, 0.0, 0.0, 0.0, 0.5, -0.5, -0.5, 0.0, 0.0, 1.0, 0.5, 0.5,
    -0.5, 0.0, 1.0, 1.0, 0.5, 0.5, -0.5, 0.0, 1.0, 1.0, -0.5, 0.5, -0.5, 0.0,
    1.0, 0.0, -0.5, -0.5, -0.5, 0.0, 0.0, 0.0,

    -0.5, -0.5, 0.5, 0.0, 0.0, 0.0, 0.5, -0.5, 0.5, 1.0, 0.0, 1.0, 0.5, 0.5,
    0.5, 1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 1.0, 1.0, -0.5, 0.5, 0.5, 0.0, 1.0,
    0.0, -0.5, -0.5, 0.5, 0.0, 0.0, 0.0,

    -0.5, 0.5, 0.5, 1.0, 0.0, 1.0, -0.5, 0.5, -0.5, 1.0, 1.0, 1.0, -0.5, -0.5,
    -0.5, 0.0, 1.0, 0.0, -0.5, -0.5, -0.5, 0.0, 1.0, 0.0, -0.5, -0.5, 0.5, 0.0,
    0.0, 0.0, -0.5, 0.5, 0.5, 1.0, 0.0, 1.0,

    0.5, 0.5, 0.5, 1.0, 0.0, 1.0, 0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 0.5, -0.5,
    -0.5, 0.0, 1.0, 0.0, 0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, -0.5, 0.5, 0.0,
    0.0, 0.0, 0.5, 0.5, 0.5, 1.0, 0.0, 1.0,

    -0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 0.5, -0.5,
    0.5, 1.0, 0.0, 1.0, 0.5, -0.5, 0.5, 1.0, 0.0, 1.0, -0.5, -0.5, 0.5, 0.0,
    0.0, 0.0, -0.5, -0.5, -0.5, 0.0, 1.0, 0.0,

    -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 0.5, 0.5,
    0.5, 1.0, 0.0, 1.0, 0.5, 0.5, 0.5, 1.0, 0.0, 1.0, -0.5, 0.5, 0.5, 0.0, 0.0,
    0.0, -0.5, 0.5, -0.5, 0.0, 1.0, 0.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  n_draw = punkty_;
}

function kostka() {
  var vertices = [
    -0.5, -0.5, -0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, -0.5, -0.5, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.5, 0.5, -0.5, 0.0, 1.0, 1.0, 1.0, 1.0, 0.5, 0.5, -0.5, 0.0, 1.0,
    1.0, 1.0, 1.0, -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 1.0, -0.5, -0.5, -0.5,
    0.0, 0.0, 0.0, 0.0, 0.0,
  ];
}

async function loadFile(file) {
  text = await file.text();
  text = text.replaceAll("/", " ");
  text = text.replaceAll("\n", " ");
  let arrayCopy = text.split(" ");
  const vertices = [[]];
  let licz_vertices = 0;
  const normals = [[]];
  let licz_normals = 0;
  const coords = [[]];
  let licz_coords = 0;
  const triangles = [];
  let licz_triangles = 0;
  for (let i = 0; i < arrayCopy.length - 1; i++) {
    if (arrayCopy[i] == "v") {
      2;
      vertices.push([]);
      vertices[licz_vertices].push(parseFloat(arrayCopy[i + 1]));
      vertices[licz_vertices].push(parseFloat(arrayCopy[i + 2]));
      vertices[licz_vertices].push(parseFloat(arrayCopy[i + 3]));
      i += 3;
      licz_vertices++;
    }
    if (arrayCopy[i] == "vn") {
      normals.push([]);
      normals[licz_normals].push(parseFloat(arrayCopy[i + 1]));
      normals[licz_normals].push(parseFloat(arrayCopy[i + 2]));
      normals[licz_normals].push(parseFloat(arrayCopy[i + 3]));
      i += 3;
      licz_normals++;
    }
    if (arrayCopy[i] == "vt") {
      coords.push([]);
      coords[licz_coords].push(parseFloat(arrayCopy[i + 1]));
      coords[licz_coords].push(parseFloat(arrayCopy[i + 2]));
      i += 2;
      licz_coords++;
    }
    if (arrayCopy[i] == "f") {
      triangles.push([]);
      for (let j = 1; j <= 9; j++)
        triangles[licz_triangles].push(parseFloat(arrayCopy[i + j]));
      i += 9;
      licz_triangles++;
    }
  }
  let vert_array = [];
  for (let i = 0; i < triangles.length; i++) {
    vert_array.push(vertices[triangles[i][0] - 1][0]);
    vert_array.push(vertices[triangles[i][0] - 1][1]);
    vert_array.push(vertices[triangles[i][0] - 1][2]);
    vert_array.push(normals[triangles[i][2] - 1][0]);
    vert_array.push(normals[triangles[i][2] - 1][1]);
    vert_array.push(normals[triangles[i][2] - 1][2]);
    vert_array.push(coords[triangles[i][1] - 1][0]);
    vert_array.push(coords[triangles[i][1] - 1][1]);
    vert_array.push(vertices[triangles[i][3] - 1][0]);
    vert_array.push(vertices[triangles[i][3] - 1][1]);
    vert_array.push(vertices[triangles[i][3] - 1][2]);
    vert_array.push(normals[triangles[i][5] - 1][0]);
    vert_array.push(normals[triangles[i][5] - 1][1]);
    vert_array.push(normals[triangles[i][5] - 1][2]);
    vert_array.push(coords[triangles[i][4] - 1][0]);
    vert_array.push(coords[triangles[i][4] - 1][1]);
    vert_array.push(vertices[triangles[i][6] - 1][0]);
    vert_array.push(vertices[triangles[i][6] - 1][1]);
    vert_array.push(vertices[triangles[i][6] - 1][2]);
    vert_array.push(normals[triangles[i][8] - 1][0]);
    vert_array.push(normals[triangles[i][8] - 1][1]);
    vert_array.push(normals[triangles[i][8] - 1][2]);
    vert_array.push(coords[triangles[i][7] - 1][0]);
    vert_array.push(coords[triangles[i][7] - 1][1]);
  }
  points = triangles.length * 3;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vert_array), gl.STATIC_DRAW);
}
