function start() {

    const canvas = document.getElementById("my_canvas");
    const gl = canvas.getContext("webgl2");
 
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
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
       width, height, border, srcFormat, srcType,
       pixel);
    const image = new Image();
    image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texture1);
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,srcFormat, srcType, image);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	};
	image.crossOrigin = "";
	image.src = "https://cdn.pixabay.com/photo/2013/09/22/19/14/brick-wall-185081_960_720.jpg";

	// tekstura 2
	const texture2 = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture2);
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
		width, height, border, srcFormat, srcType,
		pixel);
	const image2 = new Image();
	image2.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texture2);
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,srcFormat, srcType, image2);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	};
	image2.crossOrigin = "";
	image2.src = "https://cdn.pixabay.com/photo/2012/03/03/23/06/wall-21534_1280.jpg";

      //*****************pointer lock object forking for cross browser**********************
    canvas.requestPointerLock = canvas.requestPointerLock ||
       canvas.mozRequestPointerLock;
    document.exitPointerLock = document.exitPointerLock ||
       document.mozExitPointerLock;
    canvas.onclick = function() {
       canvas.requestPointerLock();
    };
    // Hook pointer lock state change events for different browsers
    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
    function lockChangeAlert() {
       if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas) {
          console.log('The pointer lock status is now locked');
          document.addEventListener("mousemove", ustaw_kamere_mysz, false);
       } else {
          console.log('The pointer lock status is now unlocked');
          document.removeEventListener("mousemove", ustaw_kamere_mysz, false);
       }
    }
    
   //Inicialize the GL contex
    if (gl === null) {
       alert("Unable to initialize WebGL. Your browser or machine may not support it.");
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
 
    const vsSource =
       `#version 300 es  
       precision highp float;
       in vec3 position;
       in vec3 color;
       in vec2 aTexCoord;
       out vec2 TexCoord;
       uniform mat4 model;
       uniform mat4 view;
       uniform mat4 proj;
       out vec3 Color;
       void main(void)
        {
            Color = color;
            TexCoord = aTexCoord;
            gl_Position = proj * view * model * vec4(position,1.0);
        }`;
 
    const fsSource = `#version 300 es
      precision highp float;
      in vec3 Color;
      out vec4 frag_color;
      in vec2 TexCoord;
      uniform sampler2D texture1;
      uniform sampler2D texture2;
      void main(void)
   {
      // frag_color = vec4(Color,1.0);
      // frag_color = texture(texture1, TexCoord);
      frag_color = mix( texture(texture1, TexCoord),texture(texture2, TexCoord),0.5);
   }`;
 
   // compilation vs
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
       alert(gl.getShaderInfoLog(vs));
    }
 
   // compilation fs
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
       -0.5, -0.5, -0.5,  0.0, 0.0, 0.0,  0.0, 0.0,
       0.5, -0.5, -0.5,  0.0, 0.0, 1.0,  1.0, 0.0,
       0.5,  0.5, -0.5,  0.0, 1.0, 1.0,  1.0, 1.0,
       0.5,  0.5, -0.5,  0.0, 1.0, 1.0,  1.0, 1.0,
       -0.5,  0.5, -0.5,  0.0, 1.0, 0.0,  0.0, 1.0,
       -0.5, -0.5, -0.5,  0.0, 0.0, 0.0,  0.0, 0.0,
 
       -0.5, -0.5,  0.5,  0.0, 0.0, 0.0,  0.0, 0.0,
       0.5, -0.5,  0.5,  1.0, 0.0, 1.0,  1.0, 0.0,
       0.5,  0.5,  0.5,  1.0, 1.0, 1.0,  1.0, 1.0,
       0.5,  0.5,  0.5,  1.0, 1.0, 1.0,  1.0, 1.0,
       -0.5,  0.5,  0.5,  0.0, 1.0, 0.0,  0.0, 1.0,
       -0.5, -0.5,  0.5,  0.0, 0.0, 0.0,  0.0, 0.0,
 
       -0.5,  0.5,  0.5,  1.0, 0.0, 1.0,  0.0, 0.0,
       -0.5,  0.5, -0.5,  1.0, 1.0, 1.0,  1.0, 0.0,
       -0.5, -0.5, -0.5,  0.0, 1.0, 0.0,  1.0, 1.0,
       -0.5, -0.5, -0.5,  0.0, 1.0, 0.0,  1.0, 1.0,
       -0.5, -0.5,  0.5,  0.0, 0.0, 0.0,  0.0, 1.0,
       -0.5,  0.5,  0.5,  1.0, 0.0, 1.0,  0.0, 0.0,
 
       0.5,  0.5,  0.5,  1.0, 0.0, 1.0,  0.0, 0.0,
       0.5,  0.5, -0.5,  1.0, 1.0, 1.0,  1.0, 0.0,
       0.5, -0.5, -0.5,  0.0, 1.0, 0.0,  1.0, 1.0,
       0.5, -0.5, -0.5,  0.0, 1.0, 0.0,  1.0, 1.0,
       0.5, -0.5,  0.5,  0.0, 0.0, 0.0,  0.0, 1.0,
       0.5,  0.5,  0.5,  1.0, 0.0, 1.0,  0.0, 0.0,
 
       -0.5, -0.5, -0.5,  0.0, 1.0, 0.0,  0.0, 0.0,
       0.5, -0.5, -0.5,  1.0, 1.0, 1.0,  1.0, 0.0,
       0.5, -0.5,  0.5,  1.0, 0.0, 1.0,  1.0, 1.0,
       0.5, -0.5,  0.5,  1.0, 0.0, 1.0,  1.0, 1.0,
       -0.5, -0.5,  0.5,  0.0, 0.0, 0.0,  0.0, 1.0,
       -0.5, -0.5, -0.5,  0.0, 1.0, 0.0,  0.0, 0.0,
 
       -0.5,  0.5, -0.5,  0.0, 1.0, 0.0,  0.0, 0.0,
       0.5,  0.5, -0.5,  1.0, 1.0, 1.0,  1.0, 0.0,
       0.5,  0.5,  0.5,  1.0, 0.0, 1.0,  1.0, 1.0,
       0.5,  0.5,  0.5,  1.0, 0.0, 1.0,  1.0, 1.0,
       -0.5,  0.5,  0.5,  0.0, 0.0, 0.0,  0.0, 1.0,
       -0.5,  0.5, -0.5,  0.0, 1.0, 0.0,  0.0, 0.0
    ];
 
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
 
    const texCoord = gl.getAttribLocation(program, "aTexCoord");
    gl.enableVertexAttribArray(texCoord);
    gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 8*4, 6*4);
 
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
       window.requestAnimationFrame(draw);`
 
    // macierz modelu
    const model = mat4.create();
    let rotate_angle = (25 * Math.PI) / 180;
    mat4.rotate(model, model, rotate_angle, [0, 0, 1]);
    let uniModel = gl.getUniformLocation(program, "model");
    gl.uniformMatrix4fv(uniModel, false, model);

    // macierz projekcji
    const proj = mat4.create();
    mat4.perspective(proj,(60 * Math.PI) / 180, gl.canvas.clientWidth / gl.canvas.clientHeight,0.1,100);
    let uniProj = gl.getUniformLocation(program, "proj");
    gl.uniformMatrix4fv(uniProj, false, proj);
 
    // macierz widoku
    const view = mat4.create();
    mat4.lookAt(view, [0, 0, 3], [0, 0, -1], [0, 1, 0]);
    let uniView = gl.getUniformLocation(program, "view");
    gl.uniformMatrix4fv(uniView, false, view);

 
    let cameraPos = glm.vec3(0, 0, 3);
    let cameraFront = glm.vec3(0, 0, -1);
    let cameraUp = glm.vec3(0, 1, 0);
    let rotation = 0.0;

    let licznik=0;
    const fpsElem = document.querySelector("#fps");
    let startTime=0;
    let elapsedTime=0;
    function draw()
    {
       elapsedTime = performance.now() - startTime;
       startTime = performance.now();
       licznik++;
       let fFps = 1000/ elapsedTime;
       if(licznik>fFps){
          fpsElem.textContent = fFps.toFixed(1);
          licznik = 0;
       }
       setCamera();
       gl.clearColor(0, 0, 0, 1);
       gl.clear(gl.COLOR_BUFFER_BIT);
       //gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
       //gl.drawArrays(gl.TRIANGLES, 0, 36);

       gl.activeTexture(gl.TEXTURE0);
       gl.bindTexture(gl.TEXTURE_2D, texture2);
       gl.drawArrays(gl.TRIANGLES, 0, 12);
       gl.activeTexture(gl.TEXTURE1);
       gl.bindTexture(gl.TEXTURE_2D, texture1);
       gl.drawArrays(gl.TRIANGLES, 12, 24);
       gl.uniform1i(gl.getUniformLocation(program, "texture1"), 0);
       gl.uniform1i(gl.getUniformLocation(program, "texture2"), 1);
       //window.requestAnimationFrame(draw);
       setTimeout(() => {window.requestAnimationFrame(draw)}, 1000/30);
 
    }
    window.requestAnimationFrame(draw);
 
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
 
    if (gl.isEnabled(gl.DEPTH_TEST))
       gl.disable(gl.DEPTH_TEST);
    else
       gl.enable(gl.DEPTH_TEST);
    console.log("setcamera above");
 
    function setCamera() {
       let cameraSpeed = 0.002*elapsedTime;
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
		cameraPos.x-=cameraPos_tmp.x * cameraSpeed;
		cameraPos.y-=cameraPos_tmp.y * cameraSpeed;
       } else if (pressedKey["39"] === true) {
		// right
		// rotation += cameraSpeed;
		// cameraFront.x = Math.sin(rotation);
		// cameraFront.z = -Math.cos(rotation);
		let cameraPos_tmp = glm.normalize(glm.cross(cameraFront, cameraUp));
		cameraPos.x+=cameraPos_tmp.x * cameraSpeed;
		cameraPos.y+=cameraPos_tmp.y * cameraSpeed;
		cameraPos.z+=cameraPos_tmp.z * cameraSpeed;
       } else if (pressedKey["40"] === true) {
          // down
          cameraPos.x -= cameraSpeed * cameraFront.x;
          cameraPos.y -= cameraSpeed * cameraFront.y;
          cameraPos.z -= cameraSpeed * cameraFront.z;
       } else if (pressedKey["27"] === true) {
          if (confirm("Chcesz opuścić aplikację?")) {
             close();
          }
       }
       cameraFront_tmp.x = cameraPos.x + cameraFront.x;
       cameraFront_tmp.y = cameraPos.y + cameraFront.y;
       cameraFront_tmp.z = cameraPos.z + cameraFront.z;
       mat4.lookAt(view, cameraPos, cameraFront_tmp, cameraUp);
       gl.uniformMatrix4fv(uniView, false, view);
    }

    let x = 50; //zmiana położenia w kierunku x
    let y = 50; //zmiana położenia w kierunku y
    let yaw =-90; //obrót względem osi X
    let pitch=0; //obrót względem osi Y
    function ustaw_kamere_mysz(e){
       let xoffset = e.movementX;
       let yoffset = e.movementY;
       let sensitivity = 0.1; 
       let cameraSpeed = 0.05*elapsedTime; 
       xoffset *= sensitivity;
       yoffset *= sensitivity;
       yaw += xoffset * cameraSpeed;
       pitch -= yoffset*cameraSpeed;
       if (pitch > 89.0)
          pitch = 89.0;
       if (pitch < -89.0)
          pitch = -89.0;
       let front = glm.vec3(1,1,1);
       front.x = Math.cos(glm.radians(yaw))*Math.cos(glm.radians(pitch));
       front.y = Math.sin(glm.radians(pitch));
       front.z = Math.sin(glm.radians(yaw)) * Math.cos(glm.radians(pitch));
       cameraFront = glm.normalize(front);
    }
 }