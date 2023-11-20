let buforSCIANY;
let buforPODLOGA;
let buforMALPA;
let buforANIOLKI;
let buforSFERA;

let choosenModel = 1;
let points = 36;
let points1 = 0;
let points2 = 0;
let points3 = 0;
let points4 = 0;
let points5 = 0;
let gl;

function start() {
  const canvas = document.getElementById("my_canvas");

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
  //****************************************************************

  //Inicialize the GL contex
  gl = canvas.getContext("webgl2");

  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  console.log("WebGL version: " + gl.getParameter(gl.VERSION));
  console.log("GLSL version: " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
  console.log("Vendor: " + gl.getParameter(gl.VENDOR));

  const vs = gl.createShader(gl.VERTEX_SHADER);
  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  const program = gl.createProgram();

  const vsSource = `#version 300 es
		precision highp float;
		in vec3 position;
		in vec3 color;

		uniform mat4 model;
		uniform mat4 view;
		uniform mat4 proj;

		out vec3 Color;

		in vec2 aTexCoord;
		out vec2 TexCoord;

		void main(void)
		{
			TexCoord = aTexCoord;
			Color = color;
			gl_Position = proj * view * model * vec4(position, 1.0);
		}
		`;

  const fsSource = `#version 300 es
		precision highp float;
		in vec3 Color; 
		 
		in vec2 TexCoord;

		uniform sampler2D texture1;

		uniform sampler2D texture2;

		out vec4 frag_color;
		void main(void)
		{
			frag_color = texture(texture1, TexCoord);
			//frag_color *= texture(texture2, TexCoord);
			//frag_color *= vec4(Color, 1.0);
			//frag_color = vec4(1.0, 0.5, 0.25, 1.0);
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

  //macierz model ////////////////////////////////////////////
  const model = mat4.create();
  //    const kat_obrotu = -25 * Math.PI / 180; // in radians
  const kat_obrotu = (0 * Math.PI) / 180;
  mat4.rotate(model, model, kat_obrotu, [0, 0, 1]);

  let uniModel = gl.getUniformLocation(program, "model");
  gl.uniformMatrix4fv(uniModel, false, model);

  //macierz widoku//////////////////////////////////////////////
  const view = mat4.create();
  mat4.lookAt(view, [0, 0, 3], [0, 0, -1], [0, 1, 0]);

  let uniView = gl.getUniformLocation(program, "view");
  gl.uniformMatrix4fv(uniView, false, view);

  //macierz projekcji/////////////////////////////////////////////
  const proj = mat4.create();
  mat4.perspective(
    proj,
    (60 * Math.PI) / 180,
    gl.canvas.clientWidth / gl.canvas.clientHeight,
    0.1,
    500.0
  );

  let uniProj = gl.getUniformLocation(program, "proj");
  gl.uniformMatrix4fv(uniProj, false, proj);
  /////////////////////////////////////////////////////////////////

  //let n_draw = 0;

  // buffer ////////////////////////////////////////////

  /*const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);*/
  //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const buffer = gl.createBuffer();
  gl.useProgram(program);
  var n_draw = 36;
  buffer1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
  kostka();
  daneWierzcholkowe();
  buffer2 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
  kostka();
  daneWierzcholkowe();
  buffer3 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer3);
  kostka();
  daneWierzcholkowe();
  buffer4 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer4);
  kostka();
  daneWierzcholkowe();
  buffer5 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer5);
  kostka();
  daneWierzcholkowe();

  // camera ////////////////////////////////////////
  let cameraFront_tmp = glm.vec3(1, 1, 1);
  let cameraPos = glm.vec3(0, 0, 3);
  let cameraFront = glm.vec3(0, 0, -1);
  let cameraUp = glm.vec3(0, 1, 0);
  let obrot = 0.0;

  //	draw	***************************************
  let licznik = 0;
  const fpsElem = document.querySelector("#fps");
  let startTime = 0;
  let elapsedTime = 0;

  let prymityw = gl.TRIANGLES;
  let tryb = 3;
  let rozstaw = -0.05;

  //kostka();

  function draw() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, 0, canvas.width, canvas.height); //cały obszar ekranu
    gl.activeTexture(gl.TEXTURE0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
    daneWierzcholkowe();
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.drawArrays(gl.TRIANGLES, 0, points1);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
    daneWierzcholkowe();
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.drawArrays(gl.TRIANGLES, 0, points2);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer3);
    daneWierzcholkowe();
    gl.bindTexture(gl.TEXTURE_2D, texture3);
    gl.drawArrays(gl.TRIANGLES, 0, points3);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer4);
    daneWierzcholkowe();
    gl.bindTexture(gl.TEXTURE_2D, texture4);
    gl.drawArrays(gl.TRIANGLES, 0, points4);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer5);
    daneWierzcholkowe();
    gl.bindTexture(gl.TEXTURE_2D, texture5);
    gl.drawArrays(gl.TRIANGLES, 0, points5);

    ustaw_kamere();

    /*

		gl.viewport(0, 0, canvas.width, canvas.height); //cały obszar ekranu
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture1);
		gl.drawArrays(prymityw, 0, points);

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);*/

    /*switch (tryb){
			case 1:{
				gl.viewport(0, 0, canvas.width, canvas.height); //cały obszar ekranu
				StereoProjection(-6, 6, -4.8, 4.8, 12.99, -100, 0, 13, rozstaw); //projekcja dla lewego okagl. 
				wiecej niz -100
				gl.colorMask(true,false,false,false);//czerwony filtr
				
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, texture1);
				gl.drawArrays(prymityw, 0, 12);
				gl.bindTexture(gl.TEXTURE_2D, texture2);         
				gl.drawArrays(prymityw, 12, 24);

				//gl.clear(gl.COLOR_BUFFER_BIT);

				StereoProjection(-6, 6, -4.8, 4.8, 12.99, -100, 0, 13, rozstaw*-1); //projekcja dla prawego oka
				gl.colorMask(false,false,true,false);//niebieski filtr
				
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, texture1);
				gl.drawArrays(prymityw, 0, 12);
				gl.bindTexture(gl.TEXTURE_2D, texture2);         
				gl.drawArrays(prymityw, 12, 24);

				gl.colorMask(true,true,true,true);

				break;

			}

			case 2:{

				gl.viewport(0, 0, canvas.width/2, canvas.height); //cały obszar ekranu
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, texture1);
				gl.drawArrays(prymityw, 0, 12);
				gl.bindTexture(gl.TEXTURE_2D, texture2);         
				gl.drawArrays(prymityw, 12, 24);

				gl.viewport((canvas.width/2)+1, 0, canvas.width/2, canvas.height); //cały obszar ekranu
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, texture1);
				gl.drawArrays(prymityw, 0, 12);
				gl.bindTexture(gl.TEXTURE_2D, texture2);         
				gl.drawArrays(prymityw, 12, 24);

				break;
			}

			case 3:{
				gl.viewport(0, 0, canvas.width, canvas.height); //cały obszar ekranu
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, texture1);
				gl.drawArrays(prymityw, 0, 12);
				gl.bindTexture(gl.TEXTURE_2D, texture2);         
				gl.drawArrays(prymityw, 12, 24);

				break;
			}
		}*/

    //gl.drawArrays(prymityw, 24, 36);

    elapsedTime = performance.now() - startTime;
    startTime = performance.now();
    licznik++;
    let fFps = 1000 / elapsedTime;

    // ograniczenie częstotliwości odświeżania napisu do ok 1/s
    if (licznik > fFps) {
      fpsElem.textContent = fFps.toFixed(1);
      licznik = 0;
    }

    //ograniczenie co ile ma zostać wywołana funkcja
    setTimeout(() => {
      requestAnimationFrame(draw);
    }, 1000 / 60);
    //window.requestAnimationFrame(draw);
  }

  window.requestAnimationFrame(draw);

  // dane wierzchołkowe -------------------------------------------------------------------------

  function daneWierzcholkowe() {
    const positionAttrib = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionAttrib);
    gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 8 * 4, 0);

    const colorAttrib = gl.getAttribLocation(program, "color");
    gl.enableVertexAttribArray(colorAttrib);
    gl.vertexAttribPointer(colorAttrib, 3, gl.FLOAT, false, 8 * 4, 3 * 4);

    const texCoord = gl.getAttribLocation(program, "aTexCoord");
    gl.enableVertexAttribArray(texCoord);
    gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 8 * 4, 6 * 4);
  }
  //-----------------------------------------------------------------------------------------------

  // Add the event listeners for mousedown, mousemove, and mouseup
  window.addEventListener("mousedown", (e) => {
    x = e.offsetX;
    y = e.offsetY;
    /*alert("x ="+x);
	alert("y ="+y);*/
  });

  // Add the event listeners for keydown, keyup
  window.addEventListener(
    "keydown",
    function (event) {
      switch (event.keyCode) {
        case 68: // d
          if (gl.isEnabled(gl.DEPTH_TEST)) gl.disable(gl.DEPTH_TEST);
          else gl.enable(gl.DEPTH_TEST);
          break;

        case 27: // ESC
          if (this.confirm("Close window?")) this.close();
          break;

        case 90: {
          tryb = 1;
          break;
        }

        case 88: {
          tryb = 2;
          break;
        }

        case 67: {
          tryb = 3;
          break;
        }

        case 107: {
          rozstaw += 0.05;
          break;
        }

        case 109: {
          rozstaw -= 0.05;
          break;
        }
      }
    },
    false
  );

  // Add the event listeners for key
  var pressedKey = {};
  window.onkeyup = function (e) {
    pressedKey[e.keyCode] = false;
  };
  window.onkeydown = function (e) {
    pressedKey[e.keyCode] = true;
  };
  function ustaw_kamere() {
    let cameraSpeed = 0.5;
    if (pressedKey["38"]) {
      //Up
      cameraPos.x += cameraSpeed * cameraFront.x;
      cameraPos.y += cameraSpeed * cameraFront.y;
      cameraPos.z += cameraSpeed * cameraFront.z;
    }
    if (pressedKey["37"]) {
      //left
      let cameraPos_tmp = glm.normalize(glm.cross(cameraFront, cameraUp));
      cameraPos.x -= cameraPos_tmp.x * cameraSpeed;
      cameraPos.y -= cameraPos_tmp.y * cameraSpeed;
      cameraPos.z -= cameraPos_tmp.z * cameraSpeed;

      //obrot
      /*obrot -= cameraSpeed;
			cameraFront.x = Math.sin(obrot);
			cameraFront.z = -Math.cos(obrot);*/
    }
    if (pressedKey["39"]) {
      // Right
      let cameraPos_tmp = glm.normalize(glm.cross(cameraFront, cameraUp));
      cameraPos.x += cameraPos_tmp.x * cameraSpeed;
      cameraPos.y += cameraPos_tmp.y * cameraSpeed;
      cameraPos.z += cameraPos_tmp.z * cameraSpeed;

      //obrot
      /*obrot += cameraSpeed;
			cameraFront.x = Math.sin(obrot);
			cameraFront.z = -Math.cos(obrot);*/
    }
    if (pressedKey["40"]) {
      // Down
      cameraPos.x -= cameraSpeed * cameraFront.x;
      cameraPos.y -= cameraSpeed * cameraFront.y;
      cameraPos.z -= cameraSpeed * cameraFront.z;
    }

    //wyślij macierz do karty
    cameraFront_tmp.x = cameraPos.x + cameraFront.x;
    cameraFront_tmp.y = cameraPos.y + cameraFront.y;
    cameraFront_tmp.z = cameraPos.z + cameraFront.z;
    mat4.lookAt(view, cameraPos, cameraFront_tmp, cameraUp);
    gl.uniformMatrix4fv(uniView, false, view);
  }

  cameraFront_tmp.x = cameraPos.x + cameraFront.x;
  cameraFront_tmp.y = cameraPos.y + cameraFront.y;
  cameraFront_tmp.z = cameraPos.z + cameraFront.z;
  mat4.lookAt(view, cameraPos, cameraFront_tmp, cameraUp);
  gl.uniformMatrix4fv(uniView, false, view);

  function kostka() {
    let punkty_ = 36;

    var vertices = [
      -0.5, -0.5, -0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, -0.5, -0.5, 0.0, 0.0, 1.0,
      1.0, 0.0, 0.5, 0.5, -0.5, 0.0, 1.0, 1.0, 1.0, 1.0, 0.5, 0.5, -0.5, 0.0,
      1.0, 1.0, 1.0, 1.0, -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 1.0, -0.5, -0.5,
      -0.5, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5, -0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0,
      0.5, -0.5, 0.5, 1.0, 0.0, 1.0, 1.0, 0.0, 0.5, 0.5, 0.5, 1.0, 1.0, 1.0,
      1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0, -0.5, 0.5, 0.5, 0.0,
      1.0, 0.0, 0.0, 1.0, -0.5, -0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5, 0.5,
      0.5, 1.0, 0.0, 1.0, 0.0, 0.0, -0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 1.0, 0.0,
      -0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 1.0, -0.5, -0.5, -0.5, 0.0, 1.0,
      0.0, 1.0, 1.0, -0.5, -0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0, -0.5, 0.5, 0.5,
      1.0, 0.0, 1.0, 0.0, 0.0, 0.5, 0.5, 0.5, 1.0, 0.0, 1.0, 0.0, 0.0, 0.5, 0.5,
      -0.5, 1.0, 1.0, 1.0, 1.0, 0.0, 0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 1.0,
      0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 1.0, 0.5, -0.5, 0.5, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.5, 0.5, 0.5, 1.0, 0.0, 1.0, 0.0, 0.0, -0.5, -0.5, -0.5, 0.0,
      1.0, 0.0, 0.0, 0.0, 0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 1.0, 0.0, 0.5, -0.5,
      0.5, 1.0, 0.0, 1.0, 1.0, 1.0, 0.5, -0.5, 0.5, 1.0, 0.0, 1.0, 1.0, 1.0,
      -0.5, -0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0, -0.5, -0.5, -0.5, 0.0, 1.0, 0.0,
      0.0, 0.0, -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 0.0, 0.5, 0.5, -0.5, 1.0,
      1.0, 1.0, 1.0, 0.0, 0.5, 0.5, 0.5, 1.0, 0.0, 1.0, 1.0, 1.0, 0.5, 0.5, 0.5,
      1.0, 0.0, 1.0, 1.0, 1.0, -0.5, 0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0, -0.5,
      0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 0.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  }

  let x = 50; //zmiana położenia w kierunku x
  let y = 50; //zmiana położenia w kierunku y

  let yaw = -90; //obrót względem osi X
  let pitch = 0; //obrót względem osi Y

  function ustaw_kamere_mysz(e) {
    let xoffset = e.movementX;
    let yoffset = e.movementY;
    let sensitivity = 0.1;
    let cameraSpeed = 0.005 * elapsedTime;

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

  //texture1  ŚCIANY *****************************************************************************
  const texture1 = gl.createTexture();
  {
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

    // image.src = "https://media.istockphoto.com/id/1437707877/pl/zdj%C4%99cie/zielona-powierzchnia-li%C5%9Bci-abstrakcyjne-t%C5%82o-naturalny-wz%C3%B3r-li%C5%9Bcie-tropikalne-ciemne-li%C5%9Bcie.jpg?s=612x612&w=0&k=20&c=qeqaCP4Rr2n7Ejxc5EOcElU2SHRDAzA1mUUW-sIUtB0="; //cegła
    image.src =
      "https://www.eso.org/public/archives/images/publicationjpg/potw2107a.jpg";
    // image.src = "https://cdn.pixabay.com/photo/2013/09/22/19/14/brick-wall-185081_960_720.jpg"; //cegła
  }
  //texture2	PODŁOGA**************************************************************
  const texture2 = gl.createTexture();
  {
    gl.bindTexture(gl.TEXTURE_2D, texture2);
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
      gl.bindTexture(gl.TEXTURE_2D, texture2);
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
      "https://cdn.pixabay.com/photo/2017/02/07/09/02/wood-2045379_1280.jpg"; //podloga
  }

  //texture3 MAŁPA	**************************************************************

  const texture3 = gl.createTexture();
  {
    gl.bindTexture(gl.TEXTURE_2D, texture3);
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
      gl.bindTexture(gl.TEXTURE_2D, texture3);
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
      "https://media.istockphoto.com/id/1255687027/pl/zdj%C4%99cie/kamie%C5%84-szlachetny-lub-diamentowa-tekstura-z-bliska.webp?s=2048x2048&w=is&k=20&c=KqHnscipXI7zLaR2LuBUrwKrhcNCZO90hm8nx5nDibs="; //złoto metal
  }

  //texture4	TORUSFERA**************************************************************

  const texture4 = gl.createTexture();
  {
    gl.bindTexture(gl.TEXTURE_2D, texture4);
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
      gl.bindTexture(gl.TEXTURE_2D, texture4);
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
      "https://cdn.pixabay.com/photo/2016/11/21/13/29/yellow-1845394_1280.jpg"; //kamień
  }

  //texture5	SFERAA**************************************************************

  const texture5 = gl.createTexture();
  {
    gl.bindTexture(gl.TEXTURE_2D, texture5);
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = -1;
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
      gl.bindTexture(gl.TEXTURE_2D, texture5);
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
    // image.src = "https://www.eso.org/public/archives/images/publicationjpg/potw2107a.jpg"; //sfera
    image.src =
      "https://cdn.pixabay.com/photo/2013/09/22/19/14/brick-wall-185081_960_720.jpg";
  }

  gl.uniform1i(gl.getUniformLocation(program, "texture1"), 0);
  gl.uniform1i(gl.getUniformLocation(program, "texture2"), 1);
  gl.uniform1i(gl.getUniformLocation(program, "texture3"), 2);
  gl.uniform1i(gl.getUniformLocation(program, "texture4"), 3);
  gl.uniform1i(gl.getUniformLocation(program, "texture5"), 4);

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
    //    Perform the perspective projection for one eye's subfield.
    //    The projection is in the direction of the negative z-axis.
    //            _left=-6.0;
    //            _right=6.0;
    //            _bottom=-4.8;
    //             _top=4.8;
    //    [default: -6.0, 6.0, -4.8, 4.8]
    //    left, right, bottom, top = the coordinate range, in the plane of zero parallax setting,
    //         which will be displayed on the screen.
    //         The ratio between (right-left) and (top-bottom) should equal the aspect
    //    ratio of the display.
    //                  _near=6.0;
    //                  _far=-20.0;
    //    [default: 6.0, -6.0]
    //    near, far = the z-coordinate values of the clipping planes.
    //                  _zero_plane=0.0;
    //    [default: 0.0]
    //    zero_plane = the z-coordinate of the plane of zero parallax setting.
    //    [default: 14.5]
    //                     _dist=10.5;
    //   dist = the distance from the center of projection to the plane of zero parallax.
    //    [default: -0.3]
    //                 _eye=-0.3;
    //    eye = half the eye separation; positive for the right eye subfield,
    //    negative for the left eye subfield.

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

  switch (choosenModel) {
    case 1:
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
      points1 = triangles.length * 3;
      choosenModel++;
      break;
    case 2:
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
      points2 = triangles.length * 3;
      choosenModel++;
      break;
    case 3:
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer3);
      points3 = triangles.length * 3;
      choosenModel++;
      break;
    case 4:
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer4);
      points4 = triangles.length * 3;
      choosenModel++;
      break;
    case 5:
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer5);
      points5 = triangles.length * 3;
      choosenModel++;
      break;
  }

  points = triangles.length * 3;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vert_array), gl.STATIC_DRAW);
}
